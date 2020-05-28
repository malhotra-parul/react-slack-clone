import React, { Component, Fragment } from 'react';
import { Message, Segment } from 'semantic-ui-react';

class Messages extends Component {

    render() { 
        return ( 
           <Fragment>
               <MessagesHeader />
               
               <Segment>
                    <Comment.Group>
                        {/* Meesages will come here! */}
                    </Comment.Group>
               </Segment>

               <MessageForm />
           </Fragment>
         );
    }
}
 
export default Messages;