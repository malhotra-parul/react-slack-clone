import React, { Component } from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import firebase from "../firebase";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";

class MessageForm extends Component {
  state = {
    storageRef : firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    message: "",
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.user,
    errors: [],
    modal: false,
    percentUploaded : 0
  };

  openModal = ()=> this.setState({modal: true});
  closeModal = ()=> this.setState({modal: false});

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;
    
    if (message) {
    this.setState({ loading: true });
    messagesRef
    .child(channel.id)
    .push()
    .set(this.createMessage())
    .then(()=>{
        this.setState({loading: false, message: "", errors: []})
    }).catch(err => {
        this.setState({errors: [err, ...this.state.errors]})
    })
    }else{
        this.setState({errors: [{message: "Add a message!"}, ...this.state.errors]})
    }
  };

  createMessage = (fileUrl = null) => {
      const message = {
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          user:{
              id: this.state.user.uid,
              name: this.state.user.displayName,
              avatar: this.state.user.photoURL
          }
      };
      if(fileUrl !== null){
        message["image"] = fileUrl;
      }else{
        message["content"] = this.state.message;
      }
      return message;
  }

  uploadFile = (file , metadata)=>{

    console.log(file, metadata);
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chatMedia/public/${uuidv4()}.jpg`;
    this.setState({
      uploadState: "uploading",
      uploadTask:  this.state.storageRef.child(filePath).put(file, metadata)
    }, ()=>{
      this.state.uploadTask.on("state_changed", snap =>{
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        this.setState({percentUploaded});
      }, (err)=>{
        console.error(err);
        this.setState({errors: [err, ...this.state.errors],
                       uploadState: "error",
                       uploadTask: null })
      }, ()=>{
        console.log(this.state.uploadTask.snapshot.ref.getDownloadURL());
        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
          this.sendFileMessage(downloadUrl, ref, pathToUpload);
        }).catch(err => {
          console.error(err);
        this.setState({errors: [err, ...this.state.errors],
                       uploadState: "error",
                       uploadTask: null })
        })
      })
    })
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(
      ()=>{
        this.setState({uploadState: "done"})
      }
    ).catch(err => {
      console.error(err);
      this.setState({errors: [err, ...this.state.errors]})
    })
  }

  render() {
      const {errors, message, loading, modal} = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="left"
          value={message}
          placeholder="Write your message..."
          onChange={this.handleChange}
          className={
              errors.some(error => error.message.toLowerCase().includes("message")) ?
              "error" : 
              ""
          }
        />
        <Button.Group icon widths="2">
          <Button
            color="pink"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={loading}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
          <FileModal 
          close={this.closeModal}
          modal={modal}
          uploadFile={this.uploadFile}/>
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
