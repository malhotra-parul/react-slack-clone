import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import firebase from "./components/firebase";

class Root extends Component {

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.props.history.push("/");
            }
        })   
    }

    render(){
    return  <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
           
}
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(<Router><RootWithAuth /></Router>, document.getElementById('root'));
registerServiceWorker();
