import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, DatePicker, Button, Checkbox } from 'antd';
import styles from './index.less';

const { Option } = Select;
export default class OptionsHeader extends PureComponent {
  onFinish = (values) => {
    const { reloadData } = this.props;
    return reloadData(values);
  };

  // onFromChange = (value) => {
  //   const newMoment = moment(value).format('MM-DD-YY');
  //   this.setState({
  //     from: newMoment,
  //   });
  // };

  // onChange = (value) => {
  //   console.log(value);
  // };

  render() {
    const { listEmployee } = this.props;
    const dateFormat = 'MM-DD-YY';
    const options = [
      { value: 'APPROVED', label: 'Approved' },
      { value: 'IN-PROGRESS', label: 'New' },
      { value: 'REJECTED', label: 'Rejected' },
      { value: 'WAITING-FOR-APPROVE', label: 'Waiting for approve' },
    ];
    const nameOpt = ['APPROVED', 'IN-PROGRESS', 'REJECTED', 'WAITING-FOR-APPROVE'];
    return (
      <div className={styles.OptionsHeader}>
        <div className={styles.container}>
          <Form name="uploadForm" ref={this.formRef} onFinish={this.onFinish}>
            <Row gutter={['20', '20']}>
              <Col xs={7}>
                <span className={styles.itemLabel}>User ID - Name</span>
                <Form.Item name="userIdName">
                  <Select placeholder="Select an user">
                    {listEmployee.map((item = {}) => {
                      return (
                        <Option key={item._id} value={item._id}>
                          {`${item.name}`}
                        </Option>
                      );
                    })}
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
              <Col xs={1}>
                <span className={styles.itemStatusLabel}>Status</span>
              </Col>
              <Col xs={22} className={styles.statusFilter}>
                <Form.Item name="status" className={styles.statusRow}>
                  <Checkbox.Group options={options} onChange={this.onChange} name={nameOpt}>
                    {/* <Checkbox value="Approved">Approved</Checkbox>
                    <Checkbox value="New">New</Checkbox>
                    <Checkbox value="Rejected">Rejected</Checkbox>
                    <Checkbox value="Waiting for approve">Waiting for approve</Checkbox> */}
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
