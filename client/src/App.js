import React, { Component } from "react";
import {
  TextField,
  Container,
  Paper,
  Box,
  Typography,
} from "@mui/material";

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import RandomNumberGeneratorContract from "./contracts/RandomNumberGenerator.json";
import Phrase from "./contracts/Phrase.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    randomValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    randomNumberGeneratorContract: null,
    phraseContract: null,
    textFieldValue: "",
    phrase: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      // Get the contract instance.
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Get RandomNumberGenerator contract instance
      const deployedNetwork2 = RandomNumberGeneratorContract.networks[networkId];
      const instance2 = new web3.eth.Contract(
        RandomNumberGeneratorContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Get Phrase contract instance
      const deployedNetwork3 = Phrase.networks[networkId];
      const instance3 = new web3.eth.Contract(
        Phrase.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        randomNumberGeneratorContract: instance2,
        phraseContract: instance3
      }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, randomNumberGeneratorContract, phraseContract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    const response2 = await randomNumberGeneratorContract.methods.getNumber().call();

    const response3 = await phraseContract.methods.getPhrase().call();

    // Update state with the result.
    this.setState({ storageValue: response, randomValue: response2, phrase: response3 });
  };

  addWord = async () => {
    const { accounts, phraseContract } = this.state;
    await phraseContract.methods.addWord(this.state.textFieldValue).send({ from: accounts[0] });
    // this.setState({ phrase: this.state.phrase + " " + this.state.textFieldValue });
    const response = await phraseContract.methods.getPhrase().call();
    this.setState({ phrase: response });
    this.setState({ textFieldValue: "" });
  }

  keyPress = async (event, thisLink) => {
    if (event.key === "Enter") {
      await thisLink.addWord();
    } else if (event.key === " ") {
      event.preventDefault();
    }
  }

  _handleTextFieldChange = (event) => {
    this.setState({
      textFieldValue: event.target.value
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Container maxWidth="md">
        <Typography variant="h2" component="div" gutterBottom>
          DApp One Word At A Time
        </Typography>
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} xs={9} sx={{ p: 5 }} >
            <Typography variant="h5" component="div" gutterBottom>
              Phrase:
            </Typography>
            {this.state.phrase}
          </Paper>
        </Box>
        <Box sx={{ my: 4 }}>
          <TextField
            id="new-word-textfield"
            label="New Word"
            variant="outlined"
            value={this.state.textFieldValue}
            onChange={this._handleTextFieldChange}
            onKeyDown={(event) => this.keyPress(event, this)}
          />
        </Box>
      </Container>
    );
  }
}

export default App;
