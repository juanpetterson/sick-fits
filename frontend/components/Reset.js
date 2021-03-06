import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMesasge from './ErrorMessage';

import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  state = {
    password: '',
    confirmPassword: '',
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e, resetPasswordMutation) => {
    e.preventDefault();

    await resetPasswordMutation();
    this.setState({ password: '', confirmPassword: '' });
  };

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(resetPassword, { error, loading }) => (
          <Form method='post' onSubmit={e => this.handleSubmit(e, resetPassword)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your Password</h2>
              <ErrorMesasge error={error} />
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
              <label htmlFor='confirmPassword'>
                Confirm Password
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                />
              </label>
              <button type='submit'>Reset your password!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Reset;
