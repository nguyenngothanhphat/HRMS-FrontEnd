import { Col, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import styles from './index.less';

class LeaveTimeRow2 extends PureComponent {
  render() {
    const { fromDate = '', toDate = '', noOfDays = 0 } = this.props;

    return (
      <Row className={styles.LeaveTimeRow2} justify="center" align="center" gutter={[4, 8]}>
        <Col span={7}>{moment(fromDate).locale('en').format(DATE_FORMAT_MDY)}</Col>
        <Col span={7}>{moment(toDate).locale('en').format(DATE_FORMAT_MDY)}</Col>
        <Col span={10}>{noOfDays}</Col>
      </Row>
    );
  }
}

export default LeaveTimeRow2;
