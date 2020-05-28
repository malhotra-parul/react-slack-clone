import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button } from "semantic-ui-react";

class ColorPanel extends Component {

    render() { 
        return ( 
            <Sidebar
            vertical 
            as={Menu}
            icon="labeled"
            inverted
            visible
            width="very thin"
            style={{background: "#ecb241"}}
            >
                <Divider />
                <Button icon="add" style={{background: "#4b9abe"}} size="small" inverted/>
            </Sidebar>
         );
    }
}
 
export default ColorPanel;