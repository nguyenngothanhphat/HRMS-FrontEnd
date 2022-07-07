import { Form, Input, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const UserNameContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    listDomain = [],
    userName = '',
    loadingGetListDomain = false,
    next = () => {},
    domain = '',
  } = props;
  const [validate, setValidate] = useState({ validateStatus: 'success', errorMsg: null });

  useEffect(() => {
    dispatch({
      type: 'onboard/fetchListDomain',
    });
    // dispatch({
    //   type: 'adminSetting/getDomain',
    // });
  }, []);

  useEffect(() => {
    form.setFieldsValue({ userName, domain });
  }, [userName, listDomain]);

  const onSaveRedux = (result) => {
    dispatch({
      type: 'onboard/saveJoiningFormalities',
      payload: result,
    });
  };

  const onFinish = async (value) => {
    const { userName: name = '', domain: domainName } = value;
    if (name) {
      const isExistingUserName = await dispatch({
        type: 'onboard/checkExistedUserName',
        payload: { userName: name },
      });
      if (isExistingUserName === false) {
        onSaveRedux({ domain: domainName });
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
        <Form.Item
          name="domain"
          label="Domain"
          className={styles.selectForm}
          rules={[{ required: true, message: 'Please select domain' }]}
        >
          <Select
            placeholder="Domain"
            allowClear
            showArrow
            defaultActiveFirstOption
            loading={loadingGetListDomain}
            disabled={loadingGetListDomain}
          >
            {listDomain?.map((item) => (
              <Select.Option key={item?._id} value={item?.name}>
                {item?.name}
                {item?.isPrimary && <Tag className={styles.primaryTag}>Primary</Tag>}
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
    onboard: { joiningFormalities: { listDomain = [], userName = '', domain = '' } } = {},
  }) => ({
    listDomain,
    userName,
    domain,
    loadingGetListDomain: loading.effects['onboard/fetchListDomain'],
    loadingGetEmployeeId: loading.effects['onboard/getEmployeeId'],
    loadingCheckUserName: loading.effects['onboard/checkExistedUserName'],
  }),
)(UserNameContent);
