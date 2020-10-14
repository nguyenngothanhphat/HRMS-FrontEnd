import React, { PureComponent } from 'react';
import { Link, history } from 'umi';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import removeIcon from './assets/removeIcon.svg';

// import { formatMessage } from 'umi';

import styles from './index.less';

class EmailReminderForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      conditionsData: [
        {
          unit: '',
          tobeVerb: '',
          department: '',
        },
      ],
      appliesToData: '',
      emailMessage: '',
      triggerEventItem: [
        {
          name: 'Person starts work',
          value: 'Person starts work',
        },
        {
          name: 'Person leaves work',
          value: 'Person leaves work',
        },
        {
          name: 'Person’s work anniversary',
          value: 'Person’s work anniversary',
        },
        {
          name: 'Annual event',
          value: 'Annual event',
        },
      ],
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
      appliesTo: [
        {
          name: 'Any Person',
          value: 'Any Person',
        },
        {
          name: 'Create a condition',
          value: 'Create a condition',
        },
      ],
      sendToWorker: [
        {
          name: 'Yes, send this email to all current workers ',
          value: 'Yes, send this email to all current workers ',
        },
      ],
      receipients: [
        {
          name: 'The person (The triggering person)',
          value: 'The person (The triggering person)',
        },
        {
          name: 'Manager (The person’s manager)',
          value: 'Manager (The person’s manager)',
        },
        {
          name: 'Admin (All admins)',
          value: 'Admin (All admins)',
        },
        {
          name: 'UX & Research (everyone)',
          value: 'UX & Research (everyone)',
        },
        {
          name: 'Visual Design (everyone)',
          value: 'Visual Design (everyone)',
        },
        {
          name: 'Sales & Marketing (everyone)',
          value: 'Sales & Marketing (everyone)',
        },
        {
          name: 'Business Development (everyone)',
          value: 'Business Development (everyone)',
        },
        {
          name: 'Front end (everyone)',
          value: 'Front end (everyone)',
        },
        {
          name: 'Engineering (everyone)',
          value: 'Engineering (everyone)',
        },
      ],
      conditions: {
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
        departments: [
          {
            name: 'UX & Research',
            value: 'UX & Research',
          },
          {
            name: 'Visual Design',
            value: 'Visual Design',
          },
          {
            name: 'Sales & Marketing',
            value: 'Sales & Marketing',
          },
          {
            name: 'Business Development',
            value: 'Business Development',
          },
          {
            name: 'Front end',
            value: 'Front end',
          },
          {
            name: 'Engineering',
            value: 'Engineering',
          },
        ],
      },
    };
  }

  handleChangeApply = (value) => {
    this.setState({
      appliesToData: value,
    });
  };

  handleChangeEmail = (value) => {
    this.setState({
      emailMessage: value,
    });
  };

  onChangeCondition = (index, name, value) => {
    const { conditionsData } = this.state;
    // console.log(index, name, value);
    const newConditionsData = [...conditionsData];
    newConditionsData[index][name] = value;
    // console.log(newConditionsData);
    this.setState({
      conditionsData: newConditionsData,
    });
  };

  onRemoveCondition = (index) => {
    const { conditionsData } = this.state;
    const newConditionsData = [...conditionsData];

    newConditionsData.splice(index, 1);

    this.setState({
      conditionsData: newConditionsData,
    });
  };

  onAddCondition = () => {
    const { conditionsData } = this.state;
    const newConditionsData = [...conditionsData];
    const newCondition = { unit: '', tobeVerb: '', department: '' };

    newConditionsData.push(newCondition);

    this.setState({
      conditionsData: newConditionsData,
    });
  };

  onFinish = (values) => {
    const { emailMessage = '', conditionsData = [], appliesToData } = this.state;
    let payload = {};
    if (appliesToData === 'Any Person') {
      payload = { ...values, appliesToData, emailMessage };
    }
    if (appliesToData === 'Create a condition') {
      payload = { ...values, conditionsData, emailMessage };
    }
    console.log('Success:', payload);
  };

  _renderConditions = () => {
    const { Option } = Select;
    const {
      conditionsData,
      conditions: { units = [], toBeVerbs = [], departments = [] },
    } = this.state;
    return (
      <Col span={24}>
        <Form.Item label="Conditions: Trigger for someone if">
          {conditionsData.map((data, index) => {
            return (
              <Row gutter={[24, 12]} align="middle">
                {/* Units  */}
                <Col span={9}>
                  <Select
                    size="large"
                    value={data.unit}
                    placeholder="Please select a choice"
                    onChange={(value) => this.onChangeCondition(index, 'unit', value)}
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
                    value={data.department}
                    placeholder="Please select a choice"
                    onChange={(value) => this.onChangeCondition(index, 'department', value)}
                  >
                    {departments.map((department) => {
                      return <Option value={department.value}>{department.name}</Option>;
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
          <Button onClick={this.onAddCondition}>+ Add another condition</Button>
        </div>
      </Col>
    );
  };

  back = () => {
    history.goBack();
  };

  _renderApplyToOptions = () => {
    const { Option } = Select;
    const { appliesToData, receipients } = this.state;
    if (appliesToData === 'Any Person') {
      return (
        // Receipients
        <>
          <Col span={12}>
            <Form.Item label="Receipients" name="receipients">
              <Select size="large" placeholder="Please select a choice">
                {receipients.map((option) => {
                  return <Option value={option.value}>{option.name}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} />
        </>
      );
    }
    if (appliesToData === 'Create a condition') {
      return this._renderConditions();
    }
    return null;
  };

  _renderForm = () => {
    const { Option } = Select;
    const {
      // formData,
      triggerEventItem,
      frequencyItem,
      sendingDate,
      appliesTo,
      sendToWorker,
      emailMessage,
    } = this.state;
    // const { emailMessage } = formData;
    return (
      <Form onFinish={this.onFinish}>
        <Row gutter={[36, 24]}>
          {/* Trigger Event */}
          <Col span={12}>
            <Form.Item label="Trigger event" name="triggerEvent">
              <Select size="large" placeholder="Please select a choice">
                {triggerEventItem.map((option) => {
                  return <Option value={option.value}>{option.name}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <div className={styles.note}>
              <span>
                You can add additional events with <a href="#"> Custom fields</a>
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
            <Form.Item name="appliesTo" label="Applies to">
              <Select
                size="large"
                placeholder="Please select a choice"
                onChange={this.handleChangeApply}
              >
                {appliesTo.map((option) => {
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
            <Form.Item name="emailSubject" label="Email subject">
              <Input placeholder="Eg:  Welcome to the company" />
            </Form.Item>
          </Col>

          {/* Email message */}
          <Col span={24}>
            {/* <Form.Item name="emailMessage" label="Email message"> */}
            <ReactQuill
              className={styles.quill}
              value={emailMessage}
              onChange={this.handleChangeEmail}
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
              <Button type="secondary">Cancel</Button>
            </Link>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
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
          Create a custom new email reminder
          <hr />
        </div>
        <div className={styles.EmailReminderForm_form}>{this._renderForm()}</div>
      </div>
    );
  }
}

export default EmailReminderForm;
