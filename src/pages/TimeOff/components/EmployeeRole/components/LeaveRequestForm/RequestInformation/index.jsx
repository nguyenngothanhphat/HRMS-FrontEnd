import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form } from 'antd';
import RedCautionIcon from '@/assets/redcaution.svg';
import { connect } from 'umi';
import SuccessModal from '../SuccessModal';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

@connect(({ timeOff }) => ({
  timeOff,
}))
class RequestInformation extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedType: '',
      showSuccessModal: false,
    };
  }

  setSelectedType = (type) => {
    this.setState({
      selectedType: type,
    });
  };

  setShowSuccessModal = (value) => {
    this.setState({
      showSuccessModal: value,
    });
  };

  onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
    this.setShowSuccessModal(true);
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  saveDraft = () => {
    // eslint-disable-next-line no-alert
    alert('Save Draft');
  };

  // hover content
  content = () => (
    <span
      // style={{
      //   position: 'absolute',
      //   top: 0,
      //   right: 0,
      //   display: 'flex',
      //   background: '#FFFFFF',
      //   boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
      //   borderRadius: '4px',
      //   width: '200px',
      //   overflow: 'auto',
      // }}
      className={styles.runOutOfRemainingDayNotice}
    >
      <img src={RedCautionIcon} alt="caution-icon" />
      <p>
        You cannot apply for this leave.
        {/* You have exhausted all your {name} ({shortName} */}
        s).
      </p>
    </span>
  );

  // render select options
  renderType1 = (data) => {
    return data.map((value) => {
      const { name = '', shortName = '', remaining = 0, total = 0 } = value;
      const defaultCss = {
        fontSize: 12,
        color: '#6f7076',
        fontWeight: 'bold',
      };
      const invalidCss = {
        fontSize: 12,
        color: '#FD4546',
        fontWeight: 'bold',
      };
      return (
        <Option value={shortName}>
          <div className={styles.timeOffTypeOptions}>
            {/* I don't knew why I could not CSS this block in styles.less file
          So I tried inline CSS. 
          Amazing! It worked :D. (Tuan - Lewis Nguyen) */}
            <>
              <span style={{ fontSize: 13 }} className={styles.name}>
                {`${name} (${shortName})`}
              </span>
              <span
                className={styles.days}
                style={{
                  float: 'right',
                }}
              >
                <span style={remaining === 0 ? invalidCss : defaultCss} className={styles.totals}>
                  <span style={remaining === 0 ? { color: '#FD4546' } : { color: 'black' }}>
                    {remaining}
                  </span>
                  /{total} days
                </span>
              </span>
            </>
          </div>
        </Option>
      );
    });
  };

  renderType2 = (data) => {
    return data.map((value) => {
      const { name = '', shortName = '', total = 0 } = value;
      return (
        <Option value={shortName}>
          <div className={styles.timeOffTypeOptions}>
            <span style={{ fontSize: 13 }} className={styles.name}>
              {`${name} (${shortName})`}
            </span>
            <span style={{ float: 'right', fontSize: 12, fontWeight: 'bold' }}>{total} days</span>
          </div>
        </Option>
      );
    });
  };

  render() {
    const { selectedType, showSuccessModal } = this.state;

    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 10,
      },
    };

    const dataTimeOffTypes1 = [
      {
        name: 'Casual Leave',
        shortName: 'CL',
        remaining: 0,
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
    const dataTimeOffTypes2 = [
      {
        name: 'Maternity Leave',
        shortName: 'ML',
        total: 30,
      },
      {
        name: 'Bereavement Leave',
        shortName: 'BL',
        total: 7,
      },
      {
        name: 'Restricted Holiday',
        shortName: 'RH',
        total: 1,
      },
    ];

    let selectedTypeName = '';
    dataTimeOffTypes1.forEach((value) => {
      if (value.shortName === selectedType) {
        selectedTypeName = value.name;
      }
      return null;
    });
    dataTimeOffTypes2.forEach((value) => {
      if (value.shortName === selectedType) {
        selectedTypeName = value.name;
      }
      return null;
    });

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
                <Select
                  onChange={(value) => this.setSelectedType(value)}
                  placeholder="Timeoff Type"
                >
                  {this.renderType1(dataTimeOffTypes1)}
                  {this.renderType2(dataTimeOffTypes2)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              {selectedType !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {selectedType}s are covered under{' '}
                    <span className={styles.link}>Standard Policy</span>
                  </span>
                </div>
              )}
            </Col>
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
            <Col span={6}>
              {selectedType !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {selectedTypeName}s gets credited each month.
                  </span>
                </div>
              )}
            </Col>
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
                  <Option value="Person 1">
                    <span style={{ fontSize: 13 }}>Person 1</span>
                  </Option>
                  <Option value="Person 2">
                    <span style={{ fontSize: 13 }}>Person 2</span>
                  </Option>
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
        <SuccessModal visible={showSuccessModal} onClose={this.setShowSuccessModal} />
      </div>
    );
  }
}

export default RequestInformation;
