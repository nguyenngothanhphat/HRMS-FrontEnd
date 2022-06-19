import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, Checkbox } from 'antd';
import { connect } from 'umi';
import styles from '../../index.less';

const CandidateUserName = (props) => {
  const {
    onCancel = () => {},
    onOk = () => {},
    visible,
    candidateId,
    dispatch,
    userName,
    loadingCheckUserName,
    loadingCreateEmployee,
  } = props;
  const [validate, setValidate] = useState({ validateStatus: 'success', errorMsg: null });
  const [initalValue, setInitalValue] = useState({});
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    setInitalValue({ userName });
  }, [userName]);

  const onFinish = async (value) => {
    const { userName: name = '' } = value;
    if (name) {
      const isExistingUserName = await dispatch({
        type: 'onboard/checkExistedUserName',
        payload: { userName: name },
      });
      if (isExistingUserName === false) {
        const response = await dispatch({
          type: 'onboard/createEmployee',
          payload: { userName: name, candidateId },
        });
        const { statusCode = '' } = response;

        if (statusCode === 200)
          // onOk(value);
          next();
      } else setValidate({ validateStatus: 'error', errorMsg: 'That username is already taken' });
    } else setValidate({ validateStatus: 'error', errorMsg: 'Please input user name' });
  };

  const steps = [
    {
      title: 'Candidate Username',
      description:
        'The following is the username that is generated for the candidate, you can make any changes to the username if you would like',
      content: (
        <Form
          name="basic"
          id="usernameForm"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initalValue}
        >
          <div className={styles.documentVerification}>
            <Form.Item
              name="userName"
              label="User Name"
              validateStatus={validate.validateStatus}
              help={validate.errorMsg}
              className={styles.inputForm}
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      ),
      footer: [
        <Button onClick={() => onCancel()} className={styles.btnCancel}>
          Cancel
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          form="usernameForm"
          key="submit"
          htmlType="submit"
          loading={loadingCheckUserName || loadingCreateEmployee}
        >
          Next
        </Button>,
      ],
    },
    {
      title: 'Reporting Structure',
      description: 'Please select the reporting manager and reportees to proceed further',
      content: (
        <Form
          name="basic"
          id="reportingForm"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initalValue}
        >
          <div
            className={styles.documentVerification}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Form.Item
              name="reportingManager"
              label="Reporting Manager"
              // validateStatus={validate.validateStatus}
              // help={validate.errorMsg}
              rules={[{ required: true, message: 'Please select reporting manager' }]}
              className={styles.inputForm}
            >
              <Select
                placeholder="Please select"
                allowClear
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {props.reportingManagers?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="reportees"
              label="Reportees"
              // validateStatus={validate.validateStatus}
              // help={validate.errorMsg}
              rules={[{ required: true, message: 'Please select reportees' }]}
              className={styles.inputForm}
            >
              <Select
                placeholder="Please select"
                allowClear
                mode="multiple"
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {props.reportees?.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    <Checkbox value={item.id} checked={item.checked} />
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      ),
      footer: [
        <Button onClick={() => prev()} className={styles.btnCancel}>
          Cancel
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          form="usernameForm"
          key="submit"
          htmlType="submit"
          loading={loadingCheckUserName || loadingCreateEmployee}
        >
          Next
        </Button>,
      ],
    },
  ];

  return (
    <Modal
      className={styles.joiningFormalitiesModal}
      onCancel={() => onCancel()}
      // footer={[
      //   <Button onClick={() => onCancel()} className={styles.btnCancel}>
      //     Cancel
      //   </Button>,
      //   <Button
      //     className={styles.btnSubmit}
      //     type="primary"
      //     form="usernameForm"
      //     key="submit"
      //     htmlType="submit"
      //     loading={loadingCheckUserName || loadingCreateEmployee}
      //   >
      //     Save Changes
      //   </Button>,
      // ]}
      // title="Candidate Username"
      footer={steps[current].footer}
      title={steps[current].title}
      centered
      destroyOnClose
      maskClosable={false}
      visible={visible}
    >
      <>
        <div className={styles.headerContent}>
          {/* The following is the username that is generated for the candidate, you can make any
          changes to the username if you would like */}
          {steps[current].description}
        </div>
        {steps[current].content}
        {/* <Form
          name="basic"
          id="usernameForm"
          onFinish={onFinish}
          layout="vertical"
          initialValues={initalValue}
        >
          <div className={styles.documentVerification}>
            <Form.Item
              name="userName"
              label="User Name"
              validateStatus={validate.validateStatus}
              help={validate.errorMsg}
              className={styles.inputForm}
            >
              <Input />
            </Form.Item>
          </div>
        </Form> */}
      </>
    </Modal>
  );
};

export default connect(({ loading, onboard: { joiningFormalities: { userName = '' } = {} } }) => ({
  userName,
  loadingCheckUserName: loading.effects['onboard/checkExistedUserName'],
  loadingCreateEmployee: loading.effects['onboard/createEmployee'],
}))(CandidateUserName);
