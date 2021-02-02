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
    const dateFormat = 'MM.DD.YY';

    return (
      <div className={styles.OptionsHeader}>
        <div className={styles.container}>
          <Form name="uploadForm" ref={this.formRef} onFinish={this.onFinish}>
            <Row gutter={['20', '20']}>
              <Col xs={7}>
                <span className={styles.itemLabel}>User ID - Name</span>
                <Form.Item name="userIdName">
                  <Select placeholder="Select an user" onChange={() => {}}>
                    <Option value="User A">User A</Option>
                    <Option value="User B">User B</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={9}>
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
              <Col className={styles.buttons} xs={8}>
                <Button className={styles.submitBtn} htmlType="submit">
                  Get data
                </Button>
                <Button className={styles.downloadCSVBtn}>Download as CSV</Button>
              </Col>
            </Row>
            <Row>
              <Col className={styles.statusFilter}>
                <Form.Item name="status">
                  <span className={styles.itemLabel}>Status</span>
                  <Checkbox.Group>
                    <Checkbox value="Approved">Approved</Checkbox>
                    <Checkbox value="New">New</Checkbox>
                    <Checkbox value="Rejected">Rejected</Checkbox>
                    <Checkbox value="Waiting for approve">Waiting for approve</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
