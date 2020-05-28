import React, { Component, Fragment } from 'react';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import { Segment, Comment } from 'semantic-ui-react';
import firebase from "../firebase";

class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref("messages"),
        currentChannel: this.props.currentChannel,
        user: this.props.currentUser
    }

    render() { 
        return ( 
           <Fragment>
               <MessagesHeader />
               
               <Segment>
                    <Comment.Group className="messages">
                        {/* Meesages will come here! */}
                    </Comment.Group>
               </Segment>

               <MessageForm currentChannel={this.state.currentChannel} 
                            messagesRef={this.state.messagesRef}
                            user={this.state.user} />
           </Fragment>
         );
    }
}
 
export default Messages;