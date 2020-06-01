import React, { Component } from 'react';
import { connect } from "react-redux";
import { Menu,Icon } from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel} from "../../actions/index";

class Starred extends Component {
    state = { 
        starredChannels:[],
        activeChannel: ""
     }

    setActiveChannel = (channel) => {
        this.setState({ activeChannel: channel.id });
      };

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
      };

    displayChannels = (starredChannels) =>
     starredChannels.length > 0 &&
     starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        style={{ opacity: 0.9 }}
        name={channel.name}
        active={this.state.activeChannel === channel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

    render() { 
        const { starredChannels } = this.state;
        return (
            <Menu.Menu>
            <Menu.Item>
              <span>
                <Icon name="star" /> STARRED
              </span>{" "}
              ({starredChannels.length})
            </Menu.Item>
            {this.displayChannels(starredChannels)}
          </Menu.Menu>
          );
    }
}
 
export default connect(null,{setCurrentChannel, setPrivateChannel} )(Starred);