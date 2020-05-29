import React, { Component } from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import firebase from "../firebase";
import FileModal from "./FileModal";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.user,
    errors: [],
    modal: false
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

  createMessage = () => {
      const message = {
          content: this.state.message,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          user:{
              id: this.state.user.uid,
              name: this.state.user.displayName,
              avatar: this.state.user.photoURL
          }
      }
      return message;
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
          modal={modal}/>
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
