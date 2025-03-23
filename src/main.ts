import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { BinanceOrderBookAppComponent } from './app/binance-order-book-app.component';

bootstrapApplication(BinanceOrderBookAppComponent, appConfig)
  .catch((err) => console.error(err));
