import React, { Component, Fragment } from "react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../firebase";
import Message from "./Message";

class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref("privateMessages"),
    messagesRef: firebase.database().ref("messages"),
    currentChannel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numberOfUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
  };

  componentDidMount() {
    const { user, currentChannel } = this.state;

    if (user && currentChannel) {
      this.addListeners(currentChannel.id);
    }
  }

  displayChannelName = (channel) => { 
    return (channel ? `${this.state.privateChannel ? "@ " : "# "}${channel.name}` : "");
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });

      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural =
      uniqueUsers.length > 1 || uniqueUsers.length === 0 ? "s" : "";
    this.setState({
      numberOfUniqueUsers: `${uniqueUsers.length} user${plural}`,
    });
  };

  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => {
        this.searchMessages();
      }
    );
  };

  getMessagesRef = ()=>{
    const { privateChannel, privateMessagesRef, messagesRef } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  searchMessages = () => {
    const currentMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "ig");
    const filteredMessages = currentMessages.reduce((acc, message) => {
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults: filteredMessages });
    setTimeout(()=> this.setState({searchLoading: false}), 1000);
  };

  render() {
    const {
      currentChannel,
      messagesRef,
      messages,
      user,
      numberOfUniqueUsers,
      searchResults,
      searchTerm,
      searchLoading,
      privateChannel
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(currentChannel)}
          numberOfUniqueUsers={numberOfUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={currentChannel}
          messagesRef={messagesRef}
          user={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    );
  }
}

export default Messages;
