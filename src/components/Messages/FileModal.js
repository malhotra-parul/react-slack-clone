import React, { Component } from 'react';
import mime from "mime-types";
import {Modal, Input, Button, Icon} from "semantic-ui-react";

class FileModal extends Component {
    state = { 
        file: null,
        authorized:["image/jpeg", "image/png"]
     }

    addFile = (event)=> {
        console.log(event.target);
        const file = event.target.files[0];
        this.setState({file: file}  )
    };

    sendFile = () => {
        const {file} = this.state;
        const {uploadFile, close} = this.props;
        if(file){
            if(this.isAuthorized(file.name)){
                const metadata = {
                    contentType: mime.lookup(file.name)
                }
                uploadFile(file, metadata);
                close();
                this.clearFile();
            }
        }
    };

    clearFile = ()=> this.setState({file: null});

    isAuthorized = (filename) => this.state.authorized.includes(mime.lookup(filename));



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
                    onChange={this.addFile}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                    color="green"
                    inverted
                    onClick={this.sendFile}>
                        <Icon name="checkmark" 
                        /> Send
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