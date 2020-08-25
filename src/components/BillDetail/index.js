import React, { PureComponent } from 'react';
import { Row, Col, Icon, Button } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import GoogleMap from '@/components/GoogleMap';
import Gallery from '@/components/Gallery';
import PriceInput from '@/components/PriceInput';
import { capitalizeFirstLetter } from '@/utils/utils';
import { ReactComponent as Tag } from '@/assets/svg/tag.svg';
import styles from './index.less';

@connect()
class BillDetail extends PureComponent {
  handleEdit = expenseDetail => {
    const { dispatch } = this.props;
    // const idExpense = expenseDetail._id;
    dispatch({ type: 'bill/save', payload: { item: expenseDetail } });
    // router.push(`expense/update/${idExpense}`);
  };

  render() {
    const { bill, action, closeExpenseDetail, isExpBtnDisabled = false } = this.props;
    const { exchangeRate, originCurrency, currency } = bill;
    return (
      <div className={styles.root}>
        {typeof bill !== 'object' ? (
          <div className={styles.noItem}>
            <Icon type="file-text" />
            <div className={styles.text}>
              <FormattedMessage id="reimbursement.noBill" />
            </div>
          </div>
        ) : (
          <div>
            {!bill.mileage ? (
              <Gallery images={bill.images} />
            ) : (
              <GoogleMap
                style={{ minHeight: '400px' }}
                origin={bill.mileage.from}
                destination={bill.mileage.to}
                waypoints={bill.mileage.stop}
                travelMode={bill.mileage.type}
              />
            )}
            <Row className={styles.content} type="flex" align="middle" justify="space-between">
              <Col span={12}>
                <span className={styles.title}>{formatMessage({ id: 'bill.detail.title' })}</span>
              </Col>
              <Col className={styles.price}>
                <PriceInput
                  className={styles.currency}
                  value={{ currency: bill.originCurrency, number: bill.originAmount }}
                />
                {['new', 'update'].indexOf(action) > -1 && bill.status === 'ACTIVE' && (
                  <Link to={`/expense/${bill.id}`}>
                    <Icon type="edit" />
                    &nbsp; <FormattedMessage id="bill.edit" />
                  </Link>
                )}
              </Col>
            </Row>
            <Row type="flex" gutter={8} style={{ paddingTop: '14px' }}>
              <Col span={9}>
                <span className={styles.subTitle}>
                  {formatMessage({ id: 'bill.date-of-spent' })}
                </span>
              </Col>
              <Col className={styles.tagRow} span={15}>
                <span className={styles.subContent}>
                  {`: ${moment(bill.date).format('MMM DD, YYYY')}`}
                </span>
                <span className={`${styles.subContent} ${styles.flexBox}`}>
                  <Tag
                    style={{
                      width: 14,
                      height: 14,
                      marginRight: 5,
                    }}
                  />
                  {bill.tag && bill.tag.groupName
                    ? bill.tag.groupName
                    : formatMessage({ id: 'common.non-tag' })}
                </span>
              </Col>
            </Row>
            {exchangeRate && originCurrency && currency && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>{formatMessage({ id: 'bill.ex-rate' })}</span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>
                    {`: ${`${currency}/${originCurrency} - ${exchangeRate}`}`}
                  </span>
                </Col>
              </Row>
            )}
            {bill.description && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>
                    {formatMessage({ id: 'bill.table.purpose' })}
                  </span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>{`: ${bill.description}`}</span>
                </Col>
              </Row>
            )}
            {bill.type && bill.type.type === 'MILEAGE' && (
              <React.Fragment>
                {bill.mileage && bill.mileage.type && (
                  <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                    <Col span={9}>
                      <span className={styles.subTitle}>
                        {formatMessage({ id: 'bill.mileageType' })}
                      </span>
                    </Col>
                    <Col span={15}>
                      <span className={styles.subContent}>
                        {`: ${bill.mileage.type.charAt(0).toUpperCase() +
                          bill.mileage.type.slice(1)}`}
                      </span>
                    </Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {bill.type && bill.type.type === 'MILEAGE' && (
              <React.Fragment>
                {bill.mileage && bill.mileage.distance && bill.mileage.distanceUnit && (
                  <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                    <Col span={9}>
                      <span className={styles.subTitle}>
                        {formatMessage({ id: 'bill.mileageDistance' })}
                      </span>
                    </Col>
                    <Col span={15}>
                      <span className={styles.subContent}>
                        {`: ${bill.mileage.distance + bill.mileage.distanceUnit}`}
                      </span>
                    </Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {bill.merchant && bill.type && bill.type.type !== 'MILEAGE' && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>{formatMessage({ id: 'bill.merchant' })}</span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>{`: ${bill.merchant}`}</span>
                </Col>
              </Row>
            )}
            {bill.project && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>{formatMessage({ id: 'bill.project' })}</span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>{`: ${bill.project.name}`}</span>
                </Col>
              </Row>
            )}
            {bill.type && bill.type.name && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>{formatMessage({ id: 'bill.category' })}</span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>{`: ${bill.type.name}`}</span>
                </Col>
              </Row>
            )}
            {bill.paymentOption && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>
                    {formatMessage({ id: 'bill.payment-option' })
                      .split(' ')
                      .map(item => capitalizeFirstLetter(item))
                      .join(' ')}
                  </span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>
                    {`: ${bill.paymentOption
                      .split(' ')
                      .map(item => capitalizeFirstLetter(item))
                      .join(' ')}`}
                  </span>
                </Col>
              </Row>
            )}
            {bill.creditCard && bill.creditCard.number && (
              <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
                <Col span={9}>
                  <span className={styles.subTitle}>
                    {formatMessage({ id: 'bill.creditCard' })
                      .split(' ')
                      .map(item => capitalizeFirstLetter(item))
                      .join(' ')}
                  </span>
                </Col>
                <Col span={15}>
                  <span className={styles.subContent}>
                    {`: xxxx - xxxx - xxxx - ${bill.creditCard.number.slice(
                      bill.creditCard.number.length - 4,
                      bill.creditCard.number
                    )}`}
                  </span>
                </Col>
              </Row>
            )}
            <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
              <Col span={9}>
                <span className={styles.subTitle}>{formatMessage({ id: 'common.billable' })}</span>
              </Col>
              <Col span={15}>
                <span className={styles.subContent}>
                  {`:
                ${
                  bill.billable
                    ? formatMessage({ id: 'common.yes' })
                    : formatMessage({ id: 'common.no' })
                }`}
                </span>
              </Col>
            </Row>
            <Row type="flex" gutter={8} style={{ paddingTop: '10px' }}>
              <Col span={9}>
                <span className={styles.subTitle}>
                  {formatMessage({ id: 'common.reimbursable' })}
                </span>
              </Col>
              <Col span={15}>
                <span className={styles.subContent}>
                  {`:
                ${
                  bill.reimbursable
                    ? formatMessage({ id: 'common.yes' })
                    : formatMessage({ id: 'common.no' })
                }`}
                </span>
              </Col>
            </Row>
          </div>
        )}
        <div className={styles.controlButton}>
          <Button className={styles.btnReset} onClick={closeExpenseDetail}>
            <FormattedMessage id="common.close" />
          </Button>
          <Link
            to={
              bill.type && bill.type.name === 'Mileage'
                ? `/expense/updatemileage/${bill.id}`
                : `/expense/update/${bill.id}`
            }
          >
            <Button
              className={`${styles.btnApply} ${isExpBtnDisabled ? styles.btnDisabled : ''}`}
              type="primary"
              disabled={isExpBtnDisabled}
              onClick={() => this.handleEdit(bill)}
            >
              {formatMessage({ id: 'common.edit' }).toUpperCase()}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
export default BillDetail;
