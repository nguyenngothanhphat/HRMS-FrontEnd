import { Form, Input, Select } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const UserNameContent = (props) => {
  const { dispatch, listDomain, userName } = props;
  const [initialValue, setInitalValue] = useState({});
  const [validate, setValidate] = useState({ validateStatus: 'success', errorMsg: null });

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
        // const response = await dispatch({
        //   type: 'onboard/createEmployee',
        //   payload: { userName: name, candidateId },
        // });
        // const { statusCode = '' } = response;
        // if (statusCode === 200) onOk(value);
      } else setValidate({ validateStatus: 'error', errorMsg: 'That username is already taken' });
    } else setValidate({ validateStatus: 'error', errorMsg: 'Please input user name' });
  };

  return (
    <Form
      name="basic"
      id="usernameForm"
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValue}
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
        <Form.Item name="domain" label="Domain" className={styles.selectForm}>
          <Select
            placeholder="Domain"
            allowClear
            showSearch
            showArrow
            // loading={loadingEmployeeList}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {listDomain?.map((item) => (
              <Select.Option key={item.id} value={item.generalInfo?.legalName}>
                {/* {item.generalInfo?.legalName} */}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Form>
  );
};

export default connect(
  ({ loading, onboard: { joiningFormalities: { listDomain = [], userName = '' } } = {} }) => ({
    listDomain,
    userName,
    loadingGetEmployeeId: loading.effects['onboard/getEmployeeId'],
    loadingCheckUserName: loading.effects['onboard/checkExistedUserName'],
    loadingCreateEmployee: loading.effects['onboard/createEmployee'],
  }),
)(UserNameContent);
