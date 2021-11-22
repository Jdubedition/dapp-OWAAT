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

## Adding or updating contracts
* Add solidity file to ./contracts
* Add import to ./migrations
* Create tests by adding solidity file and JS file to ./test
* Run `truffle test` to make sure everything is working as expected
* `yarn install` to install dependencies required for Molereum network migration
* Compile and Deploy contracts as using `truffle migrate`
* Import contract into ./client/src/App.js (or other JS file in client/src)

## Testing this DApp on [Molereum](https://github.com/Jdubedition/molereum) network
* Make sure you have a crypto wallet setup on your local machine, with an account on the Molereum network, and a MOLE balance large enough to pay for the gas cost of the migration (recommend using Brave browser Crypto Wallets or MetaMask extension)
* Create .env file from .env.template
* Export private key of your Molereum account from your wallet and add it into .env.local
* Migrate contracts to the network `truffle migrate --network molereum`
* Start client `yarn start`

## Recommended reading
* [Ethereum](https://ethereum.org/en/developers/docs/)
* [Truffle](https://www.trufflesuite.com/docs/truffle/overview)
