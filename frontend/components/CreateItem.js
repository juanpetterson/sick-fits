import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMesasge from '../components/ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Cool shoes',
    description: 'I love those',
    image: 'dog.jpg',
    largeImage: 'doggg.jpg',
    price: 100,
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    this.setState({ ...this.state, [name]: parsedValue });
  };

  handleSubmit = async (event, callback) => {
    event.preventDefault();
    const response = await callback();
    Router.push({ pathname: '/item', query: { id: response.data.createItem.ud } });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error, called, data }) => (
          <Form onSubmit={event => this.handleSubmit(event, createItem)}>
            <ErrorMesasge error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor='title'>
                Title
                <input
                  value={this.state.title}
                  onChange={this.handleChange}
                  type='text'
                  id='title'
                  name='title'
                  placeholder='Title'
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
                  value={this.state.price}
                  onChange={this.handleChange}
                  required></input>
              </label>
              <label htmlFor='description'>
                Description
                <textarea
                  id='description'
                  name='description'
                  placeholder='Description'
                  value={this.state.description}
                  onChange={this.handleChange}
                  required></textarea>
              </label>
              <button type='submit'>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
