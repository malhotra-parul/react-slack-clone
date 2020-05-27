import React, { Component } from 'react';
import firebase from "../firebase";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

class UserPanel extends Component {

    dropdownOptions = ()=>{
        return[
        {   
            key: "user",
            text: <span>Signed in as <strong>User</strong></span>,
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
                            <span>User</span>
                        } options={this.dropdownOptions()}/>
                     </Header>
                </Grid.Column>
            </Grid>
         );
    }
}
 
export default UserPanel;