// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import permalinks from 'routes/permalinks';

import transactionReducer from 'modules/transactions';
import { injectAsyncReducers } from 'store';

import {
  getTransactions,
  getInflowBalance,
  getOutflowBalance,
} from 'selectors/transactions';

import type { Transaction } from 'modules/transactions';
import formatAmount from 'utils/formatAmount';
import styles from './style.scss'
import BudgetGridRowStyles from 'components/BudgetGridRow/style.scss';
import BudgetGridStyles from 'containers/BudgetGrid/style.scss';

import DonutChart from 'components/DonutChart';

// inject reducers that might not have been originally there
injectAsyncReducers({
  transactions: transactionReducer,
});


type TransactionDetailsProps = {
  transactions: Transaction[],
};

class TransactionDetails extends React.Component<TransactionDetailsProps> {
  static defaultProps = {
    transactions: [],
  };

  state = {
    TransactionID: this.props.params.id,
    transaction: this.props.transactions.find( item => item.id === parseInt(this.props.params.id) ),
  }

  componentWillMount() {
    const transaction = this.state.transaction,
      amount = formatAmount(transaction.value),
      t = Object.assign({}, this.state.transaction);

    let chartData = new Array(),
      percent = 0;

    this.state.amount = amount;
    this.state.amountCls = amount.isNegative ? BudgetGridRowStyles.neg : BudgetGridRowStyles.pos;

    if( amount.isNegative ) {
      percent = t.value / this.props.totals.outflow * 100;

      t.percentWithSign = percent;
      t.value = percent * -1;

      chartData.push({
        id: 0,
        value: 100 + percent,
        description: "Rest outflow",
      });
    } else {
      percent = t.value / this.props.totals.inflow * 100 ;

      t.percentWithSign = percent;
      t.value = percent;

      chartData.push({
        id: 0,
        value: 100 - percent,
        description: "Rest inflow",
      });
    }
    chartData.unshift(t);

    this.state.chartData = chartData;
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
    const { transaction, amount, amountCls, chartData } = this.state,
      formattedAmount = formatAmount(chartData[0].percentWithSign, true, "percentage").text;

    return (
      <div>
        <h1>{transaction.description}</h1>
        <h2 className={amountCls}>{formattedAmount}</h2>

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
              <td>Amount: </td>
              <td className={amountCls}>
                <span className={BudgetGridRowStyles.cellContent}>{amount.text}</span>
              </td>
            </tr>

            <tr>
              <td>Percentage of budget: </td>
              <td className={amountCls}>{formattedAmount}</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }

  renderPieChart() {
    const { chartData } = this.state ;

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
  totals: {
    inflow: getInflowBalance(state),
    outflow: Math.abs(getOutflowBalance(state)),
  },
});

export default connect(mapStateToProps)(TransactionDetails);
