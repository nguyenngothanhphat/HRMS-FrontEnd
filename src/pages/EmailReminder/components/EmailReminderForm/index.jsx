/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable react/sort-comp */
/* eslint-disable no-bitwise */
import React, { PureComponent } from 'react';
import { Link, history, formatMessage, connect } from 'umi';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import ReactQuill, { Quill } from 'react-quill';
import QuillMention from 'quill-mention';
import 'react-quill/dist/quill.snow.css';

import removeIcon from './assets/removeIcon.svg';

import styles from './index.less';

Quill.register('modules/mentions', QuillMention);
@connect(
  ({
    employeeSetting: {
      triggerEventList = [],
      departmentList = [],
      locationList = [],
      titleList = [],
      employeeTypeList = [],
      departmentListByCompanyId = [],
      listAutoField = [],
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
    listAutoField,
  }),
)
class EmailReminderForm extends PureComponent {
  constructor(props) {
    super(props);
    this.modules = { mention: this.mentionModule(this) };

    this.state = {
      conditionsData: [
        {
          id: 0,
          key: '',
          tobeVerb: '',
          value: [],
        },
      ],
      checkOption: [],
      appliesToData: '',
      message: '',
      // frequencyItem: [
      //   {
      //     name: 'Premium only',
      //     value: 'Premium only',
      //   },
      //   {
      //     name: 'Every year',
      //     value: 'Every year',
      //   },
      // ],
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
      sendToExistingWorker: false,
      recipients: [],
      conditionsTrigger: {
        units: [
          {
            name: 'Department',
            value: 'department',
          },
          {
            name: 'Location',
            value: 'location',
          },
          {
            name: 'Employment type',
            value: 'employment_type',
          },
          {
            name: 'Title',
            value: 'title',
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
          value: [],
        },
      ],
      disabled: true,
      triggerEvent: '',
      _sendingDate: '',
      recipient: '',
      emailSubject: '',
    };
  }

  checkFields = () => {
    const { conditionsData } = this.state;

    let key = '';
    let tobeVerb = '';
    let value = '';

    conditionsData.map((item) => {
      key = item.key;
      tobeVerb = item.tobeVerb;
      value = item.value;
      return item;
    });

    const {
      triggerEvent,
      _sendingDate,
      appliesToData,
      recipient,
      emailSubject,
      message,
    } = this.state;

    if (
      triggerEvent.trim() !== '' &&
      _sendingDate.trim() !== '' &&
      emailSubject.trim() !== '' &&
      message.trim() !== '' &&
      message.trim() !== '<p></p>' &&
      message.trim() !== '<p><br></p>'
    ) {
      if (appliesToData.trim() === 'any' && recipient.trim() !== '') {
        this.setState({ disabled: false });
      } else if (
        appliesToData.trim() === 'condition' &&
        key.trim() !== '' &&
        tobeVerb.trim() !== '' &&
        value.length !== 0
      ) {
        this.setState({ disabled: false });

        if (value[1] !== '') {
          this.setState({ disabled: false });
        } else {
          this.setState({ disabled: true });
        }
      } else {
        this.setState({ disabled: true });
      }
    } else {
      this.setState({ disabled: true });
    }
  };

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeSetting/fetchTriggerEventList',
      payload: {},
    });
    dispatch({
      type: 'employeeSetting/fetchListAutoField',
      payload: {},
    });
  };

  handleChangeApply = (value) => {
    const { dispatch, _id } = this.props;

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
          recipients: data,
        });
      });
    }
  };

  handleChangeEmail = (value) => {
    this.setState({
      message: value,
    });
  };

  onChangeTriggerEvent = (value) => {
    this.setState({ triggerEvent: value });
  };

  onChangeSendingDate = (value) => {
    this.setState({ _sendingDate: value.target.value });
  };

  onChangeRecipients = (value) => {
    this.setState({ recipient: value });
  };

  onChangeEmailSubject = (value) => {
    this.setState({ emailSubject: value });
  };

  onChangeCondition = (index, name, value) => {
    const { conditionsData, conditions } = this.state;
    const { dispatch } = this.props;

    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];

    if (name === 'key') {
      if (value === 'department') {
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
      } else if (value === 'location') {
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
      } else if (value === 'title') {
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

    console.log('newConditionsData:', newConditionsData);
    console.log('newConditions:', newConditions);

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

    newConditionsData.forEach((item, itemIndex) => {
      item.id = itemIndex;
    });

    this.setState({
      conditionsData: newConditionsData,
      conditions: newConditions,
    });
  };

  checkOptionKey = (unitValue) => {
    const { checkOption } = this.state;
    let check = false;

    checkOption.forEach((option) => {
      if (option === unitValue) {
        check = true;
      }
    });

    return check;
  };

  onAddCondition = () => {
    const { conditionsData, conditions } = this.state;
    const newConditionsData = [...conditionsData];
    const checkData = [...conditionsData];
    const newConditions = [...conditions];
    const arrKey = [];

    if (checkData.length > 1) {
      checkData.splice(0, -1);
    }

    checkData.forEach((item) => {
      arrKey.push(item.key);
    });

    this.setState({ checkOption: arrKey });

    const newCondition = {
      id: conditionsData.length,
      key: '',
      tobeVerb: '',
      value: [],
    };
    const condition = {
      key: '',
      value: [],
    };

    newConditionsData.push(newCondition);
    newConditions.push(condition);

    this.setState({
      conditionsData: newConditionsData,
      conditions: newConditions,
    });
  };

  onFinish = (values) => {
    const { triggerEventList, dispatch } = this.props;
    const { message = '', appliesToData = '', conditions = [], sendToExistingWorker } = this.state;
    let dataSubmit = {};

    const newValue = { ...values };
    delete newValue.sendToWorker;
    delete newValue.frequency;

    const triggerEventValue = values.triggerEvent;
    const triggerEvent = triggerEventList.filter((item) => item.value === triggerEventValue)[0];
    newValue.triggerEvent = triggerEvent;

    if (appliesToData === 'any') {
      dataSubmit = { ...newValue, message, sendToExistingWorker };
    }
    if (appliesToData === 'condition') {
      dataSubmit = { ...newValue, conditions, message, sendToExistingWorker };
    }

    console.log('dataSubmit: ', dataSubmit);

    dispatch({
      type: 'employeeSetting/addCustomEmail',
      payload: dataSubmit,
    }).then((data) => {
      console.log('dataSubmit AFTER call api: ', data);
    });
  };

  tagRender = (props) => {
    const { label, onClose } = props;
    return (
      <Tag
        icon={<CloseCircleOutlined className={styles.iconClose} onClick={onClose} />}
        color="red"
      >
        {label}
      </Tag>
    );
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
              <div>
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
                        return (
                          <Option value={unit.value} disabled={this.checkOptionKey(unit.value)}>
                            {unit.name}
                          </Option>
                        );
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
                    <Row>
                      <Select
                        className={styles.departmentCondition}
                        size="large"
                        value={data.value}
                        tagRender={this.tagRender}
                        mode="multiple"
                        showArrow
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Please select a choice"
                        onChange={(value) => this.onChangeCondition(index, 'value', value)}
                      >
                        {departments.map((department) => {
                          return (
                            <Option value={department._id} key={department._id}>
                              {department.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Row>
                  </Col>
                  <Col span={1}>
                    <img
                      onClick={() => this.onRemoveCondition(index)}
                      src={removeIcon}
                      alt="remove"
                    />
                  </Col>
                </Row>
              </div>
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

  handleChangeChckBox = (value) => {
    const { target: { checked = '' } = {} } = value;
    this.setState({ sendToExistingWorker: checked });
  };

  _renderApplyToOptions = () => {
    const { Option } = Select;
    const { appliesToData, recipients } = this.state;
    if (appliesToData === 'any') {
      return (
        // recipients
        <>
          <Col span={12}>
            <Form.Item label="recipients" name="recipients">
              <Select
                size="large"
                placeholder="Please select a choice"
                onChange={(value) => {
                  this.onChangeRecipients(value);
                }}
              >
                {recipients.map((option) => {
                  return (
                    <Option value={option.value} key={option._id}>
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

  dataAutoField = () => {
    const { listAutoField } = this.props;
    return listAutoField;
  };

  mentionModule = (t) => {
    return {
      allowedChars: /^[A-Za-z\s]*$/,
      mentionDenotationChars: ['@'],
      showDenotationChar: false,
      renderItem: (item) => {
        return item.value;
      },
      source(searchTerm, renderList, mentionChar) {
        let values;
        const { listAutoField } = t.props;
        const list = listAutoField.map((item, index) => {
          return {
            id: index,
            value: item,
          };
        });
        if (mentionChar === '@') {
          values = list;
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
  };

  _renderForm = () => {
    const { Option } = Select;
    const { triggerEventList } = this.props;
    const { sendingDate, applyTo, sendToWorker, message, disabled } = this.state;

    return (
      <Form onFinish={this.onFinish}>
        <Row gutter={[36, 24]}>
          {/* Trigger Event */}
          <Col span={12}>
            <Form.Item label="Trigger event" name="triggerEvent">
              <Select
                size="large"
                placeholder="Please select a choice"
                onChange={(value) => this.onChangeTriggerEvent(value)}
              >
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
          {/* <Col span={24}>
            <Form.Item name="frequency" label="Frequency">
              <Radio.Group onChange={(value) => this.onChangeFrequency(value)}>
                {frequencyItem.map((option) => {
                  return <Radio value={option.value}>{option.name}</Radio>;
                })}
              </Radio.Group>
            </Form.Item>
          </Col> */}

          {/* Sending date */}
          <Col span={24}>
            <Form.Item name="sendingDate" label="Sending date">
              <Radio.Group onChange={(value) => this.onChangeSendingDate(value)}>
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
                placeholdementionModuler="Please select a choice"
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
                  return (
                    <Checkbox
                      value={option.value}
                      onChange={(value) => this.handleChangeChckBox(value)}
                    >
                      {option.name}
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
          </Col>

          {/* Email subject */}
          <Col span={24}>
            <Form.Item name="subject" label="Email subject">
              <Input
                placeholder="Eg:  Welcome to the company"
                onChange={(e) => this.onChangeEmailSubject(e.target.value)}
              />
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
              modules={this.modules}
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
              <Button type="primary" htmlType="submit" disabled={disabled}>
                {formatMessage({ id: 'component.emailReminderForm.submit' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    this.checkFields();
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
