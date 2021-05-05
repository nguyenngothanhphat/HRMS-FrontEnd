/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { Checkbox, Form, Input, Row, Col, DatePicker } from 'antd';
import throttle from 'lodash/throttle';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
@connect(({ candidateInfo }) => ({
  candidateInfo,
}))
class EmployerComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      checkedList: [],
      employerName: '',
      workDuration: '',
    };
    this.handleInputThrottled = throttle(this.handleInputThrottled, 2000);
  }

  componentDidMount = () => {
    const { checkedList = [], employerName = '' } = this.props;
    this.setState({
      checkedList,
      employerName,
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

  setWorkDuration = (workDuration) => {
    this.setState({
      workDuration,
    });
  };

  onChange = (list) => {
    this.setCheckedList(list);
    const { getDataFromFields = () => {}, orderNumber } = this.props;
    const { employerName, workDuration } = this.state;
    getDataFromFields(orderNumber, employerName, workDuration, list);
  };

  employerNameHandle = (event) => {
    const { value = '' } = event.target;
    this.setEmployerName(value);
    // this.throttled.current(value);
    this.handleInputThrottled(value);
  };

  workDurationHandle = (value) => {
    this.setWorkDuration(value);
    const { getDataFromFields = () => {}, orderNumber } = this.props;
    const { employerName, checkedList } = this.state;
    getDataFromFields(orderNumber, employerName, value, checkedList);
  };

  render() {
    const {
      checkBoxesData = [],
      orderNumber = 0,
      employerName: employerNameFromServer = '',
      workDuration = '',
      deleteComponent = () => {},
      processStatus = '',
      candidateInfo: { componentsNumberCount = [] } = {},
    } = this.props;
    const { checkedList } = this.state;

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
        <Form initialValues={{ employerName: employerNameFromServer, workDuration }}>
          <Row gutter={['20', '20']}>
            <Col span={12}>
              <Form.Item label="Name of the employer*" name="employerName">
                <Input
                  disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                  onChange={this.employerNameHandle}
                  className={styles.input}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Work Duration (In year, months, days)" name="workDuration">
                <DatePicker
                  // disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
                  disabled
                  onChange={this.workDurationHandle}
                  format="MM.DD.YY"
                />
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
              disabled={processStatus === 'SENT-PROVISIONAL-OFFER'}
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
