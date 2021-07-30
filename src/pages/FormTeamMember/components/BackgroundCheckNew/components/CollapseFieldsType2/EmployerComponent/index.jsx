/* eslint-disable no-nested-ternary */
import { CloseOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import throttle from 'lodash/throttle';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
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
    };
    this.handleInputThrottled = throttle(this.handleInputThrottled, 2000);
  }

  componentDidMount = () => {
    const { checkedList = [], employerName = '', dispatch } = this.props;

    if (employerName) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    }

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

  onChange = (list) => {
    this.setCheckedList(list);
    const { getDataFromFields = () => {}, orderNumber } = this.props;
    const { employerName } = this.state;
    getDataFromFields(orderNumber, employerName, list);
  };

  employerNameHandle = (event) => {
    const { value = '' } = event.target;
    this.setEmployerName(value);
    // this.throttled.current(value);
    this.handleInputThrottled(value);
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
      // workDuration = {},
    } = this.props;
    const { checkedList } = this.state;

    return (
      <div className={styles.EmployerComponent}>
        <div className={styles.titleBar}>
          <span className={styles.title}>Employer {orderNumber} Details</span>
          {!disabled && (
            <CloseOutlined
              style={
                componentsNumberCount.length === 1 ? { display: 'none' } : { display: 'block' }
              }
              className={styles.deleteIcon}
              onClick={() => deleteComponent(orderNumber)}
            />
          )}
        </div>
        <Form
          ref={this.formRef}
          initialValues={{
            employerName: employerNameFromServer,
            // startDate: workDuration.startDate ? moment(workDuration.startDate) : '',
            // endDate: workDuration.endDate ? moment(workDuration.endDate) : '',
          }}
        >
          <Row gutter={['20', '20']}>
            <Col span={24}>
              <Form.Item label="Name of the employer*" name="employerName">
                <Input
                  disabled={disabled}
                  onChange={this.employerNameHandle}
                  className={styles.input}
                  placeholder="Name of the employer"
                />
              </Form.Item>
            </Col>
            {/* {disabled && (
              <>
                <Col span={24}>
                  <Form.Item name="toPresent">
                    <Checkbox defaultChecked={workDuration.toPresent} disabled>
                      Currently work
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Start Date" name="startDate">
                    <DatePicker disabled placeholder="Start Date" format="MM.DD.YY" />
                  </Form.Item>
                </Col>
                {!workDuration.toPresent && (
                  <Col span={12}>
                    <Form.Item label="End Date" name="endDate">
                      <DatePicker disabled placeholder="End Date" format="MM.DD.YY" />
                    </Form.Item>
                  </Col>
                )}
              </>
            )} */}
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
