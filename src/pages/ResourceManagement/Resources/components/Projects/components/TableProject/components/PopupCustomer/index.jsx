import React from 'react';
import { Avatar, Col, Divider, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';

import styles from './index.less';

const PopupCustomer = (props) => {
  const {
    dataCustomer: {
      customerOwner: {
        contactEmail = '',
        contactPhone = '',
        state = '',
        country = '',
        avatar = '',
      } = {},
      accountOwner: { generalInfo: { legalName: accountOwner = '' } = {} } = {},
      customer = '',
      customerId = '',
    },
  } = props;
  return (
    <div className={styles.popupContent}>
      <div className={styles.generalInfo}>
        <div className={styles.avatar}>
          {!avatar ? (
            <Avatar size={55} icon={<UserOutlined />} />
          ) : (
            <Avatar size={55} src={avatar} />
          )}
        </div>
        <div className={styles.employeeInfo}>
          <div className={styles.employeeInfo__name}>{customer || '-'}</div>
          <div className={styles.employeeInfo__customerID}>
            Customer ID: <span style={{ color: '#2C6DF9' }}>{customerId || '-'}</span>
          </div>
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.contact}>
        <Row gutter={[20, 20]}>
          <Col span={9}>
            <div className={styles.contact__title}>Account Owner: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__valueManager}>{accountOwner || '-'}</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Contact Phone: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__value}>{contactPhone || '-'}</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Contact Email: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              {contactEmail || '-'}
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Address: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              {state || '-'}, {country || '-'}
            </div>
          </Col>
        </Row>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.popupActions}>
        <div
          className={styles.popupActions__link}
          onClick={
            () => history.push(`/customer-management/customers/customer-profile/${customerId}`)
            // eslint-disable-next-line react/jsx-curly-newline
          }
        >
          View customer details
        </div>
      </div>
    </div>
  );
};

export default PopupCustomer;
