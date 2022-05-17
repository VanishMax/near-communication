import { useState, useEffect, ChangeEvent } from 'react'
import { connect, keyStores, WalletConnection, Contract, utils as nearUtils } from 'near-api-js'

const { format: { formatNearAmount, NEAR_NOMINATION_EXP } } =  nearUtils;

const formatExponential = (num: number): string => {
  return Number(num / Math.pow(10, NEAR_NOMINATION_EXP)).toFixed(4)
}

interface Account {
  id: string,
  balance: string,
}

interface MarketBase {
  ticker: string,
  decimal: number,
  address: string,
}
interface Market {
  base: MarketBase,
  quote: MarketBase,
  fee: number,
  id: number,
}

interface Order {
  price: number,
  quantity: number,
}
interface MarketData {
  ask_orders: Order[],
  bid_orders: Order[],
}

interface MarketContract extends Contract {
  markets: (opts: {}) => Promise<Market[]>,
  view_market: (opts: { market_id: number }) => Promise<MarketData>,
}

function App() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [contract, setContract] = useState<MarketContract | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  const initNear = async () => {
    if (!wallet) {
      const near = await connect({
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        networkId: 'testnet',
        headers: {},
      });
      const wallet = new WalletConnection(near, null);
      setWallet(wallet);

      if (wallet.getAccountId()) {
        setAccount({
          id: wallet.getAccountId(),
          balance: (await wallet.account().state()).amount,
        })

        const con = new Contract(wallet.account(), 'app_2.spin_swap.testnet', {
          viewMethods: ['markets', 'view_market'],
          changeMethods: [],
        }) as MarketContract
        setContract(con)

        const res = await con.markets({})
        if (res?.[0]) loadTrades(res[0].id, con)
        setMarkets(res)
      }
    }
  }

  const loadTrades = async (marketId: number, con?: MarketContract) => {
    const marketData = await (con || contract)!.view_market({ market_id: marketId })
    setMarketData(marketData)
    console.log(marketData)
  }

  const logIn = async () => wallet!.requestSignIn('example-contract.testnet', 'NEAR TRY');
  const logOut = async () => {
    wallet!.signOut();
    setAccount(null);
  };

  const changeSelect = (e: ChangeEvent) => {
    const val = parseInt((e.target as HTMLSelectElement).value)
    loadTrades(val)
  }

  useEffect(() => {
    initNear()
  }, [])

  if (!wallet) return (
    <div>Loading...</div>
  );

  return (
    <div className="p-4">
      {!account ? (
        <>
          <h1 className="mb-2 text-2xl font-bold">Hi! Who are you?</h1>
          <button className="btn" type="button" onClick={logIn}>
            Log In
          </button>
        </>
      ) : (
        <>
          <h1 className="mb-2 text-2xl font-bold">Hi, {account.id}!</h1>
          <p className="mb-4">Your balance is: {formatNearAmount(account.balance)} NEAR</p>

          <label className="flex mb-5">
            Choose the market
            <select className="ml-4 cursor-pointer" onChange={changeSelect}>
              {markets.map((market) => (
                <option key={market.id} value={market.id}>
                  {market.base.ticker} / {market.quote.ticker}
                </option>
              ))}
            </select>
          </label>

          <h3>Here's the data for the selected market</h3>
          <div className="flex">
            <table>
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(marketData?.bid_orders || []).map((order, i) => (
                  <tr key={i}>
                    <td>{formatExponential(order.price)}</td>
                    <td>{formatExponential(order.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="ml-8">
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(marketData?.ask_orders || []).map((order, i) => (
                  <tr key={i}>
                    <td>{formatExponential(order.price)}</td>
                    <td>{formatExponential(order.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <button className="btn" type="button" onClick={logOut}>
            Log out
          </button>
        </>
      )}
    </div>
  )
}

export default App
