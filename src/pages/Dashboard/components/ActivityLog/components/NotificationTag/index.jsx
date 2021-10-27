import { Row, Col } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const NotificationTag = (props) => {
  const { item: { date = '', userId = '', name = '', type } = {} } = props;

  // RENDER UI
  const renderTag = () => {
    const dateTemp = moment(date).date();
    const monthTemp = moment(date).locale('en').format('MMM');
    return (
      <Col span={24}>
        <div className={styles.NotificationTag}>
          <Row align="middle" justify="space-between">
            <Col span={20} className={styles.leftPart}>
              <div className={styles.dateTime}>
                <span>{dateTemp}</span>
                <span>{monthTemp}</span>
              </div>
              <div className={styles.content}>
                New {type} request from {name}{' '}
                <span className={styles.userId}>[User ID-{userId}]</span> has been received.
              </div>
            </Col>
            <Col span={4} className={styles.rightPart}>
              <div className={styles.viewBtn}>
                <span>View</span>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  return renderTag();
};

export default connect(() => ({}))(NotificationTag);
