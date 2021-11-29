const path = require("path");
require('dotenv').config({ path: 'client/.env.local' });

const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;

const moleChain = process.env.MOLE_CHAIN;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    molereum: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: moleChain,
      }),
      network_id: 6022140761023,
      chain_id: 6022140761023,
    }
  },
  compilers: {
    solc: {
      version: "^0.8.9"
    }
  }
};
