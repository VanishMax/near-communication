import type { Contract } from 'near-api-js';

export interface Account {
  id: string,
  balance: string,
}

interface MarketBase {
  ticker: string,
  decimal: number,
  address: string,
}
export interface Market {
  base: MarketBase,
  quote: MarketBase,
  fee: number,
  id: number,
}

export interface Order {
  price: number,
  quantity: number,
}
export interface MarketData {
  ask_orders: Order[],
  bid_orders: Order[],
}

export interface MarketContract extends Contract {
  markets: (opts: {}) => Promise<Market[]>,
  view_market: (opts: { market_id: number }) => Promise<MarketData>,
}
