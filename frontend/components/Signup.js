import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMesasge from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e, signupMutation) => {
    e.preventDefault();

    await signupMutation();
    this.setState({ name: '', email: '', password: '' });
  };

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => (
          <Form method='post' onSubmit={e => this.handleSubmit(e, signup)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an Account</h2>
              <ErrorMesasge error={error} />
              <label htmlFor='email'>
                Email
                <input
                  type='text'
                  name='email'
                  placeholder='Email'
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor='name'>
                Name
                <input
                  type='text'
                  name='name'
                  placeholder='Name'
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor='password'>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>
              <button type='submit'>Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
