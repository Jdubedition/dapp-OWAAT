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

import Narrative from "./contracts/Narrative.json";

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
    narrativeContract: null,
    titleTextFieldValue: "",
    bodyTextFieldValue: "",
    isProcessingTransaction: false,
    storyBody: "",
    chosenAccount: 0,
    transactionHistory: [[]],
    maxHistory: 15,
    transactionHistoryIntervalID: null,
    web3ConnectionError: false,
    chosenStoryID: 0,
    stories: null,
    storyAttributes: null,
    addWordTitlePrice: 0.02,
    addWordStoryPrice: 0.01,
    newStoryPrice: 0.1,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts and contract instance from network.
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      // Get Narrative contract instance
      const narrativeNetwork = Narrative.networks[networkId];
      const narrativeInstance = new web3.eth.Contract(
        Narrative.abi,
        narrativeNetwork && narrativeNetwork.address,
      );

      const storyResponse = await narrativeInstance.methods.getStoryTitles().call();

      const stories = storyResponse.map((story) => {
        return { id: story[0], title: story[1] };
      });

      // Set web3, accounts, and contract to the state
      this.setState({
        web3,
        accounts,
        narrativeContract: narrativeInstance,
        stories,
        storyAttributes: stories[0],
      }, this.initialContractState);
    } catch (error) {
      this.setState({ web3ConnectionError: true });
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.transactionHistoryIntervalID);
  }

  updateStoryToMatchBlockchain = async () => {
    const { narrativeContract, chosenStoryID } = this.state;
    const story = await narrativeContract.methods.getStory(chosenStoryID).call();
    const transactionHistory = [];
    for (let i = 0; i < story.wordCount; i++) {
      transactionHistory.push([story.wordContributors[i], story.words[i]]);
    }
    this.setState({ storyBody: story.body, transactionHistory });
  }

  initialContractState = async () => {
    this.updateStoryToMatchBlockchain();

    if (!this.props.doNotRunUpdateDAppToChainInterval) {
      const transactionHistoryIntervalID = window.setInterval(this.updateStoryToMatchBlockchain, 3000);
      this.setState({ transactionHistoryIntervalID });
    }
  };

  addWord = async (eventTargetID) => {
    const {
      accounts,
      narrativeContract,
      chosenAccount,
      web3,
      addWordStoryPrice,
      addWordTitlePrice,
      chosenStoryID,
    } = this.state;

    if (eventTargetID === "add-word-body-textfield") {
      // Submit transaction to add new word to body of story
      await narrativeContract.methods.addWordToBody(
        chosenStoryID,
        this.state.bodyTextFieldValue).send(
          {
            value: web3.utils.toWei(addWordStoryPrice.toString(), 'ether'),
            from: accounts[chosenAccount]
          }
        );

      this.updateStoryToMatchBlockchain();
    }

    if (eventTargetID === "add-word-title-textfield") {
      // Submit transaction to add new word to title of story
      await narrativeContract.methods.addWordToTitle(
        chosenStoryID,
        this.state.titleTextFieldValue).send(
          {
            value: web3.utils.toWei(addWordTitlePrice.toString(), 'ether'),
            from: accounts[chosenAccount]
          }
        );

      await this.updateStoryToMatchBlockchain();
      const story = await narrativeContract.methods.getStory(chosenStoryID).call();
      this.setStoryAttributes({ id: chosenStoryID.toString(), title: story.title });
    }

    this.setState({ bodyTextFieldValue: "", titleTextFieldValue: "" });
  }

  handleKeyPress = async (event, thisLink) => {
    if (event.key === "Enter" && (this.state.bodyTextFieldValue !== "" || this.state.titleTextFieldValue !== "")) {
      this.setState({ isProcessingTransaction: true });
      try {
        await thisLink.addWord(event.target.id);
      } catch (error) {
        console.error(error);
      }
      this.setState({ isProcessingTransaction: false });
    } else if (event.key === " ") {
      event.preventDefault();
    }
  }

  onBlur = (event) => {
    if (event.target.id === "add-word-body-textfield") {
      this.setState({ bodyTextFieldValue: "" });
    } else if (event.target.id === "add-word-title-textfield") {
      this.setState({ titleTextFieldValue: "" });
    }
  }

  handleTextFieldChange = (event) => {
    if (event.target.id === "add-word-body-textfield") {
      this.setState({
        bodyTextFieldValue: event.target.value,
      });
    }

    if (event.target.id === "add-word-title-textfield") {
      this.setState({
        titleTextFieldValue: event.target.value
      });
    }
  }

  handleSelectChange = (event) => {
    this.setState({ chosenAccount: event.target.value });
  };

  setStoryAttributes = async (storyAttributes) => {
    let isExistingStory = false;
    const stories = this.state.stories.map((s) => {
      if (s.id === this.state.chosenStoryID.toString()) {
        isExistingStory = true;
        return { id: s.id, title: storyAttributes.title };
      }
      return s;
    });
    if (!isExistingStory) {
      // TODO call to blockchain to set value before state change
      stories.push(storyAttributes);
    }
    this.setState({ storyAttributes, stories });
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
                      value={this.state.storyAttributes}
                      isOptionEqualToValue={(option, value) => option.title === value.title}
                      id="combo-box-demo"
                      options={this.state.stories}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      onChange={(_, newValue) => {
                        if (newValue === null) return;
                        if (typeof newValue === 'string') {
                          this.setStoryAttributes({
                            title: newValue,
                          });
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          this.setStoryAttributes({
                            title: newValue.inputValue,
                          });
                        } else {
                          this.setStoryAttributes(newValue);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Story" />}
                      renderOption={(props, option) => <li {...props}>{option.title}</li>}
                      getOptionLabel={(option) => {
                        // console.log('getOptionLabel', option);
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
                        // console.log('filterOptions', options, params);
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
                        value={this.state.titleTextFieldValue}
                        onChange={this.handleTextFieldChange}
                        onKeyDown={(event) => this.handleKeyPress(event, this)}
                        disabled={this.state.isProcessingTransaction}
                        onBlur={this.onBlur}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
                <Box sx={{ my: 4 }}>
                  <Paper elevation={3} xs={9} sx={{ p: 5 }} >
                    {this.state.storyBody}
                  </Paper>
                </Box>
                <Box sx={{ my: 3 }}>
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
                        id="add-word-body-textfield"
                        label="Add Word To Story"
                        variant="outlined"
                        value={this.state.bodyTextFieldValue}
                        onChange={this.handleTextFieldChange}
                        onKeyDown={(event) => this.handleKeyPress(event, this)}
                        disabled={this.state.isProcessingTransaction}
                        onBlur={this.onBlur}
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
