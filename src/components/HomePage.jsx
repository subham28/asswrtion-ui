import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Alert, AlertTitle } from "@material-ui/lab";
import _ from "lodash";
import React, { Component } from "react";
import client from "./Client";
import EnhancedTableHead from "./TableHead";
function createData(name, password) {
  return { name, password };
}

// const rows = [
//   createData("Frozen yoghurt", "159, 6.0, 24, 4.0"),
//   createData("Ice cream sandwich", "237, 9.0, 37, 4.3"),
//   createData("Eclair", "262, 16.0, 24, 6.0"),
//   createData("Cupcake", "305, 3.7, 67, 4.3"),
//   createData("Gingerbread", "356, 16.0, 49, 3.9"),
// ];

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Website Name" },
  { id: "password", numeric: false, disablePadding: false, label: "Password" },
];
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: 123,
      selected: [],
      rows: [],
      successFlag: false,
      successString: undefined,
      errFlag: false,
      errStrng: undefined,
      isLoading: false,
      isEditing: false,
      editedName: {},
      editedPass: {},
      selectedRows: [],
      modifiedObj: {},
    };
  }

  async componentDidMount() {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await client.get("/websites");
      if (!_.isEmpty(response.data)) {
        this.setState({
          rows: response.data,
          isLoading: false,
        });
      } else {
        this.setState({
          rows: [],
          isLoading: false,
          errFlag: true,
          errStrng: "No records found",
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({
        errFlag: true,
        errStrng: err.message,
        isLoading: false,
      });
    }
  }
  routeToGenerate = (ev) => {
    console.log(this.props);
    this.props.history.push("/generate");
  };
  handleSelectAllClick = (event) => {
    const { rows } = this.state;
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      this.setState({ selected: newSelecteds });
      return;
    }
    this.setState({ selected: [] });
  };
  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  handleClick = (event, name, row) => {
    const { selected, selectedRows } = this.state;
    const { id } = row;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let newSelectedRow = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelectedRow.push(row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedRow.pop(row);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedRow = newSelectedRow.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedRow = newSelectedRow.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }
    let nameObj = this.state.editedName;
    let passObj = this.state.editedPass;
    if (!_.isEmpty(newSelected)) {
      newSelected.map((val) => {
        nameObj[row.id + "name"] = undefined;
        passObj[row.id + "pass"] = undefined;
      });
    }
    this.setState({
      selected: newSelected,
      selectedRows: newSelectedRow,
    });
  };
  deleteWebsite = async () => {
    const { selected } = this.state;
    this.setState({
      isLoading: true,
    });
    try {
      const res = await client.delete(`/deleteWebsite/${selected}`);
      console.log(res);
      if (!_.isEmpty(res.data)) {
        const response = await client.get("/websites");
        if (!_.isEmpty(response.data)) {
          this.setState({
            rows: response.data,
            isLoading: false,
            selected: [],
          });
        }
      }
    } catch (err) {
      this.setState({
        errFlag: true,
        errStrng: err.message,
        isLoading: false,
      });
    }
  };
  closeModal = () => {
    const { selected } = this.state;
    let nameObj = {};
    let passObj = {};
    selected.map((val) => {
      nameObj[val + "name"] = undefined;
      passObj[val + "pass"] = undefined;
    });
    this.setState({
      isEditing: false,
      editedName: nameObj,
      editedPass: passObj,
      modifiedObj: {},
    });
  };
  handleEdit = () => {
    const { rows, selected } = this.state;

    const filteredRows = rows.filter((row) => {
      if (selected.includes(row.id)) {
        return row;
      }
    });
    console.log(filteredRows);
    this.setState({
      isEditing: true,
      selectedRows: filteredRows,
    });
  };
  onNameCahnge = (ev, row) => {
    const id = Number(ev.target.id.replace("name", ""));
    const { editedName, modifiedObj } = this.state;
    const index = ev.target.id;
    if (modifiedObj.hasOwnProperty(id)) {
      modifiedObj[id].websiteName = ev.target.value;
    } else {
      modifiedObj[id] = { websiteName: ev.target.value };
    }
    editedName[index] = ev.target.value;
    console.log(ev.target.value);
    this.setState({
      editedName: editedName,
      modifiedObj: modifiedObj,
    });
  };
  onPassChange = (ev, row) => {
    const id = Number(ev.target.id.replace("pass", ""));
    const { editedPass, modifiedObj } = this.state;
    console.log(modifiedObj);
    const index = ev.target.id;
    if (modifiedObj.hasOwnProperty(id)) {
      modifiedObj[id].passString = window.btoa(ev.target.value);
    } else {
      modifiedObj[id] = { passString: window.btoa(ev.target.value) };
    }

    editedPass[index] = ev.target.value;
    this.setState({
      editedPass: editedPass,
      modifiedObj: modifiedObj,
    });
  };
  saveChanges = async () => {
    const { modifiedObj, selected } = this.state;
    console.log(modifiedObj);
    let reqArr = [];
    selected.map((val) => {
      if (modifiedObj.hasOwnProperty(val)) {
        let temp = modifiedObj[val];
        temp.id = val;
        reqArr.push(temp);
        return null;
      }
    });
    console.log(reqArr);
    try {
      const res = await client.put("/update", reqArr);
      console.log(res);
      if (!_.isEmpty(res.data)) {
        try {
          const response = await client.get("/websites");
          this.closeModal();
          this.setState({
            rows: response.data,
            selected: [],
            successFlag: true,
            successString: res.data,
          });
        } catch (err) {
          throw "Error while fetching data";
        }
      }
    } catch (err) {
      console.log("err", err);
      this.setState({
        errFlag: true,
        errStrng: err.message,
      });
    }
  };
  render() {
    const { rows } = this.state;
    return (
      <div>
        <Container maxWidth="md">
          <Grid container spacing={2} justify="center">
            <Typography variant="h4" component="h2" align="center">
              Web based Password Manager
            </Typography>
          </Grid>
          <Grid container spacing={3}>
            <Grid container item xs={2} justify="flex-start">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleEdit}
                disabled={this.state.selected.length ? false : true}
              >
                Edit
              </Button>
            </Grid>
            <Grid container item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.deleteWebsite}
                disabled={this.state.selected.length ? false : true}
              >
                Delete
              </Button>
            </Grid>
            <Grid container item xs={4} justify="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={this.routeToGenerate}
              >
                Generate new password
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid container item xs={12} justify="center">
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <EnhancedTableHead
                    numSelected={this.state.selected.length}
                    onSelectAllClick={this.handleSelectAllClick}
                    rowCount={rows.length}
                    headCells={headCells}
                  />
                  <TableBody>
                    {rows.map((row, index) => {
                      const isItemSelected = this.isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            this.handleClick(event, row.websiteName, row)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.websiteName}
                          </TableCell>
                          <TableCell>{window.atob(row.password)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          {this.state.errFlag ? (
            <Alert
              severity="error"
              onClose={() => {
                this.setState({ errFlag: false, errStrng: undefined });
              }}
            >
              <AlertTitle>Error</AlertTitle>
              <strong>{this.state.errStrng}</strong>
            </Alert>
          ) : null}
          {this.state.successFlag ? (
            <Alert
              severity="success"
              onClose={() => {
                this.setState({ successFlag: false });
              }}
            >
              <AlertTitle>Success</AlertTitle>
              {this.state.successString}
            </Alert>
          ) : null}
        </Container>
        <Dialog
          open={this.state.isEditing}
          onClose={this.closeModal}
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Edit Selected Records
          </DialogTitle>
          <DialogContent>
            {this.state.selectedRows.map((row) => {
              return (
                <div>
                  <Grid container spacing={3}>
                    <Grid container item xs={4}>
                      <TextField
                        id={row.id + "name"}
                        label="Website name"
                        variant="outlined"
                        value={
                          this.state.editedName[row.id + "name"] === undefined
                            ? row.websiteName
                            : this.state.editedName[row.id + "name"]
                        }
                        fullWidth={true}
                        onChange={(event) => this.onNameCahnge(event, row)}
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      <TextField
                        id={row.id + "pass"}
                        label="Password"
                        variant="outlined"
                        fullWidth={true}
                        value={
                          this.state.editedPass[row.id + "pass"] === undefined
                            ? window.atob(row.password)
                            : this.state.editedPass[row.id + "pass"]
                        }
                        onChange={(event) => this.onPassChange(event, row)}
                      />
                    </Grid>
                  </Grid>
                </div>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} color="primary">
              Cancel
            </Button>
            <Button onClick={this.saveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Backdrop open={this.state.isLoading}>
          <CircularProgress />
        </Backdrop>
      </div>
    );
  }
}

export default HomePage;
