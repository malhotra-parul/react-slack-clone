import React from "react";
import firebase from "../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Message,
  Icon,
  Header,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import md5 from "md5";


class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users")
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    //create user with email and password
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          }).then(()=> {
            this.saveUser(createdUser).then(()=> {
                  console.log("user saved!")
                  this.setState({loading: false})
                })
          })
            .catch(err => {
              console.log(err);
              this.setState({errors: [err, ...this.state.errors], loading: false})
            })
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            errors: [err, ...this.state.errors],
            loading: false,
          });
        });
    }
  };

  saveUser = (createdUser)=>{
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  };

  displayError = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      console.log(password, passwordConfirmation);
      return false;
    } else {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      console.log([error, ...errors]);
      this.setState({ errors: [error, ...errors] }, () =>
        console.log(this.state.errors)
      );

      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: [error, ...errors] });
      return false;
    } else {
      return true;
    }
  };

  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      passwordConfirmation,
      password,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: "450px" }}>
          <Header as="h2" icon color="pink" textAlign="center">
            <Icon name="slack" color="pink" />
            Register for DevSlack
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
                value={username}
                className={this.handleInputError(errors, "username")}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                type="email"
                className={this.handleInputError(errors, "email")}
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                className={this.handleInputError(errors, "password")}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Re-enter Password"
                type="password"
                value={passwordConfirmation}
                className={this.handleInputError(errors, "password")}
                onChange={this.handleChange}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                size="large"
                color="pink"
                fluid
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error color="red">
              <h3>Error!</h3>
              {this.displayError(errors)}
            </Message>
          )}
          <Message>
            Already a User?<Link to="/login"> Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
