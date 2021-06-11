/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Link, history, formatMessage, connect } from 'umi';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox, Tag, Spin } from 'antd';
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Quill } from 'react-quill';
import QuillMention from 'quill-mention';
import EditorQuill from '@/components/EditorQuill';

// import removeIcon from './assets/removeIcon.svg';
import 'react-quill/dist/quill.snow.css';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
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
    user: {
      currentUser: {
        //     company: { _id = '' } = {},
        roles = [],
        //     location: { name: locationName = '' } = {},
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
    // _id,
    listAutoField,
    // locationName,
    roles,
    loadingfetchEmailCustomInfo: loading.effects['employeeSetting/fetchEmailCustomInfo'],
    loadingUpdateCustomEmail: loading.effects['employeeSetting/updateCustomEmail'],
    loadingFetchListAutoField: loading.effects['employeeSetting/fetchListAutoField'],
  }),
)
class EditEmailForm extends PureComponent {
  formRef = React.createRef();

  listTexts = [];

  constructor(props) {
    super(props);

    this.state = {
      conditionsData: [
        {
          id: 0,
          key: '',
          tobeVerb: '',
          value: [],
        },
      ],
      // checkOption: [],
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
      // triggerEvent: '',
      // _sendingDate: '',
      // recipient: '',
      emailSubject: '',
      load: false,
      isLocation: false,
      selectedSelectBox: 0,
      _isDefault: false,
      _sendingDate: '',
      isCheckBox: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      emailCustomData: {
        conditions: conditionsCustomEmail = [],
        message: newMessage = '',
        isDefault = '',
        sendingDate: { type: typeSendingDate = '' } = {},
        subject = '',
        sendToExistingWorker = '',
      } = {},
    } = this.props;

    dispatch({
      type: 'employeeSetting/fetchListAutoField',
      payload: {},
    });

    const { conditionsData } = this.state;

    const newConditionCustomEmail = [...conditionsCustomEmail];
    const newData = [...conditionsData];

    // fetch data of emailCustomData got from reducer and set state into conditionsData.
    const conditionsKey = newConditionCustomEmail.map((item) => item.key);
    conditionsKey.map((item, index) => {
      const newObj = {
        id: index,
        key: item,
        tobeVerb: '',
        value: [],
      };

      newData.push(newObj);
      return newData;
    });
    const filterData = newData.filter((item) => item.key !== '');
    /// ///////////////////////////////////////////

    // Check isDefault data field
    if (isDefault) {
      this.setState({ _isDefault: true });
    } else {
      this.setState({ _isDefault: false });
    }

    /// ///////////////////////////////////////////

    // set sendingDate radio button as default checked

    const value1 = 'Specific number of days before or after the event';
    const value2 = 'On the event date';

    if (typeSendingDate === 'now') {
      this.setState({ _sendingDate: value1 });
    } else {
      this.setState({ _sendingDate: value2 });
    }

    if (sendToExistingWorker) {
      this.setState({ isCheckBox: true });
    }
    /// ///////////////////////////////////////////

    this.setState({
      conditionsData: filterData,
      emailSubject: subject,
      messages: newMessage,
    });
  }

  listTemp = () => {
    const { listAutoField } = this.props;
    const newList = [...listAutoField];

    newList.map((item) => {
      this.listTexts.push(item);
      return this.listTexts;
    });
    return this.listTexts;
  };

  checkFields = () => {
    // const { conditionsData } = this.state;

    // let key = '';
    // let tobeVerb = '';
    // let value = '';

    // conditionsData.map((item) => {
    //   key = item.key;
    //   tobeVerb = item.tobeVerb;
    //   value = item.value;
    //   return item;
    // });

    const {
      // triggerEvent,
      _sendingDate,
      // appliesToData,
      // recipient,
      emailSubject,
      messages,
    } = this.state;

    if (
      _sendingDate.trim() !== '' &&
      emailSubject.trim() !== '' &&
      messages.trim() !== '' &&
      messages.trim() !== '<p></p>' &&
      messages.trim() !== '<p><br></p>'
    ) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }

    // if (
    //   triggerEvent.trim() !== '' &&
    //   _sendingDate.trim() !== '' &&
    //   emailSubject.trim() !== '' &&
    //   messages.trim() !== '' &&
    //   messages.trim() !== '<p></p>' &&
    //   messages.trim() !== '<p><br></p>'
    // ) {
    //   if (
    //     appliesToData.trim() === 'any' && recipient.trim() !== '') {
    //     this.setState({ disabled: false });
    //   } else if (
    //     appliesToData.trim() === 'condition' &&
    //     key.trim() !== '' &&
    //     tobeVerb.trim() !== '' &&
    //     value.length !== 0
    //   ) {
    //     this.setState({ disabled: false });

