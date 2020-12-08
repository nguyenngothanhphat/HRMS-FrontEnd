import React, { PureComponent } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

class ExtraTimeSpentRow extends PureComponent {
  // validator = (rule, value, callback) => {
  //   try {
  //     if (value < 10) {
  //       throw new Error('Something wrong!');
  //     }
  //     callback();
  //   } catch (err) {
  //     callback(err);
  //   }
  // };

  render() {
    const {
      eachDate = {},
      index = 0,
      onRemove = () => {},
      onChange = () => {},
      listLength = 0,
      totalHours = 0,
      totalDays = 0,
    } = this.props;

    const { date = '' } = eachDate;
    return (
      <Row className={styles.ExtraTimeSpentRow}>
        <Col span={16}>
          <Row key={`${index + 1}`} justify="center" align="center" className={styles.rowContainer}>
            <Col span={6}>{date}</Col>
            <Col span={6}>{moment(date).locale('en').format('dddd')}</Col>
            <Col span={9}>
              <Form.Item name={[index]} fieldKey={[index]}>
                <Input onChange={(e) => onChange(e, index)} placeholder="0" suffix="Hrs" />
              </Form.Item>
            </Col>
            <Col span={1} />
            <Col span={2}>
              {listLength > 1 && (
                <div onClick={() => onRemove(index)} className={styles.removeIcon}>
                  <CloseOutlined />
                </div>
              )}
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          {index + 1 === listLength && (
            <div className={styles.smallNotice}>
              <span className={styles.normalText}>
                Total extra time spent:
                <br />
                <span style={{ fontWeight: 'bold', fontSize: '10px' }}>
                  {totalHours} hrs ({totalDays} days)
                </span>
              </span>
            </div>
          )}
        </Col>
      </Row>
    );
  }
}

export default ExtraTimeSpentRow;
