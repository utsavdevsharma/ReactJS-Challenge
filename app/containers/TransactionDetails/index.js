// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import permalinks from 'routes/permalinks';

import transactionReducer from 'modules/transactions';
import categoryReducer from 'modules/categories';
import { injectAsyncReducers } from 'store';

import {
  getTransactions,
  getInflowBalance,
  getOutflowBalance,
} from 'selectors/transactions';
import { getCategories } from 'selectors/categories';

import type { Transaction } from 'modules/transactions';
import formatAmount from 'utils/formatAmount';
import styles from './style.scss'
import BudgetGridRowStyles from 'components/BudgetGridRow/style.scss';
import BudgetGridStyles from 'containers/BudgetGrid/style.scss';

import DonutChart from 'components/DonutChart';

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

        <Link to={`/${permalinks.budget}`} className={styles.backButton} >&lt; back to all transactions</Link>

        {this.state.transaction ? (
          <div className={styles.clearfix}>
            <div className={styles.leftCol}>{this.renderDetails()}</div>
            <div className={styles.rightCol}>{this.renderPieChart()}</div>
          </div>
        ) : (
          <h4>Transaction not found.</h4>
        )}

      </div>
    )
  }

  renderDetails() {
    const transaction = this.state.transaction,
      amount = formatAmount(transaction.value),
      amountCls = amount.isNegative ? BudgetGridRowStyles.neg : BudgetGridRowStyles.pos;

    return (
      <div>
        <h1>{transaction.description}</h1>
        <h2 className={amountCls}>%</h2>

        <table className={BudgetGridStyles.budgetGrid}>
          <tbody>
            <tr>
              <td>Item: </td>
              <td>{transaction.id}</td>
            </tr>

            <tr>
              <td>Description: </td>
              <td>{transaction.description}</td>
            </tr>

            <tr>
              <td>Category: </td>
              <td>{transaction.categoryId}</td>
            </tr>

            <tr>
              <td>Amount: </td>
              <td className={amountCls}>
                <span className={BudgetGridRowStyles.cellContent}>{amount.text}</span>
              </td>
            </tr>

            <tr>
              <td>Percentage of total budget: </td>
              <td className={amountCls}>%</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }

  renderPieChart() {
    const transaction = Object.assign({}, this.state.transaction);

    let chartData = new Array(),
      percent = 0;

    if( transaction.value<0 ) {
      percent = transaction.value / this.props.totals.outflow * 100 * -1;

      transaction.value = percent;

      chartData.push({
        id: 0,
        value: 100 - percent,
        description: "Rest outflow",
      });
    } else {
      percent = transaction.value / this.props.totals.inflow * 100 ;

      transaction.value = percent;

      chartData.push({
        id: 0,
        value: 100 - percent,
        description: "Rest inflow",
      });
    }

    chartData.unshift(transaction);

    return (
      <DonutChart
        data={chartData}
        dataLabel="description" dataKey="id"
        innerRatio={0}
        // zero innerRadius makes donut chart look like pie chart

        height={200}
        format="percentage" />
    );
  }


}

const mapStateToProps = state => ({
  transactions: getTransactions(state),
  categories: getCategories(state),
  totals: {
    inflow: getInflowBalance(state),
    outflow: Math.abs(getOutflowBalance(state)),
  },
});

export default connect(mapStateToProps)(TransactionDetails);
