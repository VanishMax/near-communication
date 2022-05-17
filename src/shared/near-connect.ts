import { connect, keyStores, WalletConnection } from 'near-api-js';

const nearConnect = async () => {
  const near = await connect({
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    networkId: 'testnet',
    headers: {},
  })

  const wallet = new WalletConnection(near, null)

  return {
    near,
    wallet,
  }
}

export default nearConnect
