import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input } from 'antd';
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

        if (statusCode === 200) onOk(value);
      } else setValidate({ validateStatus: 'error', errorMsg: 'That username is already taken' });
    } else setValidate({ validateStatus: 'error', errorMsg: 'Please input user name' });
  };

  return (
    <Modal
      className={styles.joiningFormalitiesModal}
      onCancel={() => onCancel()}
      footer={[
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
          Save Changes
        </Button>,
      ]}
      title="Candidate Username"
      centered
      destroyOnClose
      maskClosable={false}
      visible={visible}
    >
      <>
        <div className={styles.headerContent}>
          The following is the username that is generated for the candidate, you can make any
          changes to the username if you would like
        </div>
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
      </>
    </Modal>
  );
};

export default connect(({ loading, onboard: { joiningFormalities: { userName = '' } = {} } }) => ({
  userName,
  loadingCheckUserName: loading.effects['onboard/checkExistedUserName'],
  loadingCreateEmployee: loading.effects['onboard/createEmployee'],
}))(CandidateUserName);
