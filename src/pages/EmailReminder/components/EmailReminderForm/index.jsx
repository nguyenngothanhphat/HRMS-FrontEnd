/* eslint-disable no-plusplus */
/* eslint-disable react/sort-comp */
/* eslint-disable no-bitwise */
import React, { PureComponent } from 'react';
import { Link, history, formatMessage, connect } from 'umi';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox } from 'antd';
import ReactQuill, { Quill } from 'react-quill';
import QuillMention from 'quill-mention';
import 'react-quill/dist/quill.snow.css';

import removeIcon from './assets/removeIcon.svg';

import styles from './index.less';

Quill.register('modules/mentions', QuillMention);

const atValues = [
  { id: 1, value: '@name' },
  { id: 2, value: '@Terralogic' },
];
const hashValues = [
  { id: 3, value: '385 Cong Hoa' },
  { id: 4, value: 'Tan Binh TP HCM' },
];

@connect(
  ({
    employeeSetting: {
      triggerEventList = [],
      departmentList = [],
      locationList = [],
      titleList = [],
      employeeTypeList = [],
      departmentListByCompanyId = [],
    } = {},
    user: { currentUser: { company: { _id = '' } = {} } = {} } = {},
  }) => ({
    triggerEventList,
    locationList,
    departmentList,
    titleList,
    employeeTypeList,
    departmentListByCompanyId,
    _id,
  }),
)
class EmailReminderForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      conditionsData: [
        {
          id: 0,
          key: '',
          tobeVerb: '',
          department: '',
        },
      ],
      appliesToData: '',
      message: '',
      frequencyItem: [
        {
          name: 'Premium only',
          value: 'Premium only',
        },
        {
          name: 'Every year',
          value: 'Every year',
        },
      ],
      sendingDate: [
        {
          name: 'On the event date',
          value: 'On the event date',
        },
        {
          name: 'Specific number of days before or after the event',
          value: 'Specific number of days before or after the event',
        },
      ],
      applyTo: [
        {
          name: 'Any Person',
          value: 'any',
        },
        {
          name: 'Create a condition',
          value: 'condition',
        },
      ],
      sendToWorker: [
        {
          name: 'Yes, send this email to all current workers ',
          value: 'Yes, send this email to all current workers ',
        },
      ],
      receipients: [],
      conditionsTrigger: {
        units: [
          {
            name: 'Department',
            value: 'Department',
          },
          {
            name: 'Location',
            value: 'Location',
          },
          {
            name: 'Employment type',
            value: 'Employment type',
          },
          {
            name: 'Title',
            value: 'Title',
          },
          {
            name: 'Salary',
            value: 'Salary',
          },
        ],
        toBeVerbs: [
          {
            name: 'is',
            value: 'is',
          },
          {
            name: 'is in',
            value: 'is in',
          },
        ],
        departments: [],
      },
      conditions: [
        {
          key: '',
          value: '',
        },
      ],
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeSetting/fetchTriggerEventList',
      payload: {},
    });
  };

  handleChangeApply = (value) => {
    const { dispatch, _id, departmentListByCompanyId } = this.props;
    const { receipients } = this.state;

    this.setState({
      appliesToData: value,
    });

    if (value === 'any') {
      dispatch({
        type: 'employeeSetting/fetchDepartmentListByCompanyId',
        payload: {
          company: _id,
        },
      }).then((data) => {
        this.setState({
          receipients: data,
        });
      });
    }
  };

  handleChangeEmail = (value) => {
    this.setState({
      message: value,
    });
  };

  onChangeCondition = (index, name, value) => {
    const { conditionsData, conditionsTrigger, conditions } = this.state;
    const { dispatch } = this.props;

    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];

    if (name === 'key') {
      if (value === 'Department') {
        dispatch({
          type: 'employeeSetting/fetchDepartmentList',
          payload: {},
        }).then((data) => {
          this.setState((prevState) => ({
            conditionsTrigger: {
              ...prevState.conditionsTrigger,
              departments: data,
            },
          }));
        });
      } else if (value === 'Location') {
        dispatch({
          type: 'employeeSetting/fetchLocationList',
          payload: {},
        }).then((data) => {
          this.setState((prevState) => ({
            conditionsTrigger: {
              ...prevState.conditionsTrigger,
              departments: data,
            },
          }));
        });
      } else if (value === 'Title') {
        dispatch({
          type: 'employeeSetting/fetchTitleList',
          payload: {},
        }).then((data) => {
          this.setState((prevState) => ({
            conditionsTrigger: {
              ...prevState.conditionsTrigger,
              departments: data,
            },
          }));
        });
      } else {
        dispatch({
          type: 'employeeSetting/fetchEmployeeTypeList',
          payload: {},
        }).then((data) => {
          this.setState((prevState) => ({
            conditionsTrigger: {
              ...prevState.conditionsTrigger,
              departments: data,
            },
          }));
        });
      }
      newConditions[index][name] = value;
    }
    if (name === 'value') {
      newConditions[index][name] = value;
    }

    newConditionsData[index][name] = value;

    this.setState({
      conditionsData: newConditionsData,
      conditions: newConditions,
    });
  };

  onRemoveCondition = (index) => {
    const { conditionsData, conditions } = this.state;
    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];

    newConditionsData.splice(index, 1);
    newConditions.splice(index, 1);

    this.setState({
      conditionsData: newConditionsData,
      conditions: newConditions,
    });
  };

  onAddCondition = () => {
    const { conditionsData, conditions } = this.state;
    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];

    const newCondition = { id: conditionsData.length, key: '', tobeVerb: '', value: '' };
    const condition = {
      key: '',
      value: '',
    };

    newConditionsData.push(newCondition);
    newConditions.push(condition);

    this.setState({
      conditionsData: newConditionsData,
      conditions: newConditions,
    });
  };

  onFinish = (values) => {
    const { triggerEventList } = this.props;
    const { message = '', appliesToData, conditions = [] } = this.state;
    let payload = {};

    const newValue = { ...values };
    const triggerEventValue = values.triggerEvent;
    const triggerEvent = triggerEventList.filter((item) => item.value === triggerEventValue)[0];
    newValue.triggerEvent = triggerEvent;
    const sendingDate = 'sendingDate';

    if (appliesToData === 'any') {
      payload = { ...newValue, sendingDate, appliesToData, message };
    }
    if (appliesToData === 'condition') {
      payload = { ...newValue, sendingDate, conditions, message };
    }

    console.log('Success:', payload);
  };

  _renderConditions = () => {
    const { Option } = Select;
    const {
      conditionsData,
      conditionsTrigger: { units = [], toBeVerbs = [], departments = [] },
    } = this.state;
    return (
      <Col span={24}>
        <Form.Item label="Conditions: Trigger for someone if">
          {conditionsData.map((data, index) => {
            return (
              <Row gutter={[24, 12]} align="middle" key={data.id}>
                {/* Units  */}
                <Col span={9}>
                  <Select
                    size="large"
                    value={data.key}
                    placeholder="Please select a choice"
                    onChange={(value) => this.onChangeCondition(index, 'key', value)}
                  >
                    {units.map((unit) => {
                      return <Option value={unit.value}>{unit.name}</Option>;
                    })}
                  </Select>
                </Col>

                {/* To be verbs  */}
                <Col span={4}>
                  <Select
                    size="large"
                    value={data.toBeVerb}
                    placeholder="Please select a choice"
                    onChange={(value) => this.onChangeCondition(index, 'tobeVerb', value)}
                  >
                    {toBeVerbs.map((toBeVerb) => {
                      return <Option value={toBeVerb.value}>{toBeVerb.name}</Option>;
                    })}
                  </Select>
                </Col>

                {/* Departments  */}
                <Col span={10}>
                  <Select
                    size="large"
                    value={data.value}
                    placeholder="Please select a choice"
                    onChange={(value) => this.onChangeCondition(index, 'value', value)}
                  >
                    {departments.map((department, index) => {
                      return (
                        <Option value={department.id} key={index}>
                          {department.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
                <Col span={1}>
                  <img
                    onClick={() => this.onRemoveCondition(index)}
                    src={removeIcon}
                    alt="remove"
                  />
                </Col>
              </Row>
            );
          })}
        </Form.Item>
        <div className={styles.addNewButton}>
          <Button onClick={this.onAddCondition}>
            {formatMessage({ id: 'component.emailReminderForm.addCondition' })}
          </Button>
        </div>
      </Col>
    );
  };

  back = () => {
    history.goBack();
  };

  onChangeAnyPerson = (value) => {
    console.log('Department list by company: ');
  };

  _renderApplyToOptions = () => {
    const { Option } = Select;
    const { appliesToData, receipients } = this.state;
    if (appliesToData === 'any') {
      return (
        // Receipients
        <>
          <Col span={12}>
            <Form.Item label="Receipients" name="receipients">
              <Select
                size="large"
                placeholder="Please select a choice"
              >
                {receipients.map((option, index) => {
                  return (
                    <Option value={option.value} key={index}>
                      {option.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} />
        </>
      );
    }
    if (appliesToData === 'condition') {
      return this._renderConditions();
    }
    return null;
  };

  mentionModule = {
    allowedChars: /^[A-Za-z\s]*$/,
    mentionDenotationChars: ['_', '#'],
    showDenotationChar: false,
    renderItem: (item) => {
      return item.value;
    },
    source(searchTerm, renderList, mentionChar) {
      let values;

      if (mentionChar === '_') {
        values = atValues;
      } else {
        values = hashValues;
      }

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i++)
          if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
            matches.push(values[i]);
        renderList(matches, searchTerm);
      }
    },
  };

  _renderForm = () => {
    const { Option } = Select;
    const { triggerEventList } = this.props;
    const {
      frequencyItem,
      sendingDate,
      applyTo,
      sendToWorker,
      message,
    } = this.state;
    return (
      <Form onFinish={this.onFinish}>
        <Row gutter={[36, 24]}>
          {/* Trigger Event */}
          <Col span={12}>
            <Form.Item label="Trigger event" name="triggerEvent">
              <Select size="large" placeholder="Please select a choice">
                {triggerEventList.map((option) => {
                  return <Option value={option.value}>{option.name}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <div className={styles.note}>
              <span>
                {formatMessage({ id: 'component.emailReminderForm.triggerNote' })}{' '}
                <a href="#">
                  {' '}
                  {formatMessage({ id: 'component.emailReminderForm.triggerNoteLink' })}
                </a>
              </span>
            </div>
          </Col>

          {/* Frequency */}
          <Col span={24}>
            <Form.Item name="frequency" label="Frequency">
              <Radio.Group>
                {frequencyItem.map((option) => {
                  return <Radio value={option.value}>{option.name}</Radio>;
                })}
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* Sending date */}
          <Col span={24}>
            <Form.Item name="sendingDate" label="Sending date">
              <Radio.Group>
                {sendingDate.map((option) => {
                  return <Radio value={option.value}>{option.name}</Radio>;
                })}
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* Applies to */}
          <Col span={12}>
            <Form.Item name="applyTo" label="Applies to">
              <Select
                size="large"
                placeholder="Please select a choice"
                onChange={this.handleChangeApply}
              >
                {applyTo.map((option) => {
                  return <Option value={option.value}>{option.name}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12} />

          {this._renderApplyToOptions()}

          {/* Send to existing workers */}
          <Col span={12}>
            <Form.Item name="sendToWorker" label="Send to existing workers">
              <Checkbox.Group>
                {sendToWorker.map((option) => {
                  return <Checkbox value={option.value}>{option.name}</Checkbox>;
                })}
              </Checkbox.Group>
            </Form.Item>
          </Col>

          {/* Email subject */}
          <Col span={24}>
            <Form.Item name="subject" label="Email subject">
              <Input placeholder="Eg:  Welcome to the company" />
            </Form.Item>
          </Col>

          {/* Email message */}
          <Col span={24}>
            {/* <Form.Item name="message" label="Email message"> */}
            <p className={styles.label}>Email message :</p>
            <ReactQuill
              className={styles.quill}
              value={message}
              onChange={this.handleChangeEmail}
              modules={{ mention: this.mentionModule }}
            />
            {/* </Form.Item> */}
          </Col>

          <Col className={styles.buttons} span={8} offset={16}>
            <Link
              to={{
                pathname: '/employee-onboarding',
                state: { defaultActiveKey: '2' },
              }}
            >
              <Button type="secondary">
                {' '}
                {formatMessage({ id: 'component.emailReminderForm.cancel' })}
              </Button>
            </Link>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'component.emailReminderForm.submit' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <div className={styles.EmailReminderForm}>
        <div className={styles.EmailReminderForm_title}>
          {formatMessage({ id: 'component.emailReminderForm.title' })}
          <hr />
        </div>
        <div className={styles.EmailReminderForm_form}>{this._renderForm()}</div>
      </div>
    );
  }
}

export default EmailReminderForm;
