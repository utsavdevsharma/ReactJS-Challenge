// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import transactionReducer from 'modules/transactions';
import categoryReducer from 'modules/categories';
import { injectAsyncReducers } from 'store';

import { getTransactions } from 'selectors/transactions';
import { getCategories } from 'selectors/categories';

import type { Transaction } from 'modules/transactions';


// inject reducers that might not have been originally there
injectAsyncReducers({
  transactions: transactionReducer,
  categories: categoryReducer,
});


type TransactionDetailsProps = {
  transactions: Transaction[],
  categories: Object,
};

class TransactionDetails extends React.Component<TransactionDetailsProps> {
  static defaultProps = {
    transactions: [],
    categories: {},
  };

  state = {
    TransactionID: this.props.params.id,
    transaction: this.props.transactions.find( item => item.id === parseInt(this.props.params.id) ),
  }

  render() {
    return (
      <div>

        <Link to="/budget">&lt; back to transactions</Link>

        {this.state.transaction ? (
          this.renderDetails()
        ) : (
          <h4>Transaction not found.</h4>
        )}

      </div>
    )
  }

  renderDetails() {
    return (
      <table>
        <tbody>
          <tr>
            <td>Item: </td>
            <td>{this.state.transaction.id}</td>
          </tr>

          <tr>
            <td>Description: </td>
            <td>{this.state.transaction.description}</td>
          </tr>

          <tr>
            <td>Category: </td>
            <td>{this.state.transaction.categoryId}</td>
          </tr>

          <tr>
            <td>Amount: </td>
            <td>{this.state.transaction.value}</td>
          </tr>

          <tr>
            <td>Percentage of total budget: </td>
            <td>%</td>
          </tr>

        </tbody>
      </table>
    )
  }


}

const mapStateToProps = state => ({
  transactions: getTransactions(state),
  categories: getCategories(state),
});

export default connect(mapStateToProps)(TransactionDetails);
