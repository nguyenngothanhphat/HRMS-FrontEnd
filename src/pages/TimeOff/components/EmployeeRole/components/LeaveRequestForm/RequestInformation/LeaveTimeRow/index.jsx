import React, { PureComponent } from 'react';
import { Row, Col, Form, Select } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { OptGroup, Option } = Select;

class LeaveTimeRow extends PureComponent {
  render() {
    const { eachDate = '', index = 0, needValidate } = this.props;

    return (
      <>
        {moment(eachDate).weekday() !== 6 && moment(eachDate).weekday() !== 0 && (
          <Row className={styles.LeaveTimeRow} key={`${index + 1}`} justify="center" align="center">
            <Col span={7}>{eachDate}</Col>
            <Col span={7}>{moment(eachDate).locale('en').format('dddd')}</Col>
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
                <Select placeholder="">
                  <OptGroup label="Count/Q.ty">
                    <Option value="WHOLE-DAY">
                      <span style={{ fontSize: 13 }}>Whole day</span>
                    </Option>
                    <Option value="MORNING">
                      <span style={{ fontSize: 13 }}>Morning</span>
                    </Option>
                    <Option value="AFTERNOON">
                      <span style={{ fontSize: 13 }}>Afternoon</span>
                    </Option>
                  </OptGroup>
                  <OptGroup label="Other">
                    <Option value="WORK">
                      <span
                        style={{
                          fontSize: 13,
                          color: '#00C598',
                          fontWeight: 'bold',
                        }}
                      >
                        Go to work
                      </span>
                    </Option>
                  </OptGroup>
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
