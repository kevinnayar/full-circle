import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import crypto  from 'crypto';
import workerpool from 'workerpool';
import puppeteer, { Browser } from 'puppeteer';
import Logger from './utils/logger';
import Cache from './utils/cache';

async function main() {
  const logger = new Logger('ApiServer');
  const imageCache = new Cache<1>(2);

  const allowedDomains: string[] = [process.env.CLIENT_URL];
  const apiPort = process.env.API_URL.split(':')[2];

  if (!apiPort) {
    throw new Error('Could not find api port');
  }

  const corsOptions = {
    origin: (origin: string, callback: (err?: Error, valid?: boolean) => void) => {
      const isValid = !origin || allowedDomains.indexOf(origin) !== -1;
      const errorMaybe = isValid ? null : new Error(`${origin} is not an allowed domain`);
      callback(errorMaybe, isValid);
    },
    credentials: true,
    maxAge: 86400,
  };

  const app = express();
  const pool = workerpool.pool();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static('public'));
  app.use(cors(corsOptions));

  const browser: Browser = await puppeteer.launch();

  async function requestLogger(req: Request, _res: Response, next: NextFunction) {
    logger.request(req);
    next();
  }

  async function getChart(req: Request, res: Response) {
    try {
      const { timerEnd } = logger.timer('get chart');

      const query = req.query.query as string;
      if (!query || typeof query !== 'string') {
        throw new Error('Query is required');
      }
      
      const hash = crypto.createHash('sha256').update(query).digest('hex');
      const imageName = `${hash}.png`;
      let imagePath;

      if (imageCache.has(imageName)) {
        imagePath = path.resolve(__dirname, `../public/${imageName}`);
        timerEnd('via cache');
      } else {
        const page = await browser.newPage();
        const url = `${process.env.CLIENT_URL}/chart?query=${query}`;

        await page.goto(url);
        await page.waitForSelector('.page > #chart');

        const image = await page.$('.page > #chart');
        imagePath = path.resolve(__dirname, `../public/${imageName}`);

        await image.screenshot({ path: imagePath });
        await page.close();

        timerEnd('via puppeteer');
      }

      if (!imagePath) {
        throw new Error('Could not save image');
      }

      imageCache.set(imageName, 1);

      res.setHeader('Content-type', 'image/png');
      res.sendFile(imagePath);
    } catch (e) {
      let error = 'An error occurred';
      if (typeof e === 'object' && 'message' in e) error = e.message.toString();
      if (typeof e === 'string') error = e;

      res.status(400).send({ error });
    }
  }

  async function getZipsToStates(req: Request, res: Response) {
    const page = await browser.newPage();
    const url = 'https://en.wikipedia.org/wiki/List_of_ZIP_Code_prefixes';

    await page.goto(url);
    await page.waitForSelector('#mw-content-text table');

    const data = await page.evaluate(() => {
      const elems = Array.from(document.querySelectorAll('#mw-content-text table tr td > b'));
      const zips = [];

      for (const elem of elems) {
        const text = elem.textContent;
        if (text) {
          const [zip, state] = text.split(' ');
          if (state) {
            const abbr = state.slice(0, 2);
            zips.push([zip, abbr]);
          }
        }
      }
      return zips;
    });

    for (const [zip, abbr] of data) {
      console.log(zip, abbr);
    }
  }

  async function slowCalc() {
    return new Promise((resolve) => {
      let counter = 0;
      for (let i = 0; i < 9_000_000_000; i += 1) {
        counter += 1;
      }
      resolve(counter);
    })
  }

  async function slowRequest(req: Request, res: Response) {
    const start = Date.now();
    logger.info({ message: 'slow:begin', start })
    // const result = await slowCalc();

    pool.exec(slowCalc)
      .then(result => res.status(200).send({ type: 'slow', result }))
      .catch(err => logger.error(err))
      .then(() => pool.terminate());

    logger.info({ message: 'slow:end', now: Date.now(), end: `${Date.now() - start}` })
    // return res.status(200).send({ type: 'slow', result });
  }
  
  async function fastRequest(req: Request, res: Response) {
    const start = Date.now();
    logger.info({ message: 'fast:begin', start })
    const result = 0;
    logger.info({ message: 'fast:end', now: Date.now(), end: `${Date.now() - start}` })
    return res.status(200).send({ type: 'fast', result });
  }


  app.get('/api/v1/chart', requestLogger, getChart);
  app.get('/api/v1/zips-to-states', requestLogger, getZipsToStates);
  app.get('/api/v1/slow', requestLogger, slowRequest);
  app.get('/api/v1/fast', requestLogger, fastRequest);

  app.listen(apiPort, () => {
    logger.info(`api server running at ${process.env.API_URL}`);
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});


