import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal } from "semantic-ui-react";

class ColorPanel extends Component {

    state={
        modal: false
    }

    openModal = ()=> this.setState({modal: true});
    closeModal = ()=> this.setState({modal: false});

    render() { 
        const {modal} = this.state;
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

                </Modal>
            </Sidebar>
         );
    }
}
 
export default ColorPanel;