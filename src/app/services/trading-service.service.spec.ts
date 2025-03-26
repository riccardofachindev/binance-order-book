import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ExchangeInfo } from '../shared/exchange-info';
import { TradingService } from './trading-service.service';

describe('TradingService', () => {
  let service: TradingService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TradingService],
    });
    service = TestBed.inject(TradingService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchTradingPairs', () => {
    it('should return an array of trading pair symbols when the API call is successful', () => {
      const mockExchangeInfo: ExchangeInfo = {
        symbols: [
          { symbol: 'BTCUSDT', status: 'TRADING', baseAsset: 'BTC', baseAssetPrecision: 8, quoteAsset: 'USDT', isSpotTradingAllowed: true },
          { symbol: 'ETHUSDT', status: 'TRADING', baseAsset: 'ETH', baseAssetPrecision: 8, quoteAsset: 'USDT', isSpotTradingAllowed: true },
          { symbol: 'BNBUSDT', status: 'TRADING', baseAsset: 'BNB', baseAssetPrecision: 8, quoteAsset: 'USDT', isSpotTradingAllowed: true },
          { symbol: 'LTCBTC', status: 'TRADING', baseAsset: 'LTC', baseAssetPrecision: 8, quoteAsset: 'BTC', isSpotTradingAllowed: true },
          { symbol: 'ADAUSD', status: 'TRADING', baseAsset: 'ADA', baseAssetPrecision: 8, quoteAsset: 'USD', isSpotTradingAllowed: true },
          { symbol: 'DOTEUR', status: 'TRADING', baseAsset: 'DOT', baseAssetPrecision: 8, quoteAsset: 'EUR', isSpotTradingAllowed: false }
        ],
        timezone: 'UTC',
        serverTime: 1678886400000,
        rateLimits: [],
        exchangeFilters: []
      };

      service.fetchTradingPairs().subscribe((pairs) => {
        expect(pairs).toEqual(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSD']);
      });

      const req = httpTestingController.expectOne('https://api.binance.com/api/v3/exchangeInfo');
      expect(req.request.method).toBe('GET');
      req.flush(mockExchangeInfo);
    });

    it('should handle an empty symbols array', () => {
      const mockExchangeInfo: ExchangeInfo = {
        symbols: [],
        timezone: 'UTC',
        serverTime: 1678886400000,
        rateLimits: [],
        exchangeFilters: []
      };

      service.fetchTradingPairs().subscribe((pairs) => {
        expect(pairs).toEqual([]);
      });

      const req = httpTestingController.expectOne('https://api.binance.com/api/v3/exchangeInfo');
      expect(req.request.method).toBe('GET');
      req.flush(mockExchangeInfo);
    });

    it('should filter out symbols where isSpotTradingAllowed is false', () => {
      const mockExchangeInfo: ExchangeInfo = {
        symbols: [
          {
            symbol: 'BTCUSDT',
            status: 'TRADING',
            baseAsset: 'BTC',
            baseAssetPrecision: 8,
            quoteAsset: 'USDT',
            isSpotTradingAllowed: true
          },
          {
            symbol: 'LTCBTC',
            status: 'TRADING',
            baseAsset: 'LTC',
            baseAssetPrecision: 8,
            quoteAsset: 'BTC',
            isSpotTradingAllowed: false
          },
        ],
        timezone: 'UTC',
        serverTime: 1678886400000,
        rateLimits: [],
        exchangeFilters: []
      };

      service.fetchTradingPairs().subscribe((pairs) => {
        expect(pairs).toEqual(['BTCUSDT']);
      });

      const req = httpTestingController.expectOne('https://api.binance.com/api/v3/exchangeInfo');
      expect(req.request.method).toBe('GET');
      req.flush(mockExchangeInfo);
    });

    it('should filter out symbols where quoteAsset is not USDT or USD', () => {
      const mockExchangeInfo: ExchangeInfo = {
        symbols: [
          {
            symbol: 'BTCUSDT',
            status: 'TRADING',
            baseAsset: 'BTC',
            baseAssetPrecision: 8,
            quoteAsset: 'USDT',
            isSpotTradingAllowed: true
          },
          {
            symbol: 'DOTEUR',
            status: 'TRADING',
            baseAsset: 'DOT',
            baseAssetPrecision: 8,
            quoteAsset: 'EUR',
            isSpotTradingAllowed: true
          },
        ],
        timezone: 'UTC',
        serverTime: 1678886400000,
        rateLimits: [],
        exchangeFilters: []
      };

      service.fetchTradingPairs().subscribe((pairs) => {
        expect(pairs).toEqual(['BTCUSDT']);
      });

      const req = httpTestingController.expectOne('https://api.binance.com/api/v3/exchangeInfo');
      expect(req.request.method).toBe('GET');
      req.flush(mockExchangeInfo);
    });
  });
});
