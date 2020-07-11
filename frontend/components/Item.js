import React, { Component } from 'react';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteButton from './DeleteItem';

class Item extends Component {
  render() {
    const { item } = this.props;

    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link href={`/item?id${item.id}`}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>
        <div className='buttonList'>
          <Link href={{ pathname: '/edit', query: { id: item.id } }}>
            <a>Edit</a>
          </Link>
          <button>Add To Cart</button>
          <DeleteButton id={item.id}>Delete This Item</DeleteButton>
        </div>
      </ItemStyles>
    );
  }
}

export default Item;
