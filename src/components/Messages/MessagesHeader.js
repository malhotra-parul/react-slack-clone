import React, { Component } from 'react';
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessagesHeader extends Component {
    state = {  }
    render() { 
        const { channelName, numberOfUniqueUsers, handleSearchChange, searchLoading } =  this.props;
         
        return ( 
            <Segment clearing>
                <Header as="h2" floated="left" fluid="true" style={{marginBottom : 0}}>
                    <span>
                    {`# ${channelName} `}
                    <Icon name="star outline" color="black"/>
                    </span>
                      <Header.Subheader>{numberOfUniqueUsers}</Header.Subheader>
                </Header>
                <Header floated="right">
                    <Input 
                    loading={searchLoading}
                    size="mini" 
                    icon="search"
                    placeholder="Search messages"
                    onChange={handleSearchChange}
                    />

                </Header>
            </Segment>
         );
    }
}
 
export default MessagesHeader;