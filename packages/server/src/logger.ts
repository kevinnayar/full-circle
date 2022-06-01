import chalk, { Color } from 'chalk';
import { Request } from 'express';

export default class Logger {
  namespace: string;

  constructor(namespace?: string) {
    this.namespace = namespace ? chalk.magenta(namespace) : '';
  }

  private label = (type: 'info' | 'warn' | 'error' | 'req') => {
    let color: typeof Color;

    switch (type) {
      case 'info': color = 'bgGreen'; break;
      case 'warn': color = 'bgYellow'; break;
      case 'error': color = 'bgRed'; break;
      case 'req': color = 'bgCyan'; break;
      default: throw new Error(`Unrecognized label type: ${type}`);
    }

    return [
      chalk.inverse(` ${Date.now()} `),
      chalk[color].rgb(0, 0, 0).bold(` ${type} `),
    ];
  }

  info(...messages: any) {
    console.log(...this.label('info'), this.namespace, ...messages);
  }

  warn(...messages: any) {
    console.log(...this.label('warn'), this.namespace, ...messages);
  }

  error(e: Error | string) {
    const err = e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : e;
    console.error(...this.label('error'), this.namespace, err);
  }

  request(req: Request) {
    const url = req.url.split('?')[0];
    const { method, body, params, query } = req;
    const message = {
      url,
      method,
      body,
      params,
      query,
      utcTimestamp: Date.now(),
    };

    console.log(...this.label('req'), this.namespace, message);
  }

  timer(operation: string) {
    const beganAt = Date.now();
    const timerEnd = (extra?: string) => {
      const diff = Date.now() - beganAt;
      const messages = extra ? [`${operation} -> ${extra}`, diff] : [operation, diff];
      console.log(...this.label('info'), this.namespace, ...messages);
    };
    return {
      beganAt,
      timerEnd,
    };
  }
}
