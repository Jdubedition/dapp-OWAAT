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
  Autocomplete,
  Grid,
  Tooltip,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Phrase from "./contracts/Phrase.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const filter = createFilterOptions();

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
    stories: [{ title: "Test" }],
    value: { title: "Test" },
    addWordTitlePrice: 0.02,
    addWordStoryPrice: 0.01,
    newStoryPrice: 0.05,
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
    const { accounts, phraseContract, chosenAccount, web3, addWordStoryPrice } = this.state;

    // Submit transaction to add new word
    await phraseContract.methods.addWord(this.state.textFieldValue).send({ value: web3.utils.toWei(addWordStoryPrice.toString(), 'ether'), from: accounts[chosenAccount] });

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

  setValue = (value) => {
    // TODO call to blockchain to set value before state change
    const stories = this.state.stories;
    if (stories.indexOf(value) === -1) {
      stories.push(value);
    }
    this.setState({ value, stories });
  }

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
                <Grid container spacing={2}>
                  <Grid item xs={6} md={8}>
                    <Autocomplete
                      value={this.state.value}
                      isOptionEqualToValue={(option, value) => option.title === value.title}
                      // disablePortal
                      id="combo-box-demo"
                      options={this.state.stories}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      onChange={(_, newValue) => {
                        if (newValue === null) return;
                        if (typeof newValue === 'string') {
                          this.setValue({
                            title: newValue,
                          });
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          this.setValue({
                            title: newValue.inputValue,
                          });
                        } else {
                          this.setValue(newValue);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Story" />}
                      renderOption={(props, option) => <li {...props}>{option.title}</li>}
                      getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                          return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        // Regular option
                        return option.title;
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.title);
                        if (inputValue !== '' && !isExisting && inputValue.indexOf(' ') === -1) {
                          filtered.unshift({
                            inputValue,
                            title: `Create New Story (${this.state.newStoryPrice} ether): "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Tooltip title={this.state.addWordTitlePrice + " ether"}>
                      <TextField
                        sx={{ width: "100%" }}
                        id="add-word-title-textfield"
                        label={`Add Word To Title`}
                        variant="outlined"
                      // TODO need to implement these functions
                      // value={this.state.textFieldValue}
                      // onChange={this.handleTextFieldChange}
                      // onKeyDown={(event) => this.handleKeyPress(event, this)}
                      // disabled={this.state.isProcessingTransaction}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
                <Box sx={{ my: 4 }}>
                  <Paper elevation={3} xs={9} sx={{ p: 5 }} >
                    {this.state.phrase}
                  </Paper>
                </Box>
                <Box>
                  {this.state.isProcessingTransaction &&
                    <LinearProgress color="inherit" />
                  }
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={7}>
                    <FormControl sx={{ width: "100%" }}>
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
                  </Grid>
                  <Grid item xs={6} md={5}>
                    <Tooltip title={this.state.addWordStoryPrice + " ether"}>
                      <TextField
                        sx={{ width: "100%" }}
                        id="add-word-story-textfield"
                        label="Add Word To Story"
                        variant="outlined"
                        value={this.state.textFieldValue}
                        onChange={this.handleTextFieldChange}
                        onKeyDown={(event) => this.handleKeyPress(event, this)}
                        disabled={this.state.isProcessingTransaction}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
                <Box sx={{ px: 8, my: 1 }}>
                  <Typography variant="h6" component="div" align="center" gutterBottom>
                    Transaction History
                  </Typography>
                  <Typography variant="h8" component="div" align="center" gutterBottom>
                    Address - Word
                  </Typography>
                  <List>
                    {this.state.transactionHistory.map((transaction, index) => {
                      return (
                        <Box key={index}>
                          <ListItem>
                            <ListItemText primary={transaction.join(" - ")} />
                          </ListItem>
                          {index === this.state.transactionHistory.length - 1 ? null : <Divider variant="middle" />}
                        </Box>
                      )
                    })}
                  </List>
                </Box>
              </Container>
            ) : (
              <Container maxWidth="md">
                {!this.state.web3ConnectionError ? (
                  <Box>
                    <Typography variant="h5" component="div" align="center" gutterBottom>
                      Loading Web3, accounts, and contracts...
                    </Typography>
                    <LinearProgress color="inherit" />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" component="div" align="center" gutterBottom>
                      Error connecting to DApp!
                    </Typography>
                    <Typography variant="h8" component="div" align="center" gutterBottom>
                      Make sure you have configured a wallet and you are connected to the right network.
                    </Typography>
                    <Typography variant="h8" component="div" align="center" gutterBottom>
                      Refresh the page to try again.
                    </Typography>
                  </Box>
                )}
              </Container>)
          }
        </Container>
      </ThemeProvider >
    );
  }
}

export default App;
