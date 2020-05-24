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
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/index";
import { setUser } from "./actions/index";
import Spinner from "./components/Spinner";

const store = createStore(rootReducer, composeWithDevTools());
//create a var store that will have the returned value from createStore function

class Root extends Component {
  componentDidMount() {
      console.log(this.props.isLoading);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          this.props.setUser(user);
        this.props.history.push("/");
      }
    });
  }

  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateFromProps = (state)=>({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser })(Root));

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
