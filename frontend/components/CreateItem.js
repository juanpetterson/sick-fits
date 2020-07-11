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
    image: '',
    largeImage: '',
    price: 100,
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    this.setState({ ...this.state, [name]: parsedValue });
  };

  handleSubmit = async (event, createItemMutation) => {
    event.preventDefault();
    const response = await createItemMutation();
    Router.push({ pathname: '/item', query: { id: response.data.createItem.id } });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const response = await fetch('https://api.cloudinary.com/v1_1/sickfitsql/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await response.json();
    this.setState({ ...this.state, image: file.secure_url, largeImage: file.eager[0].secure_url });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error, called, data }) => (
          <Form onSubmit={event => this.handleSubmit(event, createItem)}>
            <ErrorMesasge error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor='file'>
                Image
                <input
                  onChange={this.uploadFile}
                  type='file'
                  id='file'
                  name='file'
                  placeholder='Upload and image'
                  required></input>
                {this.state.image && <img src={this.state.image} alt='Upload Preview' />}
              </label>
              <label htmlFor='title'>
                Title
                <input
                  id='title'
                  type='text'
                  name='title'
                  placeholder='Title'
                  value={this.state.title}
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
