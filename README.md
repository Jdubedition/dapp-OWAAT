# dapp-OWAAT

## Introduction
This is a DApp that demonstrates a simple implementation using the game of OWAAT (One Word At A Time).

## Running this DApp
* Clone this repository to your workstation
* Download and execute [Ganauche](https://www.trufflesuite.com/ganache), to run a local blockchain
* Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable), to run React client
* `cd client`
* `yarn install`
* `yarn start`, this should open `http://localhost:3000` in your default browser
* enjoy!

## Steps used to create this DApp
* Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview) CLI with `npm install -g truffle`
* Create a Truffle React application `truffle unbox react`
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
* Compile and Deploy contracts as using `truffle migrate`
* Import contract into ./client/src/App.js (or other JS file in client/src)
