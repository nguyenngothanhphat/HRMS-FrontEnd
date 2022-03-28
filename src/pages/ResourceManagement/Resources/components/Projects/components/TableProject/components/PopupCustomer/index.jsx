import React from 'react';
import { Avatar, Col, Divider, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';

import styles from './index.less';

const PopupCustomer = (props) => {
  const {
    dataCustomer: {
      customerName = '',
      customerId = '',
      accountOwner = '',
      phone = '',
      email = '',
      address = '',
    },
  } = props;
  const urlProjectDetail = 'aaaaa';
  return (
    <div className={styles.popupContent}>
      <div className={styles.generalInfo}>
        <div className={styles.avatar}>
          <Avatar size={55} icon={<UserOutlined />} />
        </div>
        <div className={styles.employeeInfo}>
          <div className={styles.employeeInfo__name}>ABC</div>
          <div className={styles.employeeInfo__customerID}>
            Customer ID: <span style={{ color: '#2C6DF9' }}>210000</span>
          </div>
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.contact}>
        <Row gutter={[24, 24]}>
          <Col span={9}>
            <div className={styles.contact__title}>Account Owner: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__valueManager}>Unar coper</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Contact Phone: </div>
          </Col>
          <Col span={15}>
            <div className={styles.contact__value}>+9654654211</div>
          </Col>
          <Col span={9}>
            <div className={styles.contact__title}>Contact Email: </div>
          </Col>
          <Col span={15}>
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              className={styles.contact__value}
            >
              jkhkjhjkh@gmail.com
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
              Thanh Pho Ho Chi Minh, Viet Nam
            </div>
          </Col>
        </Row>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.popupActions}>
        <div
          className={styles.popupActions__link}
          onClick={() => history.push(`/directory/employee-profile/${urlProjectDetail}`)}
        >
          View full profile
        </div>
      </div>
    </div>
  );
};

export default PopupCustomer;
