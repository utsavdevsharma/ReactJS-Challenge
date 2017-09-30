// @flow
import * as React from 'react';
import formatAmount from 'utils/formatAmount';
import styles from './styles.scss';

type LegendItemProps = {
  color: string,
  value: number,
  label: string,
};

const LegendItem = ({ color, label, value, format }: LegendItemProps) => (
  <li style={{ color }}>
    <span>{label}</span>
    <span className={styles.value}> {formatAmount(value, false, format).text} </span>
  </li>
);

export default LegendItem;
