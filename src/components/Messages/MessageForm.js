import React, { Component } from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import firebase from "../firebase";
import FileModal from "./FileModal";
import uuidv4 from "uuid/v4";
import ProgressBar from "./ProgressBar";
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

class MessageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    message: "",
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.user,
    errors: [],
    modal: false,
    percentUploaded: 0,
    typingRef: firebase.database().ref("typing"),
    emojiPicker: false,
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

    handleTogglePicker = () => {
      this.setState({ emojiPicker: !this.state.emojiPicker });
    };

    handleAddEmoji = emoji => {
      const oldMessage = this.state.message;
      const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
      this.setState({ message: newMessage, emojiPicker: false });
      setTimeout(() => this.messageInputRef.focus(), 0);
    };
  
    colonToUnicode = message => {
      return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
        x = x.replace(/:/g, "");
        let emoji = emojiIndex.emojis[x];
        if (typeof emoji !== "undefined") {
          let unicode = emoji.native;
          if (typeof unicode !== "undefined") {
            return unicode;
          }
        }
        x = ":" + x + ":";
        return x;
      });
    };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel, typingRef, user } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
          typingRef.child(channel.id).child(user.uid).remove();
        })
        .catch((err) => {
          this.setState({ errors: [err, ...this.state.errors] });
        });
    } else {
      this.setState({
        errors: [{ message: "Add a message!" }, ...this.state.errors],
      });
    }
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return `chat/public`;
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: [err, ...this.state.errors],
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            console.log(this.state.uploadTask.snapshot.ref.getDownloadURL());
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: [err, ...this.state.errors],
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ errors: [err, ...this.state.errors] });
      });
  };

  handleKeyDown = (event) => {
    if(event.ctrlKey && event.keyCode === 13){
      this.sendMessage();
    }

    const { typingRef, user, channel, message } = this.state;
    if (message) {
      typingRef.child(channel.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(channel.id).child(user.uid).remove();
    }
  };


  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if(typeof emoji !== "undefined"){
        let unicode = emoji.native;
        if(typeof unicode !== "undefined"){
          return unicode ;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  }

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded,
      emojiPicker,
    } = this.state;
    return (
      <Segment className="message__form">
        { emojiPicker && (<Picker 
                          set="apple"
                          className="emojipicker"
                          title="Pick your emoji"
                          emoji="point_up"
                          onSelect={this.handleAddEmoji}
                          />)}
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={
          <Button 
          icon={emojiPicker ? "close" : "add"} 
          content={emojiPicker ? "Close" : null}
          onClick={this.handleTogglePicker
          } />}
          labelPosition="left"
          value={message}
          placeholder="Write your message..."
          onChange={this.handleChange}
          ref={node => (this.messageInputRef = node)}
          onKeyDown={this.handleKeyDown}
          className={
            errors.some((error) =>
              error.message.toLowerCase().includes("message")
            )
              ? "error"
              : ""
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
            disabled={uploadState === "uploading"}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          close={this.closeModal}
          modal={modal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
