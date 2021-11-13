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
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    chosenAccount: 0,
    transactionInputs: [],
    maxHistory: 13,
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

  getLatestBlocks = async (n) => {
    const { web3 } = this.state;
    const latest = await web3.eth.getBlockNumber()
    const blockNumbers = [];
    for (let i = 0; i < n; i++) {
      blockNumbers.push(latest - i);
    }
    const batch = new web3.eth.BatchRequest()

    const total = blockNumbers.length;
    let counter = 0;
    let blocks = [];

    await new Promise(function (resolve, reject) {
      blockNumbers.forEach(blockNumber => {
        batch.add(
          web3.eth.getBlock.request(blockNumber, true, (error, data) => {
            if (error) return reject(error);

            counter++;
            blocks.push(data);

            if (counter === total) resolve();
          })
        )
      });

      batch.execute()
    });

    return blocks
  }

  initialContractState = async () => {
    const { phraseContract, web3, maxHistory } = this.state;
    const phraseResponse = await phraseContract.methods.getPhrase().call();

    // Get the latest blocks for history display
    const blocks = await this.getLatestBlocks(maxHistory);
    const transactionInputs = [];

    for (let block of blocks) {
      try {
        // There is probably a better way to parse the input, but I could not get
        // the method provided by web3js framework to work.
        const input = web3.utils.hexToString(block.transactions[0].input);
        const regex = /[A-Za-z!,;?.]*$/;
        transactionInputs.push([block.transactions[0].from, input.match(regex)[0]]);
      } catch (error) {
        if (error.message !== "Cannot read property 'input' of undefined" && error.message !== "Invalid UTF-8 detected") {
          // First error is thrown on a new network, so we ignore it.
          // Second error is thrown on the first block in the chain, so we ignore it.
          console.error(error);
        }
      }
    }

    // Update state with the result from contract
    this.setState({ phrase: phraseResponse, transactionInputs });
  };

  addWord = async () => {
    const { accounts, phraseContract, chosenAccount, transactionInputs, maxHistory } = this.state;

    // Submit transaction to add new word
    await phraseContract.methods.addWord(this.state.textFieldValue).send({ from: accounts[chosenAccount] });

    // Update state with the result from contract
    const response = await phraseContract.methods.getPhrase().call();
    let inputs;
    if (transactionInputs.length === maxHistory) {
      inputs = transactionInputs.slice(0, -1);
    } else {
      inputs = transactionInputs;
    }
    inputs.unshift([accounts[chosenAccount], this.state.textFieldValue]);
    this.setState({ phrase: response, textFieldValue: "", transactionInputs: inputs });
  }

  handleKeyPress = async (event, thisLink) => {
    if (event.key === "Enter") {
      await thisLink.addWord();
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
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contracts...</div>;
    }
    return (
      <ThemeProvider theme={this.state.theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Typography variant="h2" component="div" align="center" gutterBottom>
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
            />
          </Box>
          <Box>
            <List xs={6}>
              {this.state.transactionInputs.map((input, index) => {
                return (
                  <Container key={index}>
                    <ListItem>
                      <ListItemText primary={input.join(" - ")} />
                    </ListItem>
                    {index === this.state.transactionInputs.length - 1 ? null : <Divider variant="middle" />}
                  </Container>
                )
              })}
            </List>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
