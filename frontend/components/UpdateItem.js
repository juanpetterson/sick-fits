import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMesasge from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
    updateItem(id: $id, title: $title, description: $description, price: $price) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = event => {
    const { name, type, value } = event.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    this.setState({ ...this.state, [name]: parsedValue });
  };

  handleSubmit = async (event, updateItemMutation) => {
    event.preventDefault();
    const response = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    Router.push({ pathname: '/item', query: { id: response.data.updateItem.id } });
  };

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id,
        }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item found for {this.props.id}</p>;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={event => this.handleSubmit(event, updateItem)}>
                  <ErrorMesasge error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor='title'>
                      Title
                      <input
                        id='title'
                        type='text'
                        name='title'
                        placeholder='Title'
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                        required></input>
                    </label>
                    <label htmlFor='price'>
                      Price
                      <input
                        id='price'
                        type='number'
                        name='price'
                        placeholder='Price'
                        min={0}
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                        required></input>
                    </label>
                    <label htmlFor='description'>
                      Description
                      <textarea
                        id='description'
                        name='description'
                        placeholder='Description'
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        required></textarea>
                    </label>
                    <button type='submit'>Save</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
