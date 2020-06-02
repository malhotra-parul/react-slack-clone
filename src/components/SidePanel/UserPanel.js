import React, { Component } from 'react';
import firebase from "../firebase";
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from "semantic-ui-react";

class UserPanel extends Component {
    state={
        user: this.props.currentUser,
        modal: false
    };

    openModal = ()=> this.setState({modal: true});
    closeModal = ()=> this.setState({modal: false});

    dropdownOptions = ()=>{
        return[
        {   
            key: "user",
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true 
        },
        {   
            key: "avatar",
            text: <span onClick={this.openModal}>Change Avatar</span>
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
        
        const { primaryColor } =  this.props;
        const { user, modal } = this.state;
        
        return ( 
            <Grid style={{background: primaryColor}}>
                <Grid.Column>
                    <Grid.Row style={{padding: "1.2em", margin: 0}}>
                    {/* App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>
                                DevSlack
                            </Header.Content>
                        </Header>

                     {/* A Dropdown for User */}
                   
                     <Header inverted as="h3" style={{padding: "0.25em"}} >
                        <Dropdown trigger={
                            <span>
                            <Image src={user.photoURL} spaced="right" avatar />
                            {user.displayName}
                            </span>
                            
                        } options={this.dropdownOptions()}/>
                     </Header>
                     </Grid.Row>
                     <Modal basic open={modal} onClose={this.openModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                            fluid
                            type="file"
                            label="New Avatar"
                            name="previewImage"
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {/* Image preview */}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {/* Cropped image preview */}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button inverted color="green">
                                <Icon name="save"/> Save Avatar
                            </Button>
                            <Button inverted color="green">
                                <Icon name="image"/> Preview
                            </Button>
                            <Button inverted color="red" onClick={this.closeModal}>
                                <Icon name="remove"/> Cancel
                            </Button>
                        </Modal.Actions>
                     </Modal>
                </Grid.Column>
            </Grid>
         );
    }
};


 
export default UserPanel;