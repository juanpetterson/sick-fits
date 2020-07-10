import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

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

  handleSubmit = event => {
    console.log(event);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <fieldset>
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
    );
  }
}

export default CreateItem;
