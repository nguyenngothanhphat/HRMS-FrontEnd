import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, DatePicker, Button, Checkbox } from 'antd';
import styles from './index.less';

const { Option } = Select;
export default class OptionsHeader extends PureComponent {
  onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('values', values);
    const { reloadData = () => {} } = this.props;
    reloadData();
  };

  render() {
    const dateFormat = 'Do MMM YYYY';

    return (
      <div className={styles.OptionsHeader}>
        <div className={styles.container}>
          <Form name="uploadForm" ref={this.formRef} onFinish={this.onFinish}>
            <Row gutter={['20', '20']}>
              <Col xs={5}>
                <span className={styles.itemLabel}>User ID - Name</span>
                <Form.Item name="userIdName">
                  <Select onChange={() => {}}>
                    <Option value="User A">User A</Option>
                    <Option value="User B">User B</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={8}>
                <span className={styles.itemLabel}>Duration</span>
                <div>
                  <Row gutter={['20', '20']}>
                    <Col xs={12}>
                      <Form.Item name="durationFrom">
                        <DatePicker placeholder="From Date" format={dateFormat} />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <span />
                      <Form.Item name="durationTo">
                        <DatePicker placeholder="To Date" format={dateFormat} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col xs={7}>
                <span className={styles.itemLabel}>Status</span>
                <Form.Item name="status">
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={12}>
                        <Checkbox value="Approved">Approved</Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox value="Cancel">Cancel</Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox value="Rejected">Rejected</Checkbox>
                      </Col>
                      <Col span={12}>
                        <Checkbox value="Waiting for approve">Waiting for approve</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col xs={4}>
                <Row
                  className={styles.buttons}
                  align="middle"
                  justify="center"
                  gutter={['20', '20']}
                >
                  <Col>
                    <Button className={styles.submitBtn} htmlType="submit">
                      Get data
                    </Button>
                  </Col>
                  <Col>
                    <Button className={styles.downloadCSVBtn}>Download as CSV</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
