import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import styles from './index.less';

class LeaveTimeRow2 extends PureComponent {
  render() {
    const { fromDate = '', toDate = '', noOfDays = 0 } = this.props;

    return (
      <Row className={styles.LeaveTimeRow2} justify="center" align="center" gutter={[8, 8]}>
        <Col span={7}>{moment(fromDate).locale('en').format('MM/DD/YYYY')}</Col>
        <Col span={7}>{moment(toDate).locale('en').format('MM/DD/YYYY')}</Col>
        <Col span={10}>{noOfDays}</Col>
      </Row>
    );
  }
}

export default LeaveTimeRow2;
