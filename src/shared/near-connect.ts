import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import type { Account, MarketContract } from './types';

interface ConnectReturn {
  wallet: WalletConnection,
  contract: MarketContract | null,
  account: Account | null,
}
const nearConnect = async (): Promise<ConnectReturn> => {
  const near = await connect({
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    networkId: 'testnet',
    headers: {},
  });

  const wallet = new WalletConnection(near, null);

  if (wallet.getAccountId()) {
    const contract = new Contract(wallet.account(), 'app_2.spin_swap.testnet', {
      viewMethods: ['markets', 'view_market'],
      changeMethods: [],
    }) as MarketContract;

    const account = {
      id: wallet.getAccountId(),
      balance: (await wallet.account().state()).amount,
    };

    return { wallet, contract, account };
  }

  return {
    wallet, contract: null, account: null,
  };
};

export default nearConnect
