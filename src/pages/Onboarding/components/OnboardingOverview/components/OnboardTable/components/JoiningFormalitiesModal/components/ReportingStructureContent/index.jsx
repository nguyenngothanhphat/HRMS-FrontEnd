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
    reportingManager,
    reportees,
  } = props;
  const [form] = Form.useForm();
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

  // useEffect(() => {
  //   form.setFieldsValue({ reportingManager, reportees });
  // }, [reportingManager, reportees]);

  return (
    <Form form={form} name="reportingForm" id="reportingForm" onFinish={onFinish} layout="vertical">
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
      reportingManager = {},
      reportees = [],
    },
    loading,
  }) => ({
    managerList,
    reportingManager,
    reportees,
    loadingEmployeeList: loading.effects['newCandidateForm/fetchManagerList'],
  }),
)(ReportingManagerContent);
