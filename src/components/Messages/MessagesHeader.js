import React, { Component } from 'react';
import { Segment, Header, Icon, Input } from "semantic-ui-react";

class MessagesHeader extends Component {
    state = {  }
    render() { 
        const { 
            channelName, 
            numberOfUniqueUsers, 
            handleSearchChange, 
            searchLoading, 
            isPrivateChannel,
            handleStar,
            isChannelStarred } =  this.props;
         
        return ( 
            <Segment clearing>
                <Header as="h2" floated="left" fluid="true" style={{marginBottom : 0}}>
                    <span>
                    {`${channelName} `}
                    {!isPrivateChannel && (
                    <Icon onClick={handleStar} 
                          name={isChannelStarred ? "star" : "star outline"}
                          color={isChannelStarred ? "yellow" : "black"}
                          />
                          )
                    }
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