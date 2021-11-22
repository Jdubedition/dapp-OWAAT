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
    theme: null,
    web3: null,
    accounts: null,
    phraseContract: null,
    textFieldValue: "",
    textFieldIsDisabled: false,
    phrase: "",
    chosenAccount: 0,
    blockInfo: [],
    maxHistory: 15,
    blockExplorerIntervalID: null,
  };

  blockInfoTemplate = {
    number: 0,
    hash: "",
    transactions: [],
  }

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

  componentWillUnmount() {
    clearInterval(this.state.blockExplorerIntervalID);
  }

  getLatestBlocks = async () => {
    const { web3, maxHistory } = this.state;
    const latest = await web3.eth.getBlockNumber()
    const blockNumbers = [];
    for (let i = 0; i < maxHistory; i++) {
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

    // Get the latest blocks for history display
    const blockInfo = [];

    for (let block of blocks) {
      let blockObject = Object.assign({}, this.blockInfoTemplate);
      blockObject.number = block.number;
      blockObject.hash = block.hash;
      blockObject.transactions = [];
      if (block.transactions.length > 0) {
        for (const trans of block.transactions) {
          try {
            // There is probably a better way to parse the input, but I could not get
            // the method provided by web3js framework to work.
            const input = web3.utils.hexToString(trans.input);
            const regex = /[A-Za-z!,;?.]*$/;
            // blockInfo.push([block.hash, input.match(regex)[0]]);
            blockObject.transactions.push({
              hash: trans.hash,
              input: input.match(regex)[0]
            })
          } catch (error) {
            if (error.message !== "Cannot read property 'input' of undefined" && error.message !== "Invalid UTF-8 detected") {
              // First error is thrown on a new network, so we ignore it.
              // Second error is thrown on the first block in the chain, so we ignore it.
              console.error(error);
            }
          }
        }
      }
      blockInfo.push(blockObject);
    }

    // Update state with the result from contract
    this.setState({ blockInfo });
  }

  initialContractState = async () => {
    const { phraseContract } = this.state;
    const phraseResponse = await phraseContract.methods.getPhrase().call();

    this.getLatestBlocks();
    const blockExplorerIntervalID = window.setInterval(this.getLatestBlocks, 3000);

    // Update state with the result from contract
    this.setState({ phrase: phraseResponse, blockExplorerIntervalID });
  };

  addWord = async () => {
    const { accounts, phraseContract, chosenAccount } = this.state;

    // Submit transaction to add new word
    await phraseContract.methods.addWord(this.state.textFieldValue).send({ from: accounts[chosenAccount] });

    // Update state with the result from contract
    const response = await phraseContract.methods.getPhrase().call();
    this.setState({ phrase: response, textFieldValue: "" });
  }

  handleKeyPress = async (event, thisLink) => {
    if (event.key === "Enter" && this.state.textFieldValue !== "") {
      this.setState({ textFieldIsDisabled: true });
      try {
        await thisLink.addWord();
      } catch (error) {
        console.error(error);
      }
      this.setState({ textFieldIsDisabled: false });
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
                Story:
              </Typography>
              {this.state.phrase}
            </Paper>
          </Box>
          <Box>
            {this.state.textFieldIsDisabled &&
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
              disabled={this.state.textFieldIsDisabled}
            />
          </Box>
          <Box>
            <Typography variant="h6" component="div" align="center" gutterBottom>
              Block Information
            </Typography>
            <Typography variant="subtitle1" component="div" align="center" gutterBottom>
              (refreshes automatically)
            </Typography>
            <Typography variant="h8" component="div" align="center" gutterBottom>
              Block Number - Block Hash - Transaction Input
            </Typography>
            <List xs={6}>
              {this.state.blockInfo.map((block, index) => {
                return (
                  <Container key={index}>
                    <ListItem>
                      <ListItemText primary={[block.number, block.hash, (block.transactions ? block.transactions.map((trans) => trans.input) : [])].join(" - ")} />
                    </ListItem>
                    {index === this.state.blockInfo.length - 1 ? null : <Divider variant="middle" />}
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
