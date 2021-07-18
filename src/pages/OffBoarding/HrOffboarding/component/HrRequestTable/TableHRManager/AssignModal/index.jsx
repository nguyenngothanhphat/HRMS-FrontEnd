import React, { Component } from 'react';
import { connect } from 'umi';
import { Modal, Form, Button, Select } from 'antd';
import DefaultAvatar from '@/assets/defaultAvatar.png';

import styles from './index.less';

const { Option } = Select;

@connect(({ offboarding: { listAssigneeHr = [] } = {}, loading }) => ({
  listAssigneeHr,
  loadingAssign: loading.effects['onboard/assignToHr'],
}))
class AssignModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedEmployee: true };
  }

  renderHeaderModal = () => {
    const { titleModal = 'Assign Employee' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  renderHR = (hr) => {
    const {
      generalInfo: {
        avatar = '',
        // workEmail = '',
        firstName = '',
        middleName = '',
        lastName = '',
      } = {},
    } = hr;
    const fullName = `${firstName} ${middleName ? `${middleName} ` : ''}${lastName}`;
    return (
      <Option key={hr._id} value={hr._id} style={{ padding: '10px' }}>
        <div
          style={{
            display: 'inline',
            marginRight: '10px',
          }}
        >
          <img
            style={{
              borderRadius: '50%',
              width: '25px',
              height: '25px',
            }}
            src={avatar}
            alt="user"
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
          {fullName}
        </span>
      </Option>
    );
  };

  onValuesChange = (item) => {
    if ('assigneeId' in item) {
      this.setState({
        selectedEmployee: false,
      });
    }
  };

  onFinish = (item) => {
    const { offBoardingRequest, dispatch, handleAssignModal = () => {} } = this.props;
    const payload = {
      ...item,
      offBoardingRequest,
    };
    dispatch({
      type: 'offboarding/assignToHr',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) handleAssignModal(false);
    });
  };

  render() {
    const {
      loadingAssign,
      visible = false,
      handleAssignModal = () => {},
      listAssigneeHr = [],
    } = this.props;
    const { selectedEmployee } = this.state;
    return (
      <>
        <Modal
          className={styles.AssignModal}
          onCancel={() => handleAssignModal(false, '')}
          destroyOnClose
          footer={[
            <Button onClick={() => handleAssignModal(false, '')} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              disabled={selectedEmployee}
              loading={loadingAssign}
            >
              Assign
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            id="myForm"
            onFinish={this.onFinish}
            onValuesChange={this.onValuesChange}
          >
            <Form.Item
              label="Assign"
              name="assigneeId"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: 'Please select option!',
                },
              ]}
            >
              <Select>
                {listAssigneeHr.map((hr) => {
                  return this.renderHR(hr);
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default AssignModal;
