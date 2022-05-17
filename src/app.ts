import nearConnect from './shared/near-connect';
import { hideLoading, Loading } from './components/loading';
import { getContainer } from './components/container';
import { LogIn } from './components/log-in';
import { getBalance } from './components/balance';
import { LogOut } from './components/log-out';
import { getMarketTable, getTables } from './components/market-table';
import { getMarketSelect } from './components/market-select';

const startApp = async () => {
  const root = document.querySelector('#root') as Element;
  root.append(Loading);

  const { account, wallet, contract } = await nearConnect();
  hideLoading();

  const initUnAuthContainer = () => {
    const UnAuthContainer = getContainer();
    UnAuthContainer.append(LogIn);

    LogIn.addEventListener('click', () => {
      wallet.requestSignIn('example-contract.testnet', 'NEAR TRY');
    });

    root.append(UnAuthContainer);
  };

  const initAuthContainer = async () => {
    const Balance = getBalance(account!.id, account!.balance);

    const AuthContainer = getContainer();
    AuthContainer.append(Balance);
    AuthContainer.append(LogOut);

    let activeMarketId: number | null = null;
    let MarketTables: HTMLElement | null = null;
    const loadTrades = async () => {
      if (!activeMarketId) return;

      const marketData = await contract!.view_market({ market_id: activeMarketId });
      const NewTables = getTables([
        getMarketTable(marketData.bid_orders),
        getMarketTable(marketData.ask_orders),
      ]);
      if (MarketTables) AuthContainer.removeChild(MarketTables);
      MarketTables = NewTables;
      AuthContainer.append(MarketTables);
    }

    const markets = await contract!.markets({});

    const Select = getMarketSelect(markets, (newMarket) => {
      activeMarketId = newMarket;
      loadTrades();
    });
    AuthContainer.append(Select);

    if (markets?.[0]) {
      activeMarketId = markets[0].id;
      await loadTrades();
    }

    LogOut.addEventListener('click', () => {
      wallet.signOut();
      root.removeChild(AuthContainer);
      initUnAuthContainer();
    });

    root.append(AuthContainer);
  };

  if (!account) {
    initUnAuthContainer();
  } else {
    await initAuthContainer();
  }
};

export default startApp;
