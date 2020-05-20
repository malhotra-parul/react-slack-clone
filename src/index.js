import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Root = ()=>{
    return <Router>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                </Switch>
           </Router>
}

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
