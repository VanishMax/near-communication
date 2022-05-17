import createElement from '../shared/create-element';
import formatExponential from '../shared/format-exponential';
import type { Order } from '../shared/types';

export const getMarketTable = (orders: Order[]) => createElement('table', '', [
  createElement('thead', '', [
    createElement('th', '', ['Price']),
    createElement('th', '', ['Quantity']),
  ]),
  createElement('tbody', '', orders.map((order) =>
    createElement('tr', '', [
      createElement('td', '', [formatExponential(order.price)]),
      createElement('td', '', [formatExponential(order.quantity)]),
    ]),
  )),
]);

export const getTables = (tables: HTMLElement[]) => createElement('div', 'flex', tables);
