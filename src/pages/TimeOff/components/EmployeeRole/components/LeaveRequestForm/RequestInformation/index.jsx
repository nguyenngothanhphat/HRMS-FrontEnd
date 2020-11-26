import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form } from 'antd';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

class RequestInformation extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = (values) => {
    // eslint-disable-next-line no-alert
    alert('Finish');
    // eslint-disable-next-line no-console
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-alert
    alert('Finish Fail');
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  saveDraft = () => {
    // eslint-disable-next-line no-alert
    alert('Save Draft');
  };

  render() {
    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 10,
      },
    };

    const dataTimeOffTypes = [
      {
        name: 'Casual Leave',
        shortName: 'CL',
        remaining: 7,
        total: 10,
      },
      {
        name: 'Sick Leave',
        shortName: 'SL',
        remaining: 7,
        total: 10,
      },
      {
        name: 'Compensation Leave',
        shortName: 'CO',
        remaining: 7,
        total: 10,
      },
    ];
    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span>Timeoff</span>
        </div>
        <Form
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...layout}
          name="basic"
          ref={this.formRef}
          id="myForm"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          className={styles.form}
        >
          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Select Timeoff Type</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="timeOffType"
                rules={[
                  {
                    required: true,
                    message: 'Please select Timeoff Type!',
                  },
                ]}
              >
                <Select placeholder="Timeoff Type">
                  {dataTimeOffTypes.map((value) => {
                    const { name = '', shortName = '', remaining = 0, total = 0 } = value;
                    return (
                      <Option value={name}>
                        <Row className={styles.timeOffTypeOptions}>
                          <div className={styles.name}>{`${name} (${shortName})`}</div>
                          <div className={styles.days}>
                            <span>{remaining}</span>
                            <span className={styles.total}>/{total} days</span>
                          </div>
                        </Row>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Subject</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject"
                rules={[
                  {
                    required: true,
                    message: 'Please input subject!',
                  },
                ]}
              >
                <Input placeholder="Enter Subject" />
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>
          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Duration</span>
            </Col>
            <Col span={12}>
              <Row gutter={['20', '0']}>
                <Col span={12}>
                  <Form.Item
                    name="durationFrom"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a date!',
                      },
                    ]}
                  >
                    <DatePicker placeholder="From Date" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="durationTo"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a date!',
                      },
                    ]}
                  >
                    <DatePicker placeholder="To Date" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6} />
          </Row>
          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Description</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Please input description!',
                  },
                ]}
              >
                <TextArea placeholder="The reason I am taking timeoff is …" />
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>CC (only if you want to notify other than HR & your manager)</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="personCC"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select placeholder="Search a person you want to loop">
                  <Option value="Person 1">Person 1</Option>
                  <Option value="Person 2">Person 2</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>
        </Form>
        <div className={styles.footer}>
          <span className={styles.note}>
            By default notifications will be sent to HR, your manager and recursively loop to your
            department head.
          </span>
          <div className={styles.formButtons}>
            <Button type="link" htmlType="button" onClick={this.saveDraft}>
              Save to Draft
            </Button>
            <Button key="submit" type="primary" form="myForm" htmlType="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestInformation;
