import React from "react";
import { Grid, Form, Segment, Button, Message, Icon, Header} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

class Register extends React.Component{

    state={
        username: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    } 

    handleChange = (event)=>{
        this.setState({
            [event.target.name] : event.target.value
        })
    };

    handleSubmit = (event)=>{
        event.preventDefault();
        //create user with email and password
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( createdUser => console.log(createdUser))
            .catch(err => console.log(err));
        

    }
    render(){
        const {username, email, passwordConfirmation, password} = this.state;
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: "450px"}}>
                    <Header as="h2" icon color="pink" textAlign="center">
                        <Icon name="slack" color="pink"/>
                        Register for DevSlack
                    </Header>   
                    <Form size="large" onSubmit={this.handleSubmit}>
                    <Segment stacked>
                        <Form.Input fluid
                                    name="username"
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="Username"
                                    type="text"
                                    value={username}
                                    onChange={this.handleChange}/>
                        <Form.Input fluid
                                    name="email"
                                    icon="mail"
                                    iconPosition="left"
                                    placeholder="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={this.handleChange}/>
                        <Form.Input fluid
                                    name="password"
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={this.handleChange}/>
                        <Form.Input fluid
                                    name="passwordConfirmation"
                                    icon="repeat"
                                    iconPosition="left"
                                    placeholder="Re-enter Password"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={this.handleChange}/>
                        <Button size="large" color="pink" fluid>Submit</Button>
                    </Segment>
                    </Form>   
                    <Message>Already a User?<Link to="/login"> Login</Link></Message>          
                </Grid.Column>
            </Grid>
        )
    }
};

export default Register;