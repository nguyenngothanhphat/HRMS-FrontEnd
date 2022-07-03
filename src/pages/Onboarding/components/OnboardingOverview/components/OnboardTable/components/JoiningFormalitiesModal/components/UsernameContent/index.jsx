import { Form, Input, Select, Tag } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const UserNameContent = (props) => {
  const [form] = Form.useForm();
  const { dispatch, listDomain, userName, loadingGetListDomain, next, emailDomain } = props;
  const [validate, setValidate] = useState({ validateStatus: 'success', errorMsg: null });

  useEffect(() => {
    dispatch({
      type: 'onboard/fetchListDomain',
    });
    dispatch({
      type: 'adminSetting/getDomain',
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ userName });
  }, [userName]);

  const onSaveRedux = (result) => {
    dispatch({
      type: 'onboard/saveJoiningFormalities',
      payload: result,
    });
  };

  const onFinish = async (value) => {
    const { userName: name = '', domain } = value;
    if (name) {
      const isExistingUserName = await dispatch({
        type: 'onboard/checkExistedUserName',
        payload: { userName: name },
      });
      if (isExistingUserName === false) {
        // const response = await dispatch({
        //   type: 'onboard/createEmployee',
        //   payload: { userName: name, candidateId },
        // });
        // const { statusCode = '' } = response;
        // if (statusCode === 200) onOk(value);
        onSaveRedux({ domain });
        next();
      } else setValidate({ validateStatus: 'error', errorMsg: 'That username is already taken' });
    } else setValidate({ validateStatus: 'error', errorMsg: 'Please input user name' });
  };

  return (
    <Form form={form} name="basic" id="usernameForm" onFinish={onFinish} layout="vertical">
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
        <Form.Item name="domain" label="Domain" className={styles.selectForm}>
          <Select
            placeholder="Domain"
            allowClear
            showArrow
            defaultActiveFirstOption
            loading={loadingGetListDomain}
            disabled={loadingGetListDomain}
          >
            <Select.Option key="primary" value={emailDomain}>
              <span>{emailDomain}</span>
              <Tag className={styles.primaryTag}>Primary</Tag>
            </Select.Option>
            {listDomain?.map((item) => (
              <Select.Option key={item._id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
};

export default connect(
  ({
    loading,
    adminSetting: { originData: { emailDomain = '' } = {} } = {},
    onboard: { joiningFormalities: { listDomain = [], userName = '' } } = {},
  }) => ({
    listDomain,
    emailDomain,
    userName,
    loadingGetListDomain: loading.effects['onboard/getEmployeeIdfetchListDomain'],
    loadingGetEmployeeId: loading.effects['onboard/getEmployeeId'],
    loadingCheckUserName: loading.effects['onboard/checkExistedUserName'],
    loadingCreateEmployee: loading.effects['onboard/createEmployee'],
  }),
)(UserNameContent);
