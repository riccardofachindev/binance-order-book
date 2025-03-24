export interface OrderBookState {
  activeSymbols: string[];
}

export const initialState: OrderBookState = {
  activeSymbols: []
};
