import { utils as nearUtils } from 'near-api-js';
import createElement from '../shared/create-element';

const { format: { formatNearAmount } } =  nearUtils;

export const getBalance = (id: string, balance: string) => createElement(
  'div',
  '',
  [
    createElement('h1', 'mb-2 text-2xl font-bold', [`Hi, ${id}!`]),
    createElement('p', 'mb-4', [`Your balance is: ${formatNearAmount(balance)} NEAR`])
  ],
);
