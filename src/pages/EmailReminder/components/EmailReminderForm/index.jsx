/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable react/sort-comp */
/* eslint-disable no-bitwise */
import React, { PureComponent } from 'react';
import { Link, history, formatMessage, connect } from 'umi';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox } from 'antd';
import ReactQuill, { Quill } from 'react-quill';
import QuillMention from 'quill-mention';
import 'react-quill/dist/quill.snow.css';

import addIcon from '@/assets/add-symbols.svg';
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
          isChecked: false,
        },
      ],
      isLocation: false,
      checkOption: [],
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
      sendToExistingWorker: false,
      receipients: [],
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
      frequency: '',
      _sendingDate: '',
      receipient: '',
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
      frequency,
      _sendingDate,
      appliesToData,
      receipient,
      emailSubject,
      message,
    } = this.state;

    if (
      triggerEvent.trim() !== '' &&
      frequency.trim() !== '' &&
      _sendingDate.trim() !== '' &&
      emailSubject.trim() !== '' &&
      message.trim() !== '' &&
      message.trim() !== '<p></p>' &&
      message.trim() !== '<p><br></p>'
    ) {
      if (appliesToData.trim() === 'any' && receipient.trim() !== '') {
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

  onChangeTriggerEvent = (value) => {
    this.setState({ triggerEvent: value });
  };

  onChangeFrequency = (value) => {
    this.setState({ frequency: value.target.value });
  };

  onChangeSendingDate = (value) => {
    this.setState({ _sendingDate: value.target.value });
  };

  onChangeReceipients = (value) => {
    this.setState({ receipient: value });
  };

  onChangeEmailSubject = (value) => {
    this.setState({ emailSubject: value });
  };

  onChangeConditionLocation = (index, name, value) => {
    const { conditionsData, conditions } = this.state;

    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];

    const newArr = newConditionsData[index][name];
    const lastIndex = newArr.length - 1;

    newArr[lastIndex] = value;

    console.log('newArr[lastIndex] = value : ', newArr);
    console.log('index : ', index);

    // if (lastIndex === 2) {
    //   newConditionsData[index].isChecked = false;
    // }
    console.log('newConditionsData : ', newConditionsData);

    this.setState({
      conditionsData: newConditionsData,
      conditions: newConditions,
    });
  };

  onChangeCondition = (index, name, value) => {
    const { conditionsData, conditions, isLocation } = this.state;
    const { dispatch } = this.props;

    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];
    let checked = false;
    let originalValue = '';
    let originalKey = '';
    let originalToBeVerb = '';

    if (name === 'key') {
      if (value === 'department') {
        this.setState({ isLocation: false });
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
        this.setState({ isLocation: true });
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
        this.setState({ isLocation: false });
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
        this.setState({ isLocation: false });
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

    newConditionsData.map((data) => {
      originalKey = data.key;
      originalToBeVerb = data.tobeVerb;
      originalValue = data.value;
      return data;
    });

    const newObj = {
      id: index,
      key: originalKey,
      tobeVerb: originalToBeVerb,
      value: originalValue,
      isChecked: checked,
    };

    const newIndex = newConditionsData.findIndex((item) => item.id === index);

    if (name === 'tobeVerb' && isLocation === true) {
      checked = true;
      newObj.isChecked = checked;
      newConditionsData[newIndex] = newObj;
    }

    if (name === 'value') {
      newConditions[index][name].push(value);
    }

    newConditionsData[index][name] = value;

    // console.log('newConditionsData: ', newConditionsData);

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

  // onRemoveConditionDepartment = (index) => {
  //   console.log('delete department');
  // };

  onAddConditionDepartment = (id) => {
    const { conditionsData, conditions } = this.state;
    const newData = [...conditionsData];
    const newConditions = [...conditions];

    const newValue = '';
    let originalValue = '';
    let arrValue = [];
    let originalKey = '';
    let originalToBeVerb = '';

    newData.map((data) => {
      originalKey = data.key;
      originalToBeVerb = data.tobeVerb;

      if (typeof data.value === 'string') {
        originalValue = data.value;
      } else {
        arrValue = data.value;
      }

      return data;
    });

    const arrFirst = [originalValue, newValue];

    if (arrValue.length >= 2) {
      arrValue.push(newValue);
    }

    const newObj = {
      id,
      key: originalKey,
      tobeVerb: originalToBeVerb,
      value: '',
      isChecked: true,
    };

    const condition = {
      key: originalKey,
      value: arrFirst,
    };

    if (originalValue !== '') {
      newObj.value = arrFirst;
      condition.value = arrFirst;
    } else {
      newObj.value = arrValue;
      condition.value = arrValue;
    }

    const index = newData.findIndex((item) => item.id === id);

    newData[index] = newObj;
    newConditions[index] = condition;

    this.setState({
      conditionsData: newData,
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
      isChecked: false,
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

    dispatch({
      type: 'employeeSetting/addCustomEmail',
      payload: dataSubmit,
    }).then((data) => {
      console.log('dataSubmit AFTER call api: ', data);
    });
  };

  _renderConditions = () => {
    const { Option } = Select;
    const {
      conditionsData,
      conditionsTrigger: { units = [], toBeVerbs = [], departments = [] },
    } = this.state;

    const renderSelectOption1 = (valueLocation, index) => {
      const newArr = [...valueLocation];

      if (valueLocation.length > 1) {
        newArr.splice(0, 1);
      }

      return (
        <>
          {newArr.map((itemValue, indexValue) => {
            return (
              <Select
                value={itemValue}
                key={`${indexValue + 1}`}
                size="large"
                placeholder="Please select a choice"
                onChange={(value) => this.onChangeConditionLocation(index, 'value', value)}
              >
                {departments.map((department) => {
                  return (
                    <Option value={department._id} key={department._id}>
                      {department.name}
                    </Option>
                  );
                })}
              </Select>
            );
          })}
        </>
      );
    };

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
                  <Col span={10} className={styles.departmentCondition}>
                    {/* {renderLocation(data, index)} */}
                    <Row>
                      <Select
                        size="large"
                        value={data.value}
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
                {typeof data.value !== 'string' ? (
                  <Row gutter={[24, 12]} align="middle">
                    <Col span={13} />

                    <Col span={10}>{renderSelectOption1(data.value, index)}</Col>

                    <Col span={1}>
                      {data.value.length >= 2 && data.isChecked ? (
                        <img
                          onClick={() => this.onRemoveConditionDepartment(index)}
                          src={removeIcon}
                          alt="remove"
                        />
                      ) : null}
                    </Col>
                  </Row>
                ) : null}
                <Row gutter={[24, 12]} align="middle">
                  <Col span={13} />
                  {data.isChecked ? (
                    <Col>
                      <img
                        className={styles.onAddConditionBtn}
                        onClick={() => this.onAddConditionDepartment(data.id)}
                        src={addIcon}
                        alt="add"
                      />
                    </Col>
                  ) : null}
                  <Col span={1} />
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
                onChange={(value) => {
                  this.onChangeReceipients(value);
                }}
              >
                {receipients.map((option) => {
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
    const { frequencyItem, sendingDate, applyTo, sendToWorker, message, disabled } = this.state;

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
          <Col span={24}>
            <Form.Item name="frequency" label="Frequency">
              <Radio.Group onChange={(value) => this.onChangeFrequency(value)}>
                {frequencyItem.map((option) => {
                  return <Radio value={option.value}>{option.name}</Radio>;
                })}
              </Radio.Group>
            </Form.Item>
          </Col>

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
