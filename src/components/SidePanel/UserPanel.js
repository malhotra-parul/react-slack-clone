import React, { Component } from 'react';
import firebase from "../firebase";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

class UserPanel extends Component {
    state={
        user: this.props.currentUser
    };

    dropdownOptions = ()=>{
        return[
        {   
            key: "user",
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true 
        },
        {   
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        { 
            key: "signout",
            text: <span onClick={this.handleSignOut}>Sign Out!</span>
        }
    ]};

    handleSignOut = ()=>{
        firebase
        .auth()
        .signOut()
        .then(()=> console.log("signed out!"));
    }


    render() { 
        console.log(this.props.currentUser);
        return ( 
            <Grid style={{background: "#4c3c4c"}}>
                <Grid.Column>
                    <Grid.Row style={{padding: "1.2em", margin: 0}}>
                    {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>
                                DevSlack
                            </Header.Content>
                        </Header>
                    </Grid.Row>
                     {/* A Dropdown for User */}
                     <Header inverted as="h3" style={{padding: "0.25em"}} >
                        <Dropdown trigger={
                            <span>{this.state.user.displayName}</span>
                        } options={this.dropdownOptions()}/>
                     </Header>
                </Grid.Column>
            </Grid>
         );
    }
};


 
export default UserPanel;