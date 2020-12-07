import React, { PureComponent } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

class ExtraTimeSpentRow extends PureComponent {
  render() {
    const {
      eachDate = {},
      index = 0,
      onRemove = () => {},
      onChange = () => {},
      listLength = 0,
    } = this.props;
    const { date = '' } = eachDate;
    return (
      <Row
        key={`${index + 1}`}
        justify="center"
        align="center"
        className={styles.ExtraTimeSpentRow}
      >
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
    );
  }
}

export default ExtraTimeSpentRow;
