import { useState, useEffect } from 'react'
import { connect, keyStores, WalletConnection } from 'near-api-js'

interface Account {
  id: string,
  balance: string,
}

function App() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

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
      }
    }
  }

  const logIn = async () => wallet!.requestSignIn('example-contract.testnet', 'NEAR TRY');
  const logOut = async () => {
    wallet!.signOut();
    setAccount(null);
  };

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
          <p className="mb-4">Your balance is: {account.balance}</p>
          <button className="btn" type="button" onClick={logOut}>
            Log out
          </button>
        </>
      )}
    </div>
  )
}

export default App
