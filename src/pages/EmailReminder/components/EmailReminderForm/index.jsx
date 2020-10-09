import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Select, Radio, Checkbox } from 'antd';
// import { formatMessage } from 'umi';

import styles from './index.less';

class EmailReminderForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        appliesTo: '',
      },
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
    };
  }

  handleChangeApply = (value) => {
    this.setState({
      formData: {
        appliesTo: value,
      },
    });
  };

  _renderApplyToOptions = () => {
    const { formData } = this.state;
    if (formData.appliesTo === 'Any Person') {
      return <p>Any Person</p>;
    }
    if (formData.appliesTo === 'Create a condition') {
      return <p>Create a condition</p>;
    }
    return null;
  };

  _renderForm = () => {
    const { Option } = Select;
    const {
      formData,
      triggerEventItem,
      frequencyItem,
      sendingDate,
      appliesTo,
      sendToWorker,
    } = this.state;
    return (
      <Form>
        <Row gutter={[36, 6]}>
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
              You can add additional events with <a href="#"> Custom fields</a>
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

          <Col span={24}>{this._renderApplyToOptions()}</Col>

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
