import { useCallback, useState } from 'react';
import { Contract, WalletConnection } from 'near-api-js';
import { Account, MarketContract } from './types';
import nearConnect from './near-connect';

export default function useNear() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null)
  const [account, setAccount] = useState<Account | null>(null)
  const [contract, setContract] = useState<MarketContract | null>(null)

  const initNear = useCallback(async () => {
    const { wallet } = await nearConnect()

    if (wallet.getAccountId()) {
      const con = new Contract(wallet.account(), 'app_2.spin_swap.testnet', {
        viewMethods: ['markets', 'view_market'],
        changeMethods: [],
      }) as MarketContract

      setAccount({
        id: wallet.getAccountId(),
        balance: (await wallet.account().state()).amount,
      })
      setContract(con)
    }

    setWallet(wallet)
  }, [])

  const logIn = async () => wallet!.requestSignIn('example-contract.testnet', 'NEAR TRY')
  const logOut = async () => {
    wallet!.signOut()
    setAccount(null)
  }

  return {
    wallet,
    account,
    contract,
    initNear,
    logIn,
    logOut,
  }
}
