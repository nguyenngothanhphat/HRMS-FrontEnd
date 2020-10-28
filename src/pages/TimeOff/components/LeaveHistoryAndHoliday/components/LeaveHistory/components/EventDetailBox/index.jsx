import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

export default class EventDetailBox extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const { from = '', to = '', type = '', duration = '', description = '' } = data;
    return (
      <Row className={styles.EventDetailBox}>
        <Col xs={3} className={styles.dateAndMonth}>
          <span>{moment(from).locale('en').format('MMM')}</span>
          <span>{moment(from).locale('en').format('DD')}</span>
        </Col>
        <Col xs={3} className={styles.dateAndMonth}>
          <span>{moment(to).locale('en').format('MMM')}</span>
          <span>{moment(to).locale('en').format('DD')}</span>
        </Col>
        <Col xs={13} className={styles.eventOfDay}>
          {description}
        </Col>
        <Col className={styles.dayInWeek} xs={5}>
          {`-`}
          {duration}
          {type}
          <span>
            <RightOutlined className={styles.arrowIcon} />
          </span>
        </Col>
      </Row>
    );
  }
}
