import React, { PureComponent } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

class ExtraTimeSpentRow extends PureComponent {
  render() {
    const { date = '', index = 0, onRemove = () => {} } = this.props;
    return (
      <Row
        key={`${index + 1}`}
        justify="center"
        align="center"
        className={styles.ExtraTimeSpentRow}
      >
        <Col span={6}>{date}</Col>
        <Col span={6}>Sunday</Col>
        <Col span={9}>
          <Form.Item name={[index]} fieldKey={[index]}>
            <Input suffix="Hrs" />
          </Form.Item>
        </Col>
        <Col span={1} />
        <Col span={2}>
          <div onClick={() => onRemove(index)} className={styles.removeIcon}>
            <CloseOutlined />
          </div>
        </Col>
      </Row>
    );
  }
}

export default ExtraTimeSpentRow;
