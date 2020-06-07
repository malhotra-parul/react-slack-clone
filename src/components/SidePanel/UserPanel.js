import React, { Component } from "react";
import firebase from "../firebase";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: "",
    croppedImage: "",
    blob: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    metadata: {
        contentType: "image/jpeg"
    },
    uploadedCroppedImage: "",
    usersRef: firebase.database().ref("users")

  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  dropdownOptions = () => {
    return [
      {
        key: "user",
        text: (
          <span>
            Signed in as <strong>{this.state.user.displayName}</strong>
          </span>
        ),
        disabled: true,
      },
      {
        key: "avatar",
        text: <span onClick={this.openModal}>Change Avatar</span>,
      },
      {
        key: "signout",
        text: <span onClick={this.handleSignOut}>Sign Out!</span>,
      },
    ];
  };

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };

  handleChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  setEditorRef = (editor) => (this.editor = editor);

  handleCroppedImage = () => {
    if (this.editor) {
      this.editor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({ croppedImage: imageUrl, blob });
      });
    }
  };

  uploadCroppedImage = () => {
    const {storageRef, userRef, blob, metadata} = this.state;

    storageRef.child(`avatars/users/${userRef.uid}`)
    .put(blob, metadata)
    .then(snap => {
        snap.ref.getDownloadURL().then(downloadUrl => {
            this.setState({uploadedCroppedImage: downloadUrl}, ()=> this.changeAvatar())
        })
    })
  };

  changeAvatar = () => {

    //first step - update profile
      this.state.userRef.updateProfile({
          photoURL: this.state.uploadedCroppedImage
      }).then(()=> {
          console.log("photo updated");
          this.closeModal();
      }).catch(err => {
          console.error(err);
      })

      //second step - update users collection
      this.state.usersRef.child(this.state.user.uid).update({
          avatar: this.state.uploadedCroppedImage
      }).then(() => console.log("avatar updated") )
      .catch((err) => console.error(err));
  }

  render() {
    const { primaryColor } = this.props;
    const { user, modal, previewImage, croppedImage } = this.state;

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevSlack</Header.Content>
            </Header>

            {/* A Dropdown for User */}

            <Header inverted as="h3" style={{ padding: "0.25em" }}>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
          <Modal basic open={modal} onClose={this.openModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
                onChange={this.handleChange}
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {/* Image preview */}
                    {previewImage && (
                      <AvatarEditor
                        ref={this.setEditorRef}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image
                        src={croppedImage}
                        style={{ margin: "3.5em auto" }}
                        width={100}
                        height={100}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button
                  inverted
                  color="green"
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name="save" /> Save Avatar
                </Button>
              )}
              <Button inverted color="green" onClick={this.handleCroppedImage}>
                <Icon name="image" /> Preview
              </Button>
              <Button inverted color="red" onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
