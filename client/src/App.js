import React, { Component } from "react";
import {
  TextField,
  Container,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Phrase from "./contracts/Phrase.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    theme: null,
    web3: null,
    accounts: null,
    phraseContract: null,
    textFieldValue: "",
    phrase: "",
  };

  componentDidMount = async () => {
    try {
      // Set MaterialUI theme
      const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts and contract instance from network.
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      // Get Phrase contract instance
      const phraseNetwork = Phrase.networks[networkId];
      const phraseInstance = new web3.eth.Contract(
        Phrase.abi,
        phraseNetwork && phraseNetwork.address,
      );

      // Set web3, accounts, and contract to the state
      this.setState({
        theme: darkTheme,
        web3,
        accounts,
        phraseContract: phraseInstance,
      }, this.initialContractState);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  initialContractState = async () => {
    const phraseResponse = await this.state.phraseContract.methods.getPhrase().call();

    // Update state with the result from contract
    this.setState({ phrase: phraseResponse });
  };

  addWord = async () => {
    const { accounts, phraseContract } = this.state;

    // Submit transaction to add new word
    await phraseContract.methods.addWord(this.state.textFieldValue).send({ from: accounts[0] });

    // Update state with the result from contract
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
      return <div>Loading Web3, accounts, and contracts...</div>;
    }
    return (
      <ThemeProvider theme={this.state.theme}>
        <CssBaseline />
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
      </ThemeProvider>
    );
  }
}

export default App;
