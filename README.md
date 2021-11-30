# DApp-OWAAT

## Introduction
This is a decentralized application (DApp) that demonstrates a simple implementation using the game of OWAAT (One Word At A Time).

## Running this DApp
* Clone this repository to your workstation
* Download and execute [Ganauche](https://www.trufflesuite.com/ganache), to run a local blockchain (choose Quickstart network option in GUI)
* Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable), to run React client
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
* Update tests associated with contract solidity file and JS file in ./test
* Run `truffle test` to make sure everything is working as expected
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
