import React, { Component } from 'react';
import {Modal, Input, Button, Icon} from "semantic-ui-react";

class FileModal extends Component {
    state = {  }
    render() { 
        const { modal, close } = this.props;
        return ( 
            <Modal basic open={modal} onClose={close}>
                <Modal.Header>Select an image file</Modal.Header>
                <Modal.Content>
                    <Input fluid 
                    label="File Types : png, jpg"
                    name="file"
                    type="file"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                    color="green"
                    inverted>
                        <Icon name="checkmark" /> Send
                    </Button>
                    <Button 
                    color="red"
                    inverted 
                    onClick={close}>
                        <Icon name="remove" /> Cancel
                    </Button>
                  
                </Modal.Actions>
            </Modal>
         );
    }
}
 
export default FileModal;