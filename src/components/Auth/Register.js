import React from "react";
import { Grid, Form, Segment, Button, Message, Icon, Header} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component{

    state={} 

    handleChange(){

    }
    render(){
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: "450px"}}>
                    <Header as="h2" icon color="pink" textAlign="center">
                        <Icon name="slack" color="pink"/>
                        Register for DevSlack
                    </Header>   
                    <Form size="large">
                    <Segment stacked>
                        <Form.Input fluid
                                    name="username"
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="Username"
                                    type="text"
                                    onChange={this.handleChange}/>
                        <Form.Input fluid
                                    name="email"
                                    icon="mail"
                                    iconPosition="left"
                                    placeholder="Email Address"
                                    type="email"
                                    onChange={this.handleChange}/>
                        <Form.Input fluid
                                    name="password"
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder="Password"
                                    type="password"
                                    onChange={this.handleChange}/>
                        <Form.Input fluid
                                    name="passwordConfirmation"
                                    icon="repeat"
                                    iconPosition="left"
                                    placeholder="Re-enter Password"
                                    type="password"
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