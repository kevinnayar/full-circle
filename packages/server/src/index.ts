import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import crypto  from 'crypto';
import puppeteer, { Browser } from 'puppeteer';
import Logger from './logger';

async function main() {
  const logger = new Logger('ApiServer');
  const imageCache: Record<string, 1> = {};

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

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static('public'));
  app.use(cors(corsOptions));

  const browser: Browser = await puppeteer.launch();

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

      if (imageCache[imageName]) {
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

      imageCache[imageName] = 1;

      res.setHeader('Content-type', 'image/png');
      res.sendFile(imagePath);
    } catch (e) {
      let error = 'An error occurred';
      if (typeof e === 'object' && 'message' in e) error = e.message.toString();
      if (typeof e === 'string') error = e;

      res.status(400).send({ error });
    }
  }

  app.get('/api/v1/chart', getChart);

  app.listen(apiPort, () => {
    logger.info(`api server running at ${process.env.API_URL}`);
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});


