import React, { PureComponent } from 'react';
import { Input, Select, Button, Empty, notification, Form } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const { Option } = Select;
@connect(({ loading, user: { currentUser: { employee = {} } = {} } = {} }) => ({
  employee,
  loadingUpdateTicket: loading.effects['ticketManagement/updateTicket'],
}))
class RightContent extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      status: '',
      timeTaken: '',
    };
  }

  componentDidMount = () => {
    const { data: { status = '' } = {} } = this.props;
    this.setState({
      status,
    });
  };

  renderOption = () => {
    const { status } = this.state;
    if (status) {
      return (
        <Select
          value={status}
          style={{ width: 100 }}
          onChange={(value) => this.setState({ status: value })}
        >
          <Option value="Assigned">Assigned</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Client Pending">Client Pending</Option>
          <Option value="Resolved">Resolved</Option>
          <Option value="Closed">Closed</Option>
        </Select>
      );
    }
    return (
      <Select style={{ width: 100 }}>
        <Option disabled>
          <Empty />
        </Option>
      </Select>
    );
  };

  getTimeTaken = () => {
    const { timeTaken } = this.state;
    const { data: { status: statusProps = '', time_taken: timeTakenProps = '' } = {} } = this.props;
    const time = Number(timeTaken);
    if (statusProps === 'Resolved') {
      return timeTakenProps;
    }
    return time;
  };

  onSubmitUpdate = () => {
    const { status, timeTaken } = this.state;
    // const time = Number(timeTaken);
    const { dispatch, data = {}, employee: { _id = '' } = {} } = this.props;
    const {
      id = '',
      employee_assignee: employeeAssignee = '',
      employee_raise: employeeRaise = '',
      query_type: queryType = '',
      subject = '',
      description = '',
      priority = '',
      cc_list: ccList = [],
      attachments = [],
      status: statusProps = '',
      department_assign: departmentAssign = '',
    } = data;
    const payload = {
      id,
      status,
      employeeRaise,
      employeeAssignee,
      priority,
      description,
      subject,
      ccList,
      queryType,
      attachments,
      departmentAssign,
      employee: _id,
      timeTaken: this.getTimeTaken(),
    };
    if (status && status !== statusProps && statusProps !== 'New') {
      if (status === 'Resolved' && !timeTaken) {
        notification.error({
          message: 'Please input time taken',
        });
      } else {
        dispatch({
          type: 'ticketManagement/updateTicket',
          payload,
        });
      }
    }
  };

  render() {
    const { status = '', timeTaken = '' } = this.state;
    const {
      data: { status: statusProps = '', time_taken: timeTakenProps = '' } = {},
      loadingUpdateTicket = false,
    } = this.props;

    return (
      <div className={styles.RightContent}>
        <div className={styles.RightContent__title}>Action</div>
        <Form name="formUpdate" ref={this.formRef} id="formUpdate" onFinish={this.onSubmitUpdate}>
          <Form.Item
            rules={[
              {
                pattern: new RegExp(/^[0-9]+$/),
                message: 'Time taken must be a number!',
              },
            ]}
          >
            <div className={styles.RightContent__time}>
              <p>Time taken:</p>
              <Input
                addonAfter="Hours"
                placeholder={timeTakenProps}
                onChange={(e) =>
                  this.setState({
                    timeTaken: e.target.value,
                  })}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <div className={styles.RightContent__status}>
              <p>Status:</p>
              {this.renderOption()}
            </div>
          </Form.Item>
          <Form.Item>
            <div className={styles.RightContent__btn}>
              <Button
                className={`${
                  (status === 'Resolved' && timeTaken === '') || statusProps === 'Closed'
                    ? styles.btnUpdate__disable
                    : styles.btnUpdate
                }`}
                htmlType="submit"
                loading={loadingUpdateTicket}
              >
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default RightContent;
