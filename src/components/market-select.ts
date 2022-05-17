import createElement from '../shared/create-element';
import type { Market } from '../shared/types';

export const getMarketSelect = (markets: Market[], onChange: (val: number) => void) => {
  const marketEls = markets.map((market) => {
    const el = createElement(
      'option',
      '',
      [`${market.base.ticker} / ${market.quote.ticker}`]
    ) as HTMLOptionElement;
    el.value = `${market.id}`;
    return el;
  });

  const selectEl = createElement('select', 'ml-4 cursor-pointer', marketEls);
  selectEl.addEventListener('change', (e) => {
    const val = parseInt((e.target as HTMLSelectElement).value);
    onChange(val);
  })

  return createElement('label', 'flex mb-5', [
    'Choose the market',
    selectEl,
  ]);
};
