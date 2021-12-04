const path = require("path");
require('dotenv').config({ path: 'client/.env.local' });

const HDWalletProvider = require("@truffle/hdwallet-provider");

const testAccountPrivateKey = process.env.TEST_ACCOUNT_PRIVATE_KEY;
const maticVigilID = process.env.MATIC_VIGIL_ID;

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
    matic: {
      // Register for Matic Vigil ID at https://rpc.maticvigil.com/
      provider: () => new HDWalletProvider({
        privateKeys: [testAccountPrivateKey],
        providerOrUrl: "https://rpc-mumbai.maticvigil.com/v1/" + maticVigilID
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "^0.8.9"
    }
  }
};
