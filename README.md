# DApp-OWAAT

## Introduction
This is a decentralized application (DApp) that demonstrates a simple implementation using the game of OWAAT (One Word At A Time).

## Access this DApp
* Must have a crypto wallet
* Connect account to one of the following networks:
  * Polygon Mumbai Test Network
    * Recommend registering for a free RPC Moralis account at [https://moralis.io/](https://moralis.io/)
    * Add OWAAT application to get a free endpoint/ID registered with the network
    * Add the test network RPC endpoint/ID to your wallet
    * Go to Polygon faucet to get MATIC [https://faucet.polygon.technology/](https://faucet.polygon.technology/)
  * [Molereum](https://github.com/Jdubedition/molereum) private network
    * Add RPC endpoint to your wallet, [https://molereum.jdubedition.com](https://molereum.jdubedition.com)
    * Currently no faucet for this network, so have to contact Justin to get MOLE for your account
* Go to [dapp-owaat.jdubedition.com](https://dapp-owaat.jdubedition.com)

## Running this DApp
* Clone this repository to your workstation
* Download and execute [Ganache](https://www.trufflesuite.com/ganache), to run a local blockchain (choose Quickstart network option in GUI)
* Setup account information for the DApp
  * Import private key for one of the Ganache accounts into your wallet
  * Transfer funds from the imported account to the test account in your wallet
  * Copy .env.template to .env.local and add the private key for your test account
* Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
* Push contracts to Ganache
  * `yarn install`
  * `truffle migrate --network develop`
* Run the DApp
    * `cd client`
    * `yarn install`
    * `yarn start`, this should open `http://localhost:3000` in your default browser
* enjoy!

## Steps used to create this DApp
* Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview) CLI with `npm install -g truffle`
* Create a Truffle React application `truffle unbox react`
* Change port setting to `7545` (to use Ganache) in `truffle-config.js` and getWeb3.js
* Update `truffle-config.js` to use Molereum network
* Add NPM dependencies to `package.json` to support Molereum network
* Add Material-UI to the project:
    * `cd client`
    * Update dependencies for good measure: `yarn upgrade-interactive --latest`
    * `yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material`
    * Add the following elements to the `<head>` section of index.html:
    ```
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
    ```
* Add OpenZeppelin upgradeable contracts for truffle `yarn add -D @openzeppelin/truffle-upgrades` (note when compiling or migrating, this will add a .openzeppelin directory to the project and this will be used to link ProxyAdmin and TransparentUpgradableProxy contracts with the Truffle contracts in client/src/contracts directory)
* Use upgradeable contracts for OpenZeppelin Ownable by installing `yarn add @openzeppelin/contracts-upgradeable` and then `truffle compile --all` to make sure it extracts the upgradeable contracts that are implemented in the truffle contracts
* Use [CloudFlare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-application) React application configuration.  A few settings to point at the `client` directory, run `yarn build`, and use the custom domain of [dapp-owaat.jdubedition.com](https://dapp-owaat.jdubedition.com) and it is all set.
* Use OpenZeppelin test environment instead of `truffle test` as it is a lot faster and easier to understand.  Add the dependencies to the project `yarn add -D @openzeppelin/test-environment @openzeppelin/test-helpers mocha chai` and add `test-environment.config.js` and set the build directory to `client/src/contracts`.  Update package.json to include:
  ```
  "scripts": {
    "test": "mocha --exit --recursive"
  }
  ```
  and then run `truffle compile` and then `yarn test` to run the tests.  Each time you modify the contracts you will need to run `truffle compile` and then you can run `yarn test` to run the tests.

## Adding contracts
* `yarn install` to install dependencies
* Add solidity file to ./contracts
* Add deployProxy to ./migrations (uses [OpenZeppelin](https://docs.openzeppelin.com/learn/upgrading-smart-contracts) deployProxy for upgrading contracts later, has additional expense of deploying ProxyAdmin and TransparentUpgradeableProxy contracts for each contract)
* Create tests by adding solidity file and JS file to ./test
* Run `truffle test` to make sure everything is working as expected
* Compile and Deploy contracts as using `truffle migrate` (use `--network <network>` to deploy to a specific network)
* Import contract into ./client/src/App.js (or other JS file in client/src)

## Upgrading contracts
* `yarn install` to install dependencies
* Add solidity file to ./contracts with suffix designation of next version (e.g. V2 or V3)
* Add upgradeProxy to ./migrations (uses OpenZeppelin upgradeProxy and new contract version)
* Update tests associated with contract JS file in ./test
* Run `truffle compile` to create new contract artifacts
* Run `yarn test` to make sure everything is working as expected
* Compile and Deploy contracts as using `truffle migrate` (use `--network <network>` to deploy to a specific network)
* Update ./client/src/App.js to import new contract version

## Testing this DApp on [Molereum](https://github.com/Jdubedition/molereum) network
* Make sure you have a crypto wallet setup on your local machine, with an account on the Molereum network, and a MOLE balance large enough to pay for the gas cost of the migration (recommend using Brave browser Crypto Wallets or MetaMask extension)
* Create .env file from .env.template
* Export private key of your Molereum account from your wallet and add it into .env.local
* Migrate contracts to the network `truffle migrate --network molereum`
* Start client `yarn start`

## Recommended reading
* [Ethereum](https://ethereum.org/en/developers/docs/)
* [Truffle](https://www.trufflesuite.com/docs/truffle/overview)
* [OpenZeppelin](https://docs.openzeppelin.com/learn/)

## Development TODO
* Set a base price for up to 13 characters and add a price per character for each additional character
* Add more client tests
