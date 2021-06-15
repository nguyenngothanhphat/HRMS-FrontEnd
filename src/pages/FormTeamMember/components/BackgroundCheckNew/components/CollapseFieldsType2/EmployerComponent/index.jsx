/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Checkbox, Form, Input, Row, Col, DatePicker } from 'antd';
import throttle from 'lodash/throttle';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class EmployerComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      checkedList: [],
      employerName: '',
      startDate: '',
      endDate: '',
      toPresent: false,
    };
    this.handleInputThrottled = throttle(this.handleInputThrottled, 2000);
  }

  componentDidMount = () => {
    const { checkedList = [], employerName = '', dispatch, workDuration = {} } = this.props;
    this.setState({
      checkedList,
      employerName,
    });
    if (employerName) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    }

    this.setState({
      toPresent: workDuration.toPresent,
      startDate: workDuration.startDate ? moment(workDuration.startDate) : '',
      endDate: workDuration.endDate ? moment(workDuration.endDate) : '',
    });
    this.formRef.current.setFieldsValue({
      toPresent: workDuration.toPresent,
      startDate: workDuration.startDate ? moment(workDuration.startDate) : null,
      endDate: workDuration.endDate ? moment(workDuration.endDate) : null,
    });
  };

  handleInputThrottled = (value) => {
    const { orderNumber, handleEmployerName = () => {} } = this.props;
    handleEmployerName(value, orderNumber);
  };

  setCheckedList = (list) => {
    this.setState({
      checkedList: list,
    });
  };

  setEmployerName = (name) => {
    this.setState({
      employerName: name,
    });
  };

  onChange = (list) => {
    this.setCheckedList(list);
    const { getDataFromFields = () => {}, orderNumber } = this.props;
    const { employerName, startDate, endDate, toPresent } = this.state;
    const workDuration = {
      startDate,
      endDate,
      toPresent,
    };
    getDataFromFields(orderNumber, employerName, workDuration, list);
  };

  employerNameHandle = (event) => {
    const { value = '' } = event.target;
    this.setEmployerName(value);
    // this.throttled.current(value);
    this.handleInputThrottled(value);
  };

  workDurationHandle = (value, index) => {
    const { workDuration: workDurationProps = {} } = this.props;

    this.setState({
      [index]: value,
    });
    const now = moment();

    if (index === 'toPresent') {
      this.setState({
        endDate: now,
      });
      this.formRef.current.setFieldsValue({
        endDate: now,
      });
    }

    const { getDataFromFields = () => {}, orderNumber } = this.props;
    const { employerName, checkedList, startDate, endDate, toPresent } = this.state;
    const workDuration = {
      startDate: index === 'startDate' ? value : startDate || moment(workDurationProps.startDate),
      endDate:
        index === 'endDate'
          ? value
          : index === 'toPresent'
          ? now
          : endDate || moment(workDurationProps.endDate),
      toPresent: index === 'toPresent' ? value : toPresent || workDurationProps.toPresent,
    };

    getDataFromFields(orderNumber, employerName, workDuration, checkedList);
  };

  render() {
    const {
      checkBoxesData = [],
      orderNumber = 0,
      employerName: employerNameFromServer = '',
      deleteComponent = () => {},
      // processStatus = '',
      candidateInfo: { componentsNumberCount = [] } = {},
      disabled = false,
      workDuration = {},
    } = this.props;
    const { checkedList, toPresent } = this.state;

    return (
      <div className={styles.EmployerComponent}>
        <div className={styles.titleBar}>
          <span className={styles.title}>Employer {orderNumber} Details</span>
          <CloseOutlined
            style={componentsNumberCount.length === 1 ? { display: 'none' } : { display: 'block' }}
            className={styles.deleteIcon}
            onClick={() => deleteComponent(orderNumber)}
          />
        </div>
        <Form
          ref={this.formRef}
          initialValues={{
            employerName: employerNameFromServer,
            startDate: workDuration.startDate ? moment(workDuration.startDate) : '',
            endDate: workDuration.endDate ? moment(workDuration.endDate) : '',
          }}
        >
          <Row gutter={['20', '20']}>
            <Col span={10}>
              <Form.Item label="Name of the employer*" name="employerName">
                <Input
                  disabled={disabled}
                  onChange={this.employerNameHandle}
                  className={styles.input}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="Start Date" name="startDate">
                <DatePicker
                  // disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                  // disabled
                  placeholder="Start Date"
                  onChange={(value) => this.workDurationHandle(value, 'startDate')}
                  format="MM.DD.YY"
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="End Date" name="endDate">
                <DatePicker
                  // disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                  disabled={toPresent}
                  placeholder="End Date"
                  onChange={(value) => this.workDurationHandle(value, 'endDate')}
                  format="MM.DD.YY"
                />
              </Form.Item>
              <Form.Item name="toPresent">
                <Checkbox
                  defaultChecked={workDuration.toPresent}
                  onChange={({ target: { checked = false } = {} }) =>
                    this.workDurationHandle(checked, 'toPresent')}
                >
                  To Present
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={['20', '20']}>
          <Col span={24}>
            <span className={styles.title2}>Proof of employment</span>
            <CheckboxGroup
              onChange={this.onChange}
              // options={checkBoxesData.map((data) => data.alias)}
              value={checkedList}
              disabled={disabled}
              className={styles.checkBoxesGroup}
            >
              {checkBoxesData.map((data) => (
                <Checkbox
                  disabled={data.alias.substr(data.alias.length - 1) === '*'}
                  value={data.alias}
                >
                  {data.alias}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EmployerComponent;
