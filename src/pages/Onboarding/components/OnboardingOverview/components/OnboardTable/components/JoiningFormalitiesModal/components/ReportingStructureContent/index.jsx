import { Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const ReportingManagerContent = (props) => {
  const {
    dispatch,
    onFinish = () => {},
    loadingEmployeeList = false,
    managerList: employeeList = [],
  } = props;
  const [initialValue, setInitalValue] = useState({});

  useEffect(() => {
    dispatch({
      type: 'newCandidateForm/fetchManagerList',
      payload: {
        company: getCurrentCompany(),
        status: ['ACTIVE'],
        tenantId: getCurrentTenant(),
      },
    });
  }, []);

  return (
    <Form
      name="basic"
      id="reportingForm"
      onFinish={onFinish}
      layout="vertical"
      initialValues={initialValue}
    >
      <div className={styles.documentVerification}>
        <Form.Item
          name="reportingManager"
          label="Reporting Manager"
          // validateStatus={validate.validateStatus}
          // help={validate.errorMsg}
          // rules={[{ required: true, message: 'Please select reporting manager' }]}
          className={styles.selectForm}
        >
          <Select
            placeholder="Please select"
            allowClear
            showSearch
            loading={loadingEmployeeList}
            disabled={loadingEmployeeList}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {employeeList?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.generalInfo?.legalName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="reportees"
          label="Reportees"
          // validateStatus={validate.validateStatus}
          // help={validate.errorMsg}
          // rules={[{ required: true, message: 'Please select reportees' }]}
          className={styles.selectForm}
        >
          <Select
            placeholder="Please select"
            allowClear
            mode="multiple"
            checkable
            showSearch
            showArrow
            loading={loadingEmployeeList}
            disabled={loadingEmployeeList}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {employeeList?.map((item) => (
              <Select.Option key={item.id} value={item.generalInfo?.legalName}>
                {item.generalInfo?.legalName}
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
    newCandidateForm: {
      tempData: { managerList = [] },
    },
    loading,
  }) => ({
    managerList,
    loadingEmployeeList: loading.effects['newCandidateForm/fetchManagerList'],
  }),
)(ReportingManagerContent);
