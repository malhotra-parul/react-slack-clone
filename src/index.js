import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import "semantic-ui-css/semantic.min.css";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import firebase from "./components/firebase";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(() => {}, composeWithDevTools());
//create a var store that will have the returned value from createStore function

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.history.push("/");
      }
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();

//To provide this global state to all the components we use Provider component and pass
//it a store variable as a prop.
