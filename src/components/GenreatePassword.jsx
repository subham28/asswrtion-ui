import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import _ from "lodash";
import React, { Component } from "react";
import client from "./Client";

class GenreatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: { a: "abc" },
      generatedPass: "Generated password will bee shown here",
      passToSend: undefined,
      websiteName: "",
      length: 23,
      errorMsg: undefined,
      successMsg: false,
    };
  }

  onNameChange = (ev) => {
    this.setState({
      websiteName: ev.target.value,
    });
  };
  callGenerateApi = async () => {
    if (!_.isEmpty(this.state.websiteName)) {
      console.log("call api", this.state);
      try {
        const response = await client.get(
          `/generate/${this.state.websiteName}/${this.state.length}`
        );
        console.log("response", response);
        const decodedString = window.atob(response.data.passString);
        console.log("decoded", decodedString);

        const encodedString = window.btoa(decodedString);
        console.log("encoded", encodedString);
        this.setState({
          generatedPass: decodedString,
          passToSend: encodedString,
        });
      } catch (err) {
        console.log(err.message);
        this.clearFields();
        this.setState({
          errorMsg: err.message,
        });
      }
    } else {
      console.error("Website name cannot be empty");
    }
  };

  clearFields = () => {
    this.setState({
      websiteName: "",
      generatedPass: "Generated password will bee shown here",
      errorMsg: undefined,
      passToSend: undefined,
      //     successMsg: false,
    });
  };

  savePassWord = async () => {
    const { websiteName, passToSend } = this.state;
    try {
      if (!_.isEmpty(websiteName) && !_.isNil(passToSend)) {
        //call save api
        let reqObj = {
          websiteName: websiteName,
          passString: passToSend,
        };
        console.log("req obj", reqObj);
        const response = await client.post("/save", [reqObj]);
        this.setState({
          successMsg: true,
        });
        this.clearFields();
      }
    } catch (err) {
      this.clearFields();
      this.setState({
        errorMsg: err.message,
      });
    }
  };
  render() {
    console.log(this.state);
    return (
      <div>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center">
            Generate New Password
          </Typography>
          <Grid container spacing={3}>
            <Grid container item xs={5} justify="flex-start">
              <Typography variant="h6" component="h2">
                Enter Web Site Name
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid container item xs={7} justify="flex-start">
              <TextField
                id="outlined-basic"
                label="Website name"
                variant="outlined"
                fullWidth={true}
                required={true}
                value={this.state.websiteName}
                onChange={this.onNameChange}
              />
            </Grid>
            <Grid container item xs={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={this.callGenerateApi}
              >
                Generate
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid container item xs={11}>
              <TextField
                disabled
                id="outlined-disabled"
                label="Password"
                //defaultValue={this.state.generatedPass}
                value={this.state.generatedPass}
                variant="outlined"
                fullWidth={true}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid container item xs={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={this.savePassWord}
              >
                Save
              </Button>
            </Grid>
            <Grid container item xs={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={this.clearFields}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          {_.isNil(this.state.errorMsg) ? null : (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>{this.state.errorMsg}</strong>
            </Alert>
          )}
          {this.state.successMsg ? (
            <Alert
              severity="success"
              onClose={() => {
                this.setState({ successMsg: false });
              }}
            >
              Password saved successfully
            </Alert>
          ) : null}
        </Container>
      </div>
    );
  }
}

export default GenreatePassword;
