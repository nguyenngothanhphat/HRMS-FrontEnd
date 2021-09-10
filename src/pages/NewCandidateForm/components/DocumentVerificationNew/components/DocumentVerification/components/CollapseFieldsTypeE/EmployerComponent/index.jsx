/* eslint-disable no-nested-ternary */
import { CloseOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import throttle from 'lodash/throttle';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
@connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))
class EmployerComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      checkedList: [],
    };
    this.handleInputThrottled = throttle(this.handleInputThrottled, 2000);
  }

  componentDidMount = () => {
    const { data = [], employer = '', dispatch } = this.props;

    if (employer) {
      dispatch({
        type: 'newCandidateForm/saveTemp',
        payload: {
          checkValidation: true,
        },
      });
    }

    let checkedList = data.filter((val) => val.alias && val.value === true);
    checkedList = checkedList.map((val) => val.alias);

    this.setState({
      checkedList,
    });
  };

  handleInputThrottled = (value) => {
    const { handleChange = () => {}, index } = this.props;
    handleChange(value, index);
  };

  setCheckedList = (list) => {
    this.setState({
      checkedList: list,
    });
  };

  onChange = (list, fieldToRender) => {
    const { handleCheck = () => {}, index } = this.props;
    this.setCheckedList(list);
    handleCheck(fieldToRender, list, index);
  };

  employerNameHandle = (event) => {
    const { value = '' } = event.target;
    this.handleInputThrottled(value);
  };

  render() {
    const {
      data = [],
      index = 0,
      employer = '',
      remove = () => {},
      // processStatus = '',
      disabled = false,
      listLength = 0,
      // workDuration = {},
    } = this.props;
    const { checkedList } = this.state;

    return (
      <div className={styles.EmployerComponent}>
        <div className={styles.titleBar}>
          <span className={styles.title}>Employer {index + 1} Details</span>
          {!disabled && (
            <CloseOutlined className={styles.deleteIcon} onClick={() => remove(index)} />
          )}
        </div>
        <Form
          ref={this.formRef}
          initialValues={{
            employer,
            // startDate: workDuration.startDate ? moment(workDuration.startDate) : '',
            // endDate: workDuration.endDate ? moment(workDuration.endDate) : '',
          }}
        >
          <Row gutter={[5, 0]}>
            <Col span={24}>
              <Form.Item label="Name of the employer*" name="employer">
                <Input
                  disabled={disabled}
                  onChange={this.employerNameHandle}
                  className={styles.input}
                  placeholder="Name of the employer"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={[5, 0]}>
          <Col span={24}>
            <div className={styles.title2}>Proof of employment</div>
            <CheckboxGroup
              onChange={(list) => this.onChange(list, data)}
              // options={data.map((data) => data.alias)}
              value={checkedList}
              disabled={disabled}
              className={styles.checkBoxesGroup}
            >
              {data.map((field) => (
                <Checkbox
                  disabled={field.alias.substr(field.alias.length - 1) === '*'}
                  value={field.alias}
                >
                  {field.alias}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </Col>
        </Row>

        {index + 1 <= listLength && !disabled && <hr className={styles.divider} />}
        {index + 1 < listLength && disabled && <hr className={styles.divider} />}
      </div>
    );
  }
}

export default EmployerComponent;
