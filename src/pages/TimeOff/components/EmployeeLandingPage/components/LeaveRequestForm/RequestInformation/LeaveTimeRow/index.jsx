import React, { PureComponent } from 'react';
import { Row, Col, Form, Select } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;

class LeaveTimeRow extends PureComponent {
  render() {
    const { eachDate = '', index = 0, needValidate } = this.props;

    return (
      <>
        {moment.utc(eachDate).weekday() !== 6 && moment.utc(eachDate).weekday() !== 0 && (
          <Row className={styles.LeaveTimeRow} key={`${index + 1}`} justify="center" align="center">
            <Col span={7}>{moment.utc(eachDate).locale('en').format('MM/DD/YYYY')}</Col>
            <Col span={7}>{moment.utc(eachDate).locale('en').format('dddd')}</Col>
            <Col span={10}>
              <Form.Item
                name={[index]}
                fieldKey={[index]}
                rules={[
                  {
                    required: needValidate,
                    message: 'Please select!',
                  },
                ]}
              >
                <Select>
                  <Option value="WHOLE-DAY">
                    <span style={{ fontSize: 13 }}>Whole day</span>
                  </Option>
                  <Option value="MORNING">
                    <span style={{ fontSize: 13 }}>Morning</span>
                  </Option>
                  <Option value="AFTERNOON">
                    <span style={{ fontSize: 13 }}>Afternoon</span>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}
      </>
    );
  }
}

export default LeaveTimeRow;
