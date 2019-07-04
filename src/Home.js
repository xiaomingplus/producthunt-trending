import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  TextField,
  FormGroup,
  Link,
  Paper
} from "@material-ui/core";
import DateFnsUtils from "@date-io/moment";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {
  GithubCircle,
  KeyChange,
  TrendingUp,
  AlphaPcircle
} from "mdi-material-ui";
import Loader from "react-loader-spinner";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import moment from "moment";
import qs from "query-string";
import DividerOblique from "./components/Divider";
import "./App.css";
import ProductItem from "./components/ProductItem";
import { getProducts } from "./utils/request";
const dateFormat = "YYYY/MM/DD";
const tokenKey = "producthunt_token";
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {},
  title: {
    flexGrow: 1
  }
});
class App extends React.Component {
  constructor(props) {
    super(props);
    const parsed = qs.parse(window.location.search);
    const token =
      window.localStorage.getItem(tokenKey) ||
      "f481389cba9d24863cbf01c6c4e4d1315f11fafaf3671858db308e29a8ed493e";
    const range = parsed.range;
    let finalRange = ""; // default
    let since = "";

    if (
      range === "daily" ||
      range === "weekly" ||
      range === "monthly" ||
      range === "yearly"
    ) {
      finalRange = range;
    }

    if (finalRange === "daily") {
      since = moment()
        .startOf("day")
        .toDate();
    } else if (finalRange === "weekly") {
      since = moment()
        .subtract(7, "days")
        .toDate();
    } else if (finalRange === "monthly") {
      since = moment()
        .subtract(30, "days")
        .toDate();
    } else if (finalRange === "yearly") {
      since = moment()
        .subtract(365, "days")
        .toDate();
    }

    if (parsed.since) {
      since = moment(parsed.since).toDate();
    } else if (!since) {
      finalRange = "weekly";
      since = moment()
        .subtract(7, "days")
        .toDate();
    }

    this.state = {
      range: finalRange,
      since,
      entries: {},
      ids: [],
      token,
      isLoading: true,
      isShowToken: false,
      before: "",
      after: "",
      error: ""
    };
  }
  componentDidMount() {
    this.initData();
  }
  render() {
    const { classes } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={this.handleReload}
                aria-label="Logo"
              >
                <TrendingUp />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                <Link
                    onClick={this.handleReload}
                    color="inherit"
                    underline="none"
                    style={{cursor: "pointer"}}
                  >
                  ProductHunt Trending
                  </Link>
              </Typography>
              <IconButton
                aria-label="Change Token"
                onClick={this.handleToggleToken}
                color="inherit"
              >
                <KeyChange />
              </IconButton>
              <IconButton
                aria-label="Github"
                onClick={this.handleGithub}
                color="inherit"
              >
                <GithubCircle />
              </IconButton>
              <IconButton
              edge="end"
              aria-label="ProductHunt"
              onClick={this.handleProducthunt}
              color="inherit"
            >
              <AlphaPcircle />
            </IconButton>
            </Toolbar>
          </AppBar>
          <Container maxWidth="md">
            <div
              style={{
                height: 20
              }}
            />
            {this.state.isShowToken ? this.renderToken() : null}
            <FormGroup
              row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between"
              }}
            >
              <FormGroup row style={{ alignItems: "flex-end" }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="mui-pickers-date"
                  label="Since"
                  disableFuture={true}
                  autoOk={true}
                  format={dateFormat}
                  value={this.state.since}
                  onChange={this.handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
                <Button
                  onClick={this.handleQuery}
                  variant="contained"
                  color="primary"
                  style={{ marginBottom: 8, marginLeft: 10 }}
                >
                  Get
                </Button>
              </FormGroup>
              <div className="quick-query">
                <Typography variant="subtitle1" display="block" gutterBottom>
                  <Link
                    color={
                      this.state.range !== "daily" ? "primary" : "textSecondary"
                    }
                    href="?range=daily"
                  >
                    Daily
                  </Link>
                </Typography>
                <DividerOblique />
                <Typography variant="subtitle1" display="block" gutterBottom>
                  <Link
                    color={
                      this.state.range !== "weekly"
                        ? "primary"
                        : "textSecondary"
                    }
                    href="?range=weekly"
                  >
                    Weekly
                  </Link>
                </Typography>
                <DividerOblique />
                <Typography variant="subtitle1" display="block" gutterBottom>
                  <Link
                    color={
                      this.state.range !== "monthly"
                        ? "primary"
                        : "textSecondary"
                    }
                    href="?range=monthly"
                  >
                    Monthly
                  </Link>
                </Typography>
                <DividerOblique />
                <Typography variant="subtitle1" display="block" gutterBottom>
                  <Link
                    color={
                      this.state.range !== "yearly"
                        ? "primary"
                        : "textSecondary"
                    }
                    href="?range=yearly"
                  >
                    Yearly
                  </Link>
                </Typography>
                <DividerOblique />
                <Typography variant="subtitle1" display="block" gutterBottom>
                  <Link
                    color="primary"
                    target="_blank" rel="noopener noreferrer"
                    href="https://www.producthunt.com/time-travel"
                  >
                  Time Travel
                  </Link>
                </Typography>
              </div>
            </FormGroup>
            <div
              style={{
                height: 20
              }}
            />

            {this.state.error
              ? this.renderError()
              : this.state.isLoading
              ? this.renderLoading()
              : this.renderList()}
          </Container>
          <footer style={{paddingBottom:20,paddingTop:20}} className="center">
                Thanks
                <Link style={{marginLeft:4}} href="https://www.producthunt.com/" target="_blank" rel="noopener noreferrer"> ProductHunt</Link>
                <span style={{marginLeft:8,marginRight:4,color:"#999999"}}>/</span>
                <Link style={{marginLeft:4}} href="https://www.producthunt.com/posts/producthunt-trending" target="_blank" rel="noopener noreferrer"> Give me upvotes at Product Hunt</Link>
                <span style={{marginLeft:8,marginRight:8,color:"#999999"}}>/</span>
                <Link href="https://www.buymeacoffee.com/returnyang" target="_blank" rel="noopener noreferrer">Buy me a coffee</Link>
          </footer>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
  renderToken = () => {
    return (
      <FormGroup>
        <TextField
          id="outlined-name"
          label="Token"
          value={this.state.token}
          onChange={this.handleChangeToken}
          margin="normal"
          type="password"
          placeholder="Input your producthunt developer token"
          FormHelperTextProps={{
            component:'div'
          }}
          helperText={
            <div>
              Input your producthunt developer token. You can find it at
              <Link
                style={{marginLeft:2}}
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.producthunt.com/v2/oauth/applications"
              >
                here
              </Link>
            </div>
          }
          fullWidth
          variant="outlined"
        />
        <div
          style={{
            height: 10
          }}
        />
        <FormGroup row>
          <Button variant="contained" onClick={this.handleCancel}>
            Cancel
          </Button>
          <div
            style={{
              paddingRight: 20,
              display: "inline"
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSaveToken}
          >
            Save
          </Button>
        </FormGroup>
      </FormGroup>
    );
  };
  renderLoading = () => {
    return (
      <div style={{ paddingTop: 40 }} className="center">
        <Loader type="Plane" color="#556cd6" />
      </div>
    );
  };
  renderError = () => {
    return (
      <Paper
        className="center"
        style={{ flexDirection: "column", padding:20 }}
      >
        <Typography variant="h5" component="h3">
          Ops
        </Typography>
        <Typography component="p">
          {this.state.error ? this.state.error : "Something is wrong."}
        </Typography>
      </Paper>
    );
  };
  renderList = () => {
    return (
      <div>
        <div>{this.renderItems()}</div>
        <footer className="footer-container">
          <FormGroup row>
            <Button
              onClick={this.handleBefore}
              color="primary"
              style={{ marginBottom: 8, marginLeft: 10 }}
            >
              Previous
            </Button>
            <Button
              onClick={this.handleNext}
              color="primary"
              style={{ marginBottom: 8, marginLeft: 10 }}
            >
              Next
            </Button>
          </FormGroup>
        </footer>
      </div>
    );
  };
  renderItems = () => {
    return this.state.ids.map(id => {
      return <ProductItem key={"key_" + id} data={this.state.entries[id]} />;
    });
  };

  initData = () => {
    const params = {
        token:this.state.token
    };
    if (this.state.since) {
      params.since = this.state.since;
    }
    const parsed = qs.parse(window.location.search);
    if (parsed.before) {
      params.before = parsed.before;
    } else if (parsed.after) {
      params.after = parsed.after;
    }
    getProducts(params)
      .then(result => {
          const {data} = result;
        this.setState({
          isLoading: false
        });
        if (
          data &&
          data.posts &&
          data.posts.edges &&
          data.posts.edges.length > 0
        ) {
          const entries = {
            ...this.state.entries
          };
          const ids = [...this.state.ids];
          data.posts.edges.forEach(item => {
            entries[item.node.id] = item.node;
            ids.push(item.node.id);
          });
          this.setState({
            entries,
            ids,
            before: data.posts.pageInfo.startCursor,
            after: data.posts.pageInfo.endCursor
          });
        } else {
          this.setState({
            error: "No data."
          });
        }
      })
      .catch(e => {
        if(e && e.response && e.response.status===429){
            this.setState({
                isLoading: false,
                error: 'Sorry. You have exceeded the API rate limit.You can change the developer token by tap the "change token" icon (at top right icon) or try again after 15 minitus.'
            });
            this.handleToggleToken()
        }else{
            this.setState({
                isLoading: false,
                error: e.message
            });
        }
       
      });
  };
  handleGithub = () => {
    window.open(
      "https://github.com/xiaomingplus/producthunt-trending",
      "_blank"
    );
  };
  handleProducthunt = () => {
    window.open(
        "https://www.producthunt.com/posts/producthunt-trending",
        "_blank"
      );
  }
  handleReload = () => { 
    window.location.reload()
  }
  handleChangeToken = e => {
    this.setState({
      token: e.target.value
    });
  };
  handleToggleToken = () => {
    this.setState({
      isShowToken: !this.state.isShowToken
    });
  };
  handleDateChange = value => {
    this.setState({
      since: value
    });
  };
  handleSaveToken = () => {
    if (this.state.token) {
      window.localStorage.setItem(tokenKey, this.state.token);
      this.handleReload();
    }
  };
  handleCancel = () => {
    this.setState({
      isShowToken: false
    });
  };
  handleQuery = () => {
    const parsed = qs.parse(window.location.search);
    parsed.since = moment(this.state.since).format(dateFormat);
    const stringified = qs.stringify(parsed);
    window.location.search = stringified;
  };
  handleBefore = () => {
    if (this.state.before) {
      const parsed = qs.parse(window.location.search);
      parsed.before = this.state.before;
      delete parsed.after;
      const stringified = qs.stringify(parsed);
      window.location.search = stringified;
    }
  };
  handleNext = () => {
    if (this.state.after) {
      const parsed = qs.parse(window.location.search);
      parsed.after = this.state.after;
      delete parsed.before;
      const stringified = qs.stringify(parsed);
      window.location.search = stringified;
    }
  };
}

export default withStyles(styles)(App);
