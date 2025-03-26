export interface ExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: RateLimit[];
  exchangeFilters: [];
  symbols: SymbolInfo[];
}

export interface RateLimit {
  rateLimitType?: string;
  interval?: string;
  intervalNum?: number;
  limit?: number;
}

export interface SymbolInfo {
  symbol: string;
  status?: string;
  baseAsset?: string;
  baseAssetPrecision?: number;
  quoteAsset: string;
  quotePrecision?: number;
  quoteAssetPrecision?: number;
  baseCommissionPrecision?: number;
  quoteCommissionPrecision?: number;
  filters?: Filter;
  permissions?: string;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed?: boolean;
  ocoAllowed?: boolean;
  allowTrailingStop?: boolean;
  cancelReplaceAllowed?: boolean;
  isEtfMarket?: boolean;
}

export interface Filter {
  filterType: string;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  minQty?: string;
  maxQty?: string;
  stepSize?: string;
}
