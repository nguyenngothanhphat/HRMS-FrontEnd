/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Link, history, formatMessage, connect } from 'umi';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox, Tag, Spin } from 'antd';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import ReactQuill, { Quill } from 'react-quill';
import QuillMention from 'quill-mention';

import removeIcon from './assets/removeIcon.svg';
import 'react-quill/dist/quill.snow.css';
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
      // emailCustomData = {},
    } = {},
    user: {
      currentUser: {
        company: { _id = '' } = {},
        roles = [],
        location: { name: locationName = '' } = {},
      } = {},
    } = {},
    loading,
  }) => ({
    triggerEventList,
    locationList,
    departmentList,
    titleList,
    employeeTypeList,
    departmentListByCompanyId,
    _id,
    listAutoField,
    locationName,
    roles,
    // loadingAddCustomEmail: loading.effects['employeeSetting/addCustomEmail'],
    loadingfetchEmailCustomInfo: loading.effects['employeeSetting/fetchEmailCustomInfo'],
    // emailCustomData,
  }),
)
class EditEmailForm extends PureComponent {
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
      messages: '',
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
      load: false,
      isLocation: false,
      selectedSelectBox: 0,
    };
  }

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
      messages,
    } = this.state;

    if (
      triggerEvent.trim() !== '' &&
      _sendingDate.trim() !== '' &&
      emailSubject.trim() !== '' &&
      messages.trim() !== '' &&
      messages.trim() !== '<p></p>' &&
      messages.trim() !== '<p><br></p>'
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
      messages: value,
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

  onClickCondition = (index) => {
    const { conditionsData, selectedSelectBox } = this.state;
    const newConditionsData = [...conditionsData];
    const { dispatch } = this.props;

    if (selectedSelectBox !== index) {
      this.setState({
        selectedSelectBox: index,
      });

      newConditionsData.forEach((item) => {
        if (item.id === index) {
          switch (item.key) {
            case 'department':
              this.setState({ load: false });
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
                this.setState({ load: true });
              });
              break;

            case 'location':
              this.setState({ load: false });
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
                this.setState({ load: true });
              });
              break;

            case 'title':
              this.setState({ load: false });
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
                this.setState({ load: true });
              });
              break;

            default:
              this.setState({ load: false });
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
                this.setState({ load: true });
              });
              break;
          }
        }
      });
    }
  };

  onChangeCondition = (index, name, value) => {
    const { conditionsData, conditions } = this.state;
    const { dispatch } = this.props;

    const newConditionsData = [...conditionsData];
    const newConditions = [...conditions];

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
          this.setState({ load: true });
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
          this.setState({ load: true });
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
          this.setState({ load: true });
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
          this.setState({ load: true });
        });
      }
      newConditions[index][name] = value;
    }

    if (name === 'value') {
      newConditions[index][name] = value;
    }

    newConditionsData[index][name] = value;

    // console.log('newConditionsData:', newConditionsData);

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

  checkOptionDepartment = (departmentName) => {
    const { locationName, roles } = this.props;
    const { isLocation } = this.state;
    let check = true;

    let hrManager = '';
    let glManager = '';

    roles.forEach((item) => {
      if (item._id === 'HR-GLOBAL') {
        glManager = 'HR-GLOBAL';
      }
      if (item._id === 'HR-MANAGER') {
        hrManager = 'HR-MANAGER';
      }
    });

    if (isLocation) {
      if (hrManager && departmentName === locationName) {
        check = false;
      }
      if (glManager) {
        check = false;
      }
    } else {
      check = false;
    }

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
    const { messages = '', appliesToData = '', conditions = [], sendToExistingWorker } = this.state;
    let dataSubmit = {};

    const newValue = { ...values };
    delete newValue.sendToWorker;
    delete newValue.frequency;

    const triggerEventValue = values.triggerEvent;
    const triggerEvent = triggerEventList.filter((item) => item.value === triggerEventValue)[0];
    newValue.triggerEvent = triggerEvent;

    const message = messages.replace(/<[^>]+>/g, '');

    if (appliesToData === 'any') {
      dataSubmit = { ...newValue, message, sendToExistingWorker };
    }
    if (appliesToData === 'condition') {
      dataSubmit = { ...newValue, conditions, message, sendToExistingWorker };
    }

    dispatch({
      type: 'employeeSetting/addCustomEmail',
      payload: dataSubmit,
    }).then(() => {
      setTimeout(() => {
        this.back();
      }, 1000);
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
    const { emailCustomData = {} } = this.props;
    const {
      conditionsData,
      conditionsTrigger: { units = [], toBeVerbs = [], departments = [] },
      load,
    } = this.state;

    const { conditions = [] } = emailCustomData;

    console.log('conditions: ', conditions);
    const conditionsKey = conditions.map((item) => item.key);
    console.log('conditionsKey: ', conditionsKey);

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
                        onClick={() => this.onClickCondition(index)}
                      >
                        {load ? (
                          <>
                            {departments.map((department) => {
                              return (
                                <Option
                                  value={department._id}
                                  key={department._id}
                                  disabled={this.checkOptionDepartment(department.name)}
                                >
                                  {department.name}
                                </Option>
                              );
                            })}
                          </>
                        ) : (
                          <Option style={{ margin: 'auto', background: 'none' }}>
                            <Spin indicator={antIcon} className={styles.iconSpin} />
                          </Option>
                        )}
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
            {formatMessage({ id: 'component.editEmailForm.addCondition' })}
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
    const { recipients } = this.state;
    const { emailCustomData = {} } = this.props;
    const { applyTo = '' } = emailCustomData;
    if (applyTo === 'any') {
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
    if (applyTo === 'condition') {
      return this._renderConditions();
    }
    return null;
  };

  dataAutoField = () => {
    const { listAutoField } = this.props;
    return listAutoField;
  };

  _renderForm = () => {
    const { Option } = Select;
    const { loadingAddCustomEmail, emailCustomData = {}, triggerEventList } = this.props;
    const { sendingDate, applyTo, sendToWorker, messages, disabled } = this.state;
    const {
      message: _messages = '',
      subject = '',
      triggerEvent = {},
      applyTo: _applyTo = '',
      sendToExistingWorker,
    } = emailCustomData;
    this.setState({ messages: _messages });

    return (
      <Form onFinish={this.onFinish}>
        <Row gutter={[36, 24]}>
          {/* Trigger Event */}
          <Col span={12}>
            <Form.Item label="Trigger event" name="triggerEvent">
              <Select
                size="large"
                defaultValue={triggerEvent.name}
                disabled
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
                {formatMessage({ id: 'component.editEmailForm.triggerNote' })}{' '}
                <a href="#"> {formatMessage({ id: 'component.editEmailForm.triggerNoteLink' })}</a>
              </span>
            </div>
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
              {applyTo.map((option) => (
                <>
                  {_applyTo === option.value ? (
                    <Select
                      size="large"
                      defaultValue={option.name}
                      onChange={this.handleChangeApply}
                      disabled
                    >
                      {applyTo.map((item) => {
                        return <Option value={item.value}>{item.name}</Option>;
                      })}
                    </Select>
                  ) : null}
                </>
              ))}
            </Form.Item>
          </Col>

          <Col span={12} />

          {this._renderApplyToOptions()}

          {/* Send to existing workers */}
          <Col span={12}>
            <Form.Item name="sendToWorker" label="Send to existing workers">
              {sendToExistingWorker ? (
                <div>
                  {sendToWorker.map((option) => {
                    return (
                      <Checkbox
                        value={option.value}
                        checked
                        disabled
                        onChange={(value) => this.handleChangeChckBox(value)}
                      >
                        {option.name}
                      </Checkbox>
                    );
                  })}
                </div>
              ) : (
                <Checkbox.Group>
                  {sendToWorker.map((option) => {
                    return (
                      <Checkbox
                        value={option.value}
                        disabled
                        onChange={(value) => this.handleChangeChckBox(value)}
                      >
                        {option.name}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>

          {/* Email subject */}
          <Col span={24}>
            <Form.Item name="subject" label="Email subject">
              <Input
                defaultValue={subject}
                disabled
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
              value={messages}
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
                {formatMessage({ id: 'component.editEmailForm.cancel' })}
              </Button>
            </Link>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabled}
                loading={loadingAddCustomEmail}
              >
                {formatMessage({ id: 'component.editEmailForm.submit' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { loadingfetchEmailCustomInfo } = this.props;
    this.checkFields();
    return (
      <>
        {loadingfetchEmailCustomInfo ? (
          <div className={styles.EditEmailForm_loading}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.EditEmailForm}>
            <div className={styles.EditEmailForm_title}>
              {formatMessage({ id: 'component.editEmailForm.title' })}
              <hr />
            </div>
            <div className={styles.EditEmailForm_form}>{this._renderForm()}</div>
          </div>
        )}
      </>
    );
  }
}

export default EditEmailForm;
