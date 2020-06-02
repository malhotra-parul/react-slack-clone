import React, { Component, Fragment } from "react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../firebase";
import Message from "./Message";
import {connect} from "react-redux";
import { setUserPosts } from "../../actions/index";

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
    isChannelStarred: false,
    usersRef: firebase.database().ref("users")
  };

  componentDidMount() {
    const { user, currentChannel } = this.state;

    if (user && currentChannel) {
      this.addListeners(currentChannel.id);
      this.addUserStarsListener(currentChannel.id, user.uid);
    }
  }

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
    .child(userId).child("starred").once("value")
    .then(data =>{
      if(data.val() !== null){
        const channelIds = Object.keys(data.val());
        const prevStarred = channelIds.includes(channelId);
        this.setState({ isChannelStarred: prevStarred});
      }
    })
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
      this.countUserPosts(loadedMessages);
    });
  };

  handleStar = ()=>{
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), ()=> this.starChannel());
  }

  starChannel = ()=>{
    if(this.state.isChannelStarred){
      this.state.usersRef.child(`${this.state.user.uid}/starred`)
      .update({
        [this.state.currentChannel.id]: {
          name: this.state.currentChannel.name,
          details: this.state.currentChannel.details,
          createdBy: {
            name: this.state.currentChannel.createdBy.name,
            avatar: this.state.currentChannel.createdBy.avatar
          }
        }
      })
    }else{
      this.state.usersRef.child(`${this.state.user.uid}/starred`)
      .child(
        this.state.currentChannel.id
      ).remove(err=>{
        if(err !== null) console.error(err);
        
      })
        }
  }

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

  countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc, message)=>{
 
      if(message.user.name in acc){
        acc[message.user.name].count += 1;

      }else{
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc;
    }, {})
    this.props.setUserPosts(userPosts);
  }

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
      privateChannel,
      isChannelStarred
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(currentChannel)}
          numberOfUniqueUsers={numberOfUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          isChannelStarred={isChannelStarred}
          handleStar={this.handleStar}
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

export default connect(null, { setUserPosts })(Messages);
