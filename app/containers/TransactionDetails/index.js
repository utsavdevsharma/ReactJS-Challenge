// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';

import { defaultTransactions } from '../../modules/defaults';


class TransactionDetails extends React.Component<> {

  state = {
    TransactionID: this.props.params.id,
    transaction: defaultTransactions.find( item => item.id === parseInt(this.props.params.id) ),
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

export default TransactionDetails;