    //     if (value[1] !== '') {
    //       this.setState({ disabled: false });
    //     } else {
    //       this.setState({ disabled: true });
    //     }
    //   } else {
    //     this.setState({ disabled: true });
    //   }
    // } else {
    //   this.setState({ disabled: true });
    // }
  };

  handleChangeApply = (value) => {
    const { dispatch } = this.props;

    // this.setState({
    //   appliesToData: value,
    // });

    if (value === 'any') {
      dispatch({
        type: 'employeeSetting/fetchDepartmentListByCompanyId',
        payload: {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        },
      }).then((data) => {
        this.setState({
          recipients: data,
        });
      });
    }
  };

  handleChangeEmail = (value) => {
    console.log('value', value);
    this.setState({
      messages: value,
    });
  };

  onChangeTriggerEvent = (value) => {
    // this.setState({ triggerEvent: value });
    console.log('value message: ', value);
  };

  onChangeSendingDate = (value) => {
    console.log('value message: ', value.target.value);

    // this.setState({ _sendingDate: value.target.value });
  };

  onChangeRecipients = (value) => {
    // this.setState({ recipient: value });
    console.log('value message: ', value);
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
                payload: {
                  tenantId: getCurrentTenant(),
                  company: getCurrentCompany(),
                },
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
                payload: { tenantId: getCurrentTenant(), company: getCurrentCompany() },
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
          payload: {
            tenantId: getCurrentTenant(),
            company: getCurrentCompany(),
          },
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
          payload: { tenantId: getCurrentTenant(), company: getCurrentCompany() },
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
    // const { triggerEventList, dispatch } = this.props;
    // const { messages = '', appliesToData = '', conditions = [], sendToExistingWorker } = this.state;
    const { dispatch } = this.props;
    const { messages = '' } = this.state;
    const { emailCustomData: { _id = '' } = {} } = this.props;
    let dataSubmit = {};

    const newValue = { ...values };
    const { subject } = newValue;

    // const message = messages.replace(/<[^>]+>/g, '');

    dataSubmit = {
      _id,
      subject,
      message: messages,
      tenantId: getCurrentTenant(),
    };

    console.log('dataSubmit: ', dataSubmit);
    // console.log('success: ', dataSubmit);
    // dispatch({
    //   type: 'employeeSetting/updateCustomEmail',
    //   payload: dataSubmit,
    // });

    // delete newValue.sendToWorker;
    // delete newValue.frequency;

    // const triggerEventValue = values.triggerEvent;
    // const triggerEvent = triggerEventList.filter((item) => item.value === triggerEventValue)[0];
    // newValue.triggerEvent = triggerEvent;

    // if (appliesToData === 'any') {
    //   dataSubmit = { ...newValue, message, sendToExistingWorker };
    // }
    // if (appliesToData === 'condition') {
    //   dataSubmit = { ...newValue, conditions, message, sendToExistingWorker };
    // }

    // dispatch({
    //   type: 'employeeSetting/addCustomEmail',
    //   payload: dataSubmit,
    // }).then(() => {
    //   setTimeout(() => {
    //     this.back();
    //   }, 1000);
    // });
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
    let valueToBeVerb = '';
    const {
      conditionsData,
      conditionsTrigger: { units = [], toBeVerbs = [], departments = [] },
      load,
      _isDefault,
    } = this.state;

    conditionsData.map((item) => {
      if (item.tobeVerb === 'is') {
        valueToBeVerb = item.tobeVerb;
      }
      return valueToBeVerb;
    });

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
                      disabled={_isDefault}
                      onChange={(value) => this.onChangeCondition(index, 'key', value)}
                    >
                      {units.map((unit, _index) => {
                        return (
                          <Option
                            value={unit.value}
                            disabled={this.checkOptionKey(unit.value)}
                            key={`${_index + 1}`}
                          >
                            {unit?.name}
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
                      disabled={_isDefault}
                      onChange={(value) => this.onChangeCondition(index, 'tobeVerb', value)}
                    >
                      {toBeVerbs.map((toBeVerb, _index) => {
                        return (
                          <Option value={toBeVerb.value} key={`${_index + 1}`}>
                            {toBeVerb?.name}
                          </Option>
                        );
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
                        disabled={_isDefault}
                        tagRender={this.tagRender}
                        mode={valueToBeVerb === 'is' ? '' : 'multiple'}
                        showArrow
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                                  disabled={this.checkOptionDepartment(department?.name)}
                                >
                                  {department?.name}
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
                  {/* <Col span={1}>
                    <img
                      onClick={() => this.onRemoveCondition(index)}
                      src={removeIcon}
                      alt="remove"
                    />
                  </Col> */}
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
    console.log('value message: ', value);
    // const { target: { checked = '' } = {} } = value;
    // this.setState({ sendToExistingWorker: checked });
  };

  _renderApplyToOptions = () => {
    const { Option } = Select;
    const { recipients, _isDefault } = this.state;
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
                disabled={_isDefault}
                onChange={(value) => {
                  this.onChangeRecipients(value);
                }}
              >
                {recipients.map((option) => {
                  return (
                    <Option value={option.value} key={option._id}>
                      {option?.name}
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

  _renderForm = (listAutoText) => {
    const { Option } = Select;
    const {
      loadingUpdateCustomEmail,
      emailCustomData = {},
      triggerEventList,
      loadingfetchEmailCustomInfo,
    } = this.props;
    const {
      sendingDate,
      applyTo,
      sendToWorker,
      messages,
      disabled,
      _isDefault,
      _sendingDate,
      isCheckBox,
    } = this.state;
    const { subject = '', triggerEvent = {}, applyTo: _applyTo = '' } = emailCustomData;

    return (
      <>
        {loadingfetchEmailCustomInfo ? (
          <div className={styles.EditEmailForm_loading}>
            <Spin size="large" />
          </div>
        ) : (
          <Form onFinish={this.onFinish} ref={this.formRef}>
            <Row gutter={[36, 24]}>
              {/* Trigger Event */}
              <Col span={12}>
                <Form.Item label="Trigger event" name="triggerEvent">
                  <Select
                    size="large"
                    defaultValue={triggerEvent?.name}
                    disabled={_isDefault}
                    onChange={(value) => this.onChangeTriggerEvent(value)}
                  >
                    {triggerEventList.map((option, _index) => {
                      return (
                        <Option value={option.value} key={`${_index + 1}`}>
                          {option?.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className={styles.note}>
                  <span>
                    {formatMessage({ id: 'component.editEmailForm.triggerNote' })}{' '}
                    <a href="#">
                      {' '}
                      {formatMessage({ id: 'component.editEmailForm.triggerNoteLink' })}
                    </a>
                  </span>
                </div>
              </Col>

              {/* Sending date */}
              <Col span={24}>
                <Form.Item name="sendingDate" label="Sending date">
                  <Radio.Group
                    onChange={(value) => this.onChangeSendingDate(value)}
                    disabled={_isDefault}
                    defaultValue={_sendingDate}
                  >
                    {sendingDate.map((option, _index) => {
                      return (
                        <Radio value={option.value} key={`${_index + 1}`}>
                          {option?.name}
                        </Radio>
                      );
                    })}
                  </Radio.Group>
                </Form.Item>
              </Col>

              {/* Applies to */}
              <Col span={12}>
                <Form.Item name="applyTo" label="Applies to">
                  {applyTo.map((option, _index) => (
                    <>
                      {_applyTo === option.value ? (
                        <Select
                          size="large"
                          key={`${_index + 1}`}
                          value={option?.name}
                          onChange={this.handleChangeApply}
                          disabled={_isDefault}
                        >
                          {applyTo.map((item, _indexItem) => {
                            return (
                              <Option value={item.value} key={`${_indexItem + 1}`}>
                                {item?.name}
                              </Option>
                            );
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
                  {sendToWorker.map((option, _index) => {
                    return (
                      <Checkbox
                        value={option.value}
                        checked={isCheckBox}
                        disabled={_isDefault}
                        key={`${_index + 1}`}
                        onChange={(value) => this.handleChangeChckBox(value)}
                      >
                        {option?.name}
                      </Checkbox>
                    );
                  })}
                </Form.Item>
              </Col>

              {/* Email subject */}
              <Col span={24}>
                <Form.Item name="subject" label="Email subject">
                  <Input
                    defaultValue={subject}
                    // disabled
                    onChange={(e) => this.onChangeEmailSubject(e.target.value)}
                  />
                </Form.Item>
              </Col>

              {/* Email message */}
              <Col span={24}>
                {/* <Form.Item name="message" label="Email message"> */}
                <p className={styles.label}>Email message :</p>
                <EditorQuill
                  messages={messages}
                  handleChangeEmail={this.handleChangeEmail}
                  listAutoText={listAutoText}
                />
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
                    loading={loadingUpdateCustomEmail}
                  >
                    {formatMessage({ id: 'component.editEmailForm.submit' })}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </>
    );
  };

  render() {
    const { loadingFetchListAutoField } = this.props;
    this.checkFields();
    const listAutoText = this.listTemp();

    return (
      <>
        {loadingFetchListAutoField ? (
          <div className={styles.EditEmailForm_loading}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.EditEmailForm}>
            <div className={styles.EditEmailForm_title}>Edit custom emails</div>
            <div className={styles.divider} />
            <div className={styles.EditEmailForm_form}>{this._renderForm(listAutoText)}</div>
          </div>
        )}
      </>
    );
  }
}

export default EditEmailForm;
