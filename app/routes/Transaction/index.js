// @flow
import React, { Component } from 'react';

import Chunk from 'components/Chunk';

const loadTransactionDetails = () => import('containers/TransactionDetails');

class Transaction extends Component<> {
  render() {
    return <Chunk load={loadTransactionDetails} params={this.props.match.params}/>;
  }
}


export default Transaction;
