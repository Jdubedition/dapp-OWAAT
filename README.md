# dapp-OWAAT

## Introduction
This is a DApp that demonstrates a simple implementation using the game of OWAAT (One Word At A Time).

## Steps to create this DApp
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
