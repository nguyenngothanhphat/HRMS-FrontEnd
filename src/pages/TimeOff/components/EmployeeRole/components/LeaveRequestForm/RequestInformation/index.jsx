import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form } from 'antd';
import RedCautionIcon from '@/assets/redcaution.svg';
import { connect } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
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
      selectedShortType: '',
      showSuccessModal: false,
      secondNotice: '',
      durationFrom: '',
    };
  }

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
    });
    dispatch({
      type: 'timeOff/fetchTimeOffTypes',
    });
  };

  // SHOW ABOVE NOTICE (BESIDE SELECT TIMEOFF TYPE FIELD)
  setSelectedShortType = (shortType) => {
    this.setState({
      selectedShortType: shortType,
    });
    this.setSecondNotice(`${shortType}s are covered under Standard Policy`);
  };

  // SHOW BELOW NOTICE (BESIDE DURATION FIELD)
  setSecondNotice = (value) => {
    this.setState({
      secondNotice: value,
    });
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
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

  // CHECK DAY ORDER
  checkDayOrder = (rule, value, callback) => {
    const { durationFrom } = this.state;
    const checkDayOrder = moment(value).isAfter(durationFrom);
    if (!checkDayOrder) {
      callback('To Date must be after From Date!');
    } else {
      callback();
    }
  };

  // ON SAVE DRAFT CLICKED
  saveDraft = () => {
    // eslint-disable-next-line no-alert
    alert('Save Draft');
  };

  // HOVER ON EACH OPTION IN SELECT
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

  // RENDER SELECT BOX
  // GET DATA FOR SELECT BOX
  renderTimeOffTypes = (data) => {
    return data.map((type) => {
      const {
        currentAllowance = 0,
        defaultSettings: { name = '', shortType = '', baseAccrual: { time = 0 } = {} } = {},
      } = type;
      return {
        name,
        shortName: shortType,
        remaining: currentAllowance,
        total: time,
      };
    });
  };

  // TYPE A: PAID LEAVES & UNPAID LEAVES
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
        <Option value={name}>
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

  // TYPE C: SPECIAL LEAVES
  renderType2 = (data) => {
    return data.map((value) => {
      const { name = '', shortName = '', total = 0 } = value;
      return (
        <Option value={name}>
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

  // TYPE D: WORKING OUT OF OFFICE
  renderType3 = (data) => {
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

  getSelectedType = () => {
    const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    const { selectedShortType } = this.state;
    let selectedType = '';
    timeOffTypes.forEach((value) => {
      if (value.shortType === selectedShortType) {
        selectedType = value.name;
      }
      return null;
    });
    return selectedType;
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

    const { selectedShortType, showSuccessModal, secondNotice } = this.state;

    const {
      timeOff: { totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {} } = {},
    } = this.props;
    const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;
    const { timeOffTypes: typesOfSpecialLeaves = [] } = specialLeaves;

    const dataTimeOffTypes1 = this.renderTimeOffTypes(typesOfCommonLeaves);
    const dataTimeOffTypes2 = this.renderTimeOffTypes(typesOfSpecialLeaves);

    // SET VALUE FOR THE ABOVE NOTICE
    const selectedType = this.getSelectedType();

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
                  onChange={(value) => this.setSelectedShortType(value)}
                  placeholder="Timeoff Type"
                >
                  {this.renderType1(dataTimeOffTypes1)}
                  {this.renderType2(dataTimeOffTypes2)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              {selectedShortType !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {selectedShortType}s are covered under{' '}
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
                    <DatePicker
                      onChange={(value) => {
                        this.setState({
                          durationFrom: value,
                        });
                      }}
                      placeholder="From Date"
                    />
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
                      { validator: this.checkDayOrder },
                    ]}
                  >
                    <DatePicker placeholder="To Date" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              {secondNotice !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>{secondNotice}</span>
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
        <TimeOffModal
          visible={showSuccessModal}
          onClose={this.setShowSuccessModal}
          content={`${selectedType} request submitted to the HR and your manager.`}
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
