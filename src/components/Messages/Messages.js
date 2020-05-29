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
        messagesLoading: true
    }

    componentDidMount(){
        const {user, currentChannel} = this.state;

        if(user && currentChannel){
        this.addListeners(currentChannel.id);
        }
    }

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
            })
        })
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
        const {currentChannel, messagesRef, messages, user} = this.state;
        return ( 
           <Fragment>
               <MessagesHeader />
               
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