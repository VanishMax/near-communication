import { useState, useEffect, ChangeEvent } from 'react'
import { utils as nearUtils } from 'near-api-js'
import type { Market, MarketData } from './shared/types'
import MarketTable from './components/market-table'
import useNear from './shared/use-near'

const { format: { formatNearAmount } } =  nearUtils

function App() {
  const { wallet, contract, account, initNear, logIn, logOut } = useNear()
  const [markets, setMarkets] = useState<Market[]>([])
  const [marketData, setMarketData] = useState<MarketData | null>(null)

  const loadTrades = async (marketId: number) => {
    const marketData = await contract!.view_market({ market_id: marketId })
    setMarketData(marketData)
  }

  const changeSelect = (e: ChangeEvent) => {
    const val = parseInt((e.target as HTMLSelectElement).value)
    loadTrades(val)
  }

  useEffect(() => {
    initNear()
  }, [])

  useEffect(() => {
    if (contract) {
      const loadInitialTrades = async () => {
        const res = await contract.markets({})
        if (res?.[0]) {
          loadTrades(res[0].id)
          setMarkets(res)
        }
      }

      loadInitialTrades()
    }
  }, [contract])

  if (!wallet) return (
    <div>Loading...</div>
  )

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
            <MarketTable orders={(marketData?.bid_orders || [])} />
            <MarketTable className="ml-8" orders={(marketData?.ask_orders || [])} />
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
