import React, { Component } from "react";
import {
  TextField,
  Container,
  Paper,
  Box,
  Typography,
  CssBaseline,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Phrase from "./contracts/Phrase.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    theme: createTheme({
      palette: {
        mode: 'dark',
      },
    }),
    web3: null,
    accounts: null,
    phraseContract: null,
    textFieldValue: "",
    isProcessingTransaction: false,
    phrase: "",
    chosenAccount: 0,
    transactionHistory: [[]],
    maxHistory: 15,
    transactionHistoryIntervalID: null,
    web3ConnectionError: false,
  };

  componentDidMount = async () => {
    try {
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
        web3,
        accounts,
        phraseContract: phraseInstance,
      }, this.initialContractState);
    } catch (error) {
      this.setState({ web3ConnectionError: true });
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.transactionHistoryIntervalID);
  }

  updateDAppToChain = async () => {
    const { phraseContract } = this.state;
    const phrase = await phraseContract.methods.getPhrase().call();
    const transactionHistoryResponse = await phraseContract.methods.getTransactionHistory().call();
    const transactionHistory = [];
    for (let i = 0; i < transactionHistoryResponse[0].length; i++) {
      transactionHistory.push([transactionHistoryResponse[0][i], transactionHistoryResponse[1][i]]);
    }
    this.setState({ phrase, transactionHistory });
  }

  initialContractState = async () => {
    this.updateDAppToChain();

    if (!this.props.doNotRunUpdateDAppToChainInterval) {
      const transactionHistoryIntervalID = window.setInterval(this.updateDAppToChain, 3000);
      this.setState({ transactionHistoryIntervalID });
    }
  };

  addWord = async () => {
    const { accounts, phraseContract, chosenAccount, web3 } = this.state;

    // Submit transaction to add new word
    await phraseContract.methods.addWord(this.state.textFieldValue).send({ value: web3.utils.toWei('0.01', 'ether'), from: accounts[chosenAccount] });

    this.updateDAppToChain();
    this.setState({ textFieldValue: "" });
  }

  handleKeyPress = async (event, thisLink) => {
    if (event.key === "Enter" && this.state.textFieldValue !== "") {
      this.setState({ isProcessingTransaction: true });
      try {
        await thisLink.addWord();
      } catch (error) {
        console.error(error);
      }
      this.setState({ isProcessingTransaction: false });
    } else if (event.key === " ") {
      event.preventDefault();
    }
  }

  handleTextFieldChange = (event) => {
    this.setState({
      textFieldValue: event.target.value
    });
  }

  handleSelectChange = (event) => {
    this.setState({ chosenAccount: event.target.value });
  };

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography variant="h2" component="div" align="center" gutterBottom>
            DApp One Word At A Time
          </Typography>
          {
            this.state.web3 ? (
              <Container>
                <Box sx={{ my: 4 }}>
                  <Paper elevation={3} xs={9} sx={{ p: 5 }} >
                    <Typography variant="h5" component="div" gutterBottom>
                      Story:
                    </Typography>
                    {this.state.phrase}
                  </Paper>
                </Box>
                <Box>
                  {this.state.isProcessingTransaction &&
                    <LinearProgress color="inherit" />
                  }
                </Box>
                <Box sx={{ my: 2 }}>
                  <FormControl sx={{ m: 1, minWidth: 450 }}>
                    <InputLabel id="select-account-label">Select Account</InputLabel>
                    <Select
                      labelId="select-account-label"
                      id="select-account"
                      value={this.state.chosenAccount}
                      label="Select Account"
                      onChange={this.handleSelectChange}
                    >
                      {this.state.accounts.map((account, index) =>
                        <MenuItem value={index} key={account}>{account}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ m: 1, minWidth: 200 }}
                    id="new-word-textfield"
                    label="New Word"
                    variant="outlined"
                    value={this.state.textFieldValue}
                    onChange={this.handleTextFieldChange}
                    onKeyDown={(event) => this.handleKeyPress(event, this)}
                    disabled={this.state.isProcessingTransaction}
                  />
                </Box>
                <Box sx={{ px: 8 }}>
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Transaction History
                  </Typography>
                  <Typography variant="h8" component="div" align="center" gutterBottom>
                    Address - Word
                  </Typography>
                  <List>
                    {this.state.transactionHistory.map((transaction, index) => {
                      return (
                        <Container key={index}>
                          <ListItem>
                            <ListItemText primary={transaction.join(" - ")} />
                          </ListItem>
                          {index === this.state.transactionHistory.length - 1 ? null : <Divider variant="middle" />}
                        </Container>
                      )
                    })}
                  </List>
                </Box>
              </Container>
            ) : (
              <Container maxWidth="md">
                {!this.state.web3ConnectionError ? (
                  <Container>
                    <Typography variant="h5" component="div" align="center" gutterBottom>
                      Loading Web3, accounts, and contracts...
                    </Typography>
                    <LinearProgress color="inherit" />
                  </Container>
                ) : (
                  <Container>
                    <Typography variant="h5" component="div" align="center" gutterBottom>
                      Error connecting to DApp!
                    </Typography>
                    <Typography variant="h8" component="div" align="center" gutterBottom>
                      Make sure you have configured a wallet and you are connected to the right network.
                    </Typography>
                    <Typography variant="h8" component="div" align="center" gutterBottom>
                      Refresh the page to try again.
                    </Typography>
                  </Container>
                )}
              </Container>)
          }
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
