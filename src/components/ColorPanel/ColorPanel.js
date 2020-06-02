import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal, Label, Icon, Segment } from "semantic-ui-react";
import { SliderPicker} from "react-color";
import firebase from "../firebase";

const labelStyling = {
  margin: "1.3em"
}

class ColorPanel extends Component {

    state={
        modal: false,
        primary: "",
        secondary: "",
        user: this.props.currentUser,
        usersRef: firebase.database().ref("users")
    }

    openModal = ()=> this.setState({modal: true});
    closeModal = ()=> this.setState({modal: false});
    handleColorPrimary = (color) => this.setState({primary: color.hex });
    handleColorSecondary = (color) => this.setState({secondary: color.hex });
    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary){
            this.saveColors(this.state.primary, this.state.secondary);
        }
    }
    saveColors = (primary, secondary) => {
        this.state.usersRef
        .child(`${this.state.user.uid}/colors`)
        .push()
        .update({
            primary: primary,
            secondary: secondary
        }).then(()=> {
            console.log("Colors added");
            this.closeModal();
        } ).catch(err => console.error(err));
    }

    render() { 
        const {modal, primary, secondary} = this.state;
        return ( 
            <Sidebar
            vertical 
            as={Menu}
            icon="labeled"
            inverted
            visible
            width="very thin"
            style={{background: "#ecb241"}}
            >
                <Divider />
                <Button icon="add" 
                        style={{background: "#4b9abe"}} 
                        size="small" 
                        inverted
                        onClick={this.openModal}/>
                <Modal 
                basic
                open={modal}
                onClose={this.closeModal}
                >
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary Color" style={labelStyling} />
                            <SliderPicker color={primary} onChange={this.handleColorPrimary}/>
                        </Segment>
                        <Segment inverted>
                            <Label content="Secondary Color" style={labelStyling} />
                            <SliderPicker color={secondary} onChange={this.handleColorSecondary}/>
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button inverted color="green" onClick={this.handleSaveColors}>
                            <Icon name="checkmark" />Save colors 
                        </Button>
                        <Button inverted color="red" onClick={this.closeModal}>
                            <Icon name="remove" />Cancel 
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
         );
    }
}
 
export default ColorPanel;