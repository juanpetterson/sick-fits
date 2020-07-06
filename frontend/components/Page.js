import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../components/Header';
import Meta from '../components/Meta';

const MyButton = styled.button`
  background: red;
  font-size: 100px;
`;

class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        <MyButton>Click Me</MyButton>
        {this.props.children}
      </div>
    );
  }
}

export default Page;
