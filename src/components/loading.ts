import createElement from '../shared/create-element';

export const Loading = createElement(
  'div',
  'flex visible opacity-100 transition justify-center items-center fixed inset-0',
  [createElement('p', 'text-2xl', ['Loading...'])]);

export const hideLoading = () => {
  Loading.classList.replace('opacity-100', 'opacity-0');
  Loading.classList.add('pointer-events-none');
}
