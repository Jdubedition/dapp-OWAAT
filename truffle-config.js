const path = require("path");
require('dotenv').config({ path: 'client/.env.local' });

const HDWalletProvider = require("@truffle/hdwallet-provider");

const testAccountPrivateKey = process.env.TEST_ACCOUNT_PRIVATE_KEY;
const mainAccountPrivateKey = process.env.MAIN_ACCOUNT_PRIVATE_KEY;
const moralisSpeedyNodeID = process.env.MORALIS_SPEEDY_NODE_ID;

const moleChain = process.env.MOLE_CHAIN;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      provider: () => new HDWalletProvider({
        privateKeys: [testAccountPrivateKey],
        providerOrUrl: "http://localhost:7545",
      }),
      network_id: "*"
    },
    molereum: {
      provider: () => new HDWalletProvider({
        privateKeys: [testAccountPrivateKey],
        providerOrUrl: moleChain,
      }),
      network_id: 6022140761023,
      chain_id: 6022140761023,
    },
    mumbai: {
      // Register for Moralis Speedy Node ID at https://moralis.io/
      provider: () => new HDWalletProvider({
        privateKeys: [testAccountPrivateKey],
        providerOrUrl: "https://speedy-nodes-nyc.moralis.io/" + moralisSpeedyNodeID + "/polygon/mumbai"
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygon: {
      // Register for Moralis Speedy Node ID at https://moralis.io/
      provider: () => new HDWalletProvider({
        privateKeys: [mainAccountPrivateKey],
        providerOrUrl: "https://speedy-nodes-nyc.moralis.io/" + moralisSpeedyNodeID + "/polygon/mainnet"
      }),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      // gasPrice: 601000000000,  // 601 gwei used to prioritize transactions to ensure deployment
    },
  },
  compilers: {
    solc: {
      version: "^0.8.10"
    }
  }
};
