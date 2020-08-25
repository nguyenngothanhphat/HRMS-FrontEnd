import React, { PureComponent } from 'react';
import { Row, Col, Divider } from 'antd';
import moment from 'moment';
import { log } from 'lodash-decorators/utils';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ExpenseTable from '@/components/ExpenseTable';
import PriceInput from '@/components/PriceInput';
import StatusFlow from '../StatusFlow';
import styles from './index.less';

class Popup extends PureComponent {
  detail = [
    {
      name: formatMessage({ id: 'common.title' }),
      key: 'title',
      select: 'title',
    },
    {
      name: formatMessage({ id: 'reimbursement.creator' }),
      key: 'creator',
      select: 'user.fullName',
    },
    {
      name: formatMessage({ id: 'reimbursement.submit-date' }),
      key: 'date',
      select: 'createdAt',
      render: val => moment(val).format('DD/MM/YYYY'),
    },
    {
      name: formatMessage({ id: 'common.description' }),
      key: 'description',
      select: 'description',
    },
  ];

  render() {
    const { item } = this.props;
    const { bills = [], user, currency, amount } = item;

    return (
      <div onClick={this.handleFocus} className={styles.root}>
        <Row>
          <Col sm={{ span: 8, push: 16 }}>
            <PriceInput
              className={styles.currency}
              value={{
                currency: currency || user.location.currency,
                number: amount.number,
              }}
            />
          </Col>
          <Col sm={{ span: 16, pull: 8 }}>
            {this.detail.map(row => {
              const splitVarName = row.select.split('.');
              let val = item;
              splitVarName.forEach((nameVar, i) => {
                try {
                  val = val[nameVar];
                  if (i === splitVarName.length - 1 && row.render) val = row.render(val, item);
                } catch (error) {
                  log(error.message);
                }
              });
              return (
                <Row key={row.key} className={styles.row}>
                  <Col md={6}>
                    <strong>{row.name}</strong>
                  </Col>
                  <Col className={styles.text} md={18}>
                    {val}
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col span={24}>
            <strong>
              <FormattedMessage id="common.status" />
            </strong>
          </Col>
          <Col span={24}>
            <StatusFlow item={item} />
          </Col>
        </Row>
        <Divider />
        <ExpenseTable
          title={formatMessage({ id: 'common.reimbursable' })}
          list={bills ? bills.filter(bill => bill.reimbursable) : []}
        />
        <ExpenseTable
          title={formatMessage({ id: 'common.non-reimbursable' })}
          list={bills ? bills.filter(bill => !bill.reimbursable) : []}
        />
      </div>
    );
  }
}

export default Popup;
