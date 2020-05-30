import React, { Component } from 'react';
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessagesHeader extends Component {
    state = {  }
    render() { 
        const { channelName } =  this.props;
         return ( 
            <Segment clearing>
                <Header as="h2" floated="left" fluid="true" style={{marginBottom : 0}}>
                    <span>
                    {`# ${channelName} `}
                    <Icon name="star outline" color="black"/>
                    </span>
                    <Header.Subheader>2 Users</Header.Subheader>
                </Header>
                <Header floated="right">
                    <Input 
                    size="mini" 
                    icon="search"
                    placeholder="Search messages"
                    />

                </Header>
            </Segment>
         );
    }
}
 
export default MessagesHeader;