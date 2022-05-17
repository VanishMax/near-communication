import type { Order } from '../shared/types'
import formatExponential from '../shared/format-exponential';

type MarketTableProps = JSX.IntrinsicElements['table'] & Readonly<{
  orders: Order[],
}>;

export default function MarketTable({ orders }: MarketTableProps) {
  return (
    <table>
      <thead>
      <tr>
        <th>Price</th>
        <th>Quantity</th>
      </tr>
      </thead>
      <tbody>
      {orders.map((order, i) => (
        <tr key={i}>
          <td>{formatExponential(order.price)}</td>
          <td>{formatExponential(order.quantity)}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
