import React, { Component } from "react";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Label,
  Icon,
  Segment,
} from "semantic-ui-react";
import { CompactPicker } from "react-color";
import firebase from "../firebase";
import {connect} from "react-redux";
import { setColors } from "../../actions/index";

const labelStyling = {
  margin: "1.3em",
};

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    userColors: [],
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  }

  addListener = (userId) => {
    let userColors = [];
    this.state.usersRef.child(`${userId}/colors`).on("child_added", (snap) => {
      userColors.unshift(snap.val());
      this.setState({ userColors },
      ()=> this.props.setColors(userColors[0].primary, userColors[0].secondary));
    });
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });
  handleColorPrimary = (color) => this.setState({ primary: color.hex });
  handleColorSecondary = (color) => this.setState({ secondary: color.hex });
  handleSaveColors = () => {
    if (this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  };
  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push()
      .update({
        primary: primary,
        secondary: secondary,
      })
      .then(() => {
        this.closeModal();

      })
      .catch((err) => console.error(err));
  };

  displayUserColors = (colors) =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
          <Divider />
        <div
          className="color__container"
          onClick={()=> this.props.setColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));

  render() {
    const { modal, primary, secondary, userColors } = this.state;
    return (
      <Sidebar
        vertical
        as={Menu}
        icon="labeled"
        inverted
        visible
        width="very thin"
        style={{ background: "white" }}
      >
        <Divider />
        <Button
          icon="add"
          style={{ background: "#4b9abe" }}
          size="small"
          inverted
          onClick={this.openModal}
        />
        {this.displayUserColors(userColors)}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color" style={labelStyling} />
              <CompactPicker
                color={primary}
                onChange={this.handleColorPrimary}
              />
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color" style={labelStyling} />
              <CompactPicker
                color={secondary}
                onChange={this.handleColorSecondary}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button inverted color="green" onClick={this.handleSaveColors}>
              <Icon name="checkmark" />
              Save colors
            </Button>
            <Button inverted color="red" onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(null, { setColors })(ColorPanel);
