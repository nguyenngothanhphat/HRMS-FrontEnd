import { Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const ReportingManagerContent = (props) => {
  const {
    dispatch,
    loadingEmployeeList = false,
    managerList: employeeList = [],
    reportingManager: manager,
    reportees: employee,
    candidateId,
    rookieId,
  } = props;
  const [form] = Form.useForm();
  // const [arr, setArr] = useState(employeeList);
  const [selectedManager, setSelectedManager] = useState(null);

  const onValuesChange = (changedValues, allValues) => {
    const { reportingManager = '', reportees = [] } = allValues;
    setSelectedManager(reportingManager);
    // const removeManagerSelected = employeeList.filter(
    //   (x) => !!reportingManager && x._id !== reportingManager,
    // );
    // // const removePreporteeSelected = employeeList.filter(
    // //   (x) => x._id !== reportees.find((a) => a === x._id),
    // // );
    // setArr(removeManagerSelected);
    // // !!reportees && setArr(removePreporteeSelected);
  };

  useEffect(() => {
    dispatch({
      type: 'newCandidateForm/fetchManagerList',
      payload: {
        company: getCurrentCompany(),
        status: ['ACTIVE'],
        tenantId: getCurrentTenant(),
      },
    });
    form.setFieldsValue({
      reportingManager: manager?._id,
      // reportees: employee?.map((e) => e._id),
    });
  }, []);

  // useEffect(() => {
  //   setArr(employeeList);
  // }, [employeeList]);

  useEffect(() => {
    setSelectedManager(null);
  }, []);

  const onFinish = async (value) => {
    const { reportingManager, reportees } = value;
    const response = await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        reportingManager,
        reportees,
        candidate: candidateId,
        tenantId: getCurrentTenant(),
      },
    });
    const { statusCode = '' } = response;
    if (statusCode === 200) {
      dispatch({
        type: 'newCandidateForm/fetchCandidateByRookie',
        payload: { tenantId: getCurrentTenant(), rookieID: rookieId },
      });
    }
  };

  return (
    <Form
      form={form}
      name="reportingForm"
      id="reportingForm"
      onFinish={onFinish}
      layout="vertical"
      onValuesChange={onValuesChange}
    >
      <div className={styles.documentVerification}>
        <Form.Item
          name="reportingManager"
          label="Reporting Manager"
          // validateStatus={validate.validateStatus}
          // help={validate.errorMsg}
          rules={[{ required: true, message: 'Please select reporting manager' }]}
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
              <Select.Option key={item._id} value={item._id}>
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
          rules={[{ required: true, message: 'Please select reportees' }]}
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
            {employeeList
              .filter((x) => x._id !== selectedManager)
              .map((item) => (
                <Select.Option key={item._id} value={item._id}>
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
      rookieId = '',
      tempData: { managerList = [], reportingManager = {}, reportees = [], _id: candidateId = '' },
    },
    loading,
  }) => ({
    managerList,
    rookieId,
    reportingManager,
    reportees,
    candidateId,
    loadingEmployeeList: loading.effects['newCandidateForm/fetchManagerList'],
  }),
)(ReportingManagerContent);
