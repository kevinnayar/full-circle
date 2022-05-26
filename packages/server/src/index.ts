import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import puppeteer from 'puppeteer';

const config = {
  baseUrl: 'http://localhost',
  apiPort: 8080,
  clientPort: 1234,
};

const allowedDomains: string[] = [`${config.baseUrl}:${config.clientPort}`];

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

function formatError(error: any): string {
  if (typeof error === 'object' && 'message' in error) return error.message.toString();
  if (typeof error === 'string') return error;
  return 'An unkown error occurred';
}

async function getChart(req: Request, res: Response) {
  try {
    const query = req.query.query;
    if (!query) {
      throw new Error('Query is required');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = `${config.baseUrl}:${config.clientPort}/chart?query=${query}`;

    await page.goto(url);
    await page.waitForSelector('.page > #chart');

    const image = await page.$('.page > #chart');
    const imageName = 'chart.png';
    const imagePath = path.resolve(__dirname, `../public/${imageName}`);

    await image.screenshot({ path: imagePath });

    await page.close();
    await browser.close();

    res.setHeader('Content-type', 'image/png');
    res.sendFile(imagePath);
  } catch (e) {
    const error = formatError(e);
    res.status(400).send({ error });
  }
}

app.get('/api/v1/chart', getChart);

app.listen(config.apiPort, () => {
  console.log(`api server running at ${config.baseUrl}:${config.apiPort}`);
});


