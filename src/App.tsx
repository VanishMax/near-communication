import { useState, useEffect } from 'react'
import { connect, keyStores, WalletConnection } from 'near-api-js'

function App() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);

  const initNear = async () => {
    if (!wallet) {
      const near = await connect({
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        headers: {},
      });
      const wallet = new WalletConnection(near, null);
      setWallet(wallet);
    }
  }

  const logIn = async () => {
    const res = wallet!.requestSignIn({
      contractId: 'contract',
      // methodNames: [contract.addMessage.name]
    });
    console.log(res);
  };

  useEffect(() => {
    initNear()
  }, [])

  if (!wallet) return (
    <div>Loading...</div>
  );

  return (
    <div className="p-4">
      <button type="button" onClick={logIn}>
        Log In
      </button>
    </div>
  )
}

export default App
