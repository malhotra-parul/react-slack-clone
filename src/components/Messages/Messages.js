import React, { Component, Fragment } from 'react';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import { Segment, Comment } from 'semantic-ui-react';
import firebase from "../firebase";
import Message from "./Message";

class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref("messages"),
        currentChannel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        numberOfUniqueUsers: ""
    }

    componentDidMount(){
        const {user, currentChannel} = this.state;

        if(user && currentChannel){
        this.addListeners(currentChannel.id);
        }
    }

    displayChannelName = channel => channel ? `${channel.name}` : "";

    addListeners = (channelId)=>{
        this.addMessageListener(channelId);
    }

    addMessageListener = (channelId) => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on("child_added", snap =>{
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });

            this.countUniqueUsers(loadedMessages);
        })
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message)=>{
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length>1 || uniqueUsers.length === 0 ? "s" : "";
        this.setState({numberOfUniqueUsers: `${uniqueUsers.length} user${plural}`});
    }

    displayMessages = (messages) => (
     
            messages.length>0 && messages.map(message =>(
                <Message
                key={message.timestamp}
                message={message}
                user={this.state.user} />
            ))
    )

    render() { 
        const {currentChannel, messagesRef, messages, user, numberOfUniqueUsers} = this.state;
        return ( 
           <Fragment>
               <MessagesHeader 
               channelName={this.displayChannelName(currentChannel)}
               numberOfUniqueUsers={numberOfUniqueUsers}/>
               
               <Segment>
                    <Comment.Group className="messages">
                      {this.displayMessages(messages)}
                    </Comment.Group>
               </Segment>

               <MessageForm currentChannel={currentChannel} 
                            messagesRef={messagesRef}
                            user={user} />
           </Fragment>
         );
    }
}
 
export default Messages;