import { Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import styles from './index.less';

const mockData = [
  {
    id: 1,
    time: '03/20/2020',
    name: 'Krishna Jamnastami',
  },
  {
    id: 2,
    time: '03/20/2020',
    name: 'Krishna Jamnastami',
  },
  {
    id: 3,
    time: '03/20/2020',
    name: 'Krishna Jamnastami',
  },
  {
    id: 4,
    time: '03/20/2020',
    name: 'Krishna Jamnastami',
  },
];

export default class Holiday extends PureComponent {
  render() {
    return (
      <div className={styles.Holiday}>
        {mockData.map((row) => {
          return (
            <Row className={styles.eachRow}>
              <Col xs={4} className={styles.dateAndMonth}>
                <span>{moment(row.time).locale('en').format('MMM')}</span>
                <span>{moment(row.time).locale('en').format('DD')}</span>
              </Col>
              <Col xs={15} className={styles.eventOfDay}>
                {row.name}
              </Col>
              <Col className={styles.dayInWeek} xs={5}>
                {moment(row.time).locale('en').format('dddd')}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}
