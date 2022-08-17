import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DebounceSelect from '@/components/DebounceSelect';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const ReportingManagerContent = (props) => {
  const {
    dispatch,
    reportingManager: manager = {},
    reportees: employee = [],
    candidateId = '',
    rookieId = '',
    currentStep = '',
    dateOfJoining = '',
    listEmployeeByIds = [],
  } = props;

  const [form] = Form.useForm();
  const [selectedManager, setSelectedManager] = useState(manager?._id);
  const listTemp = [...employee, manager];
  const listId = listTemp.map((x) => x._id);
  const defaultManagerList = listEmployeeByIds.map((x) => {
    return { value: x._id, label: x.generalInfoInfo?.legalName };
  });
  const defaultReporteeList = listEmployeeByIds
    .filter((x) => x._id !== manager?._id)
    .map((x) => ({ value: x._id, label: x.generalInfoInfo?.legalName }));

  const onValuesChange = (changedValues, allValues) => {
    const { reportingManager = '' } = allValues;
    setSelectedManager(reportingManager);
  };

  useEffect(() => {
    if (manager || employee?.length)
      dispatch({
        type: 'onboarding/fetchListEmployeeByIds',
        payload: {
          ids: listId,
        },
      });
    form.setFieldsValue({
      reportingManager: manager?._id,
      reportees: employee?.map((a) => a?._id),
    });
  }, []);

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'newCandidateForm/fetchManagerList',
      payload: {
        company: getCurrentCompany(),
        status: ['ACTIVE'],
        tenantId: getCurrentTenant(),
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data
        .filter((x) => x._id !== selectedManager)
        .map((user) => ({
          label: user.generalInfo?.legalName,
          value: user._id,
        }));
    });
  };

  const onFinish = async (value) => {
    const { reportingManager, reportees } = value;
    const response = await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        dateOfJoining,
        currentStep,
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
          rules={[{ required: true, message: 'Please select the reporting manager' }]}
          className={styles.selectForm}
        >
          <DebounceSelect
            placeholder="Please select the manager"
            fetchOptions={onEmployeeSearch}
            defaultOptions={defaultManagerList}
            showSearch
          />
        </Form.Item>
        <Form.Item name="reportees" label="Reportees" className={styles.selectForm}>
          <DebounceSelect
            placeholder="Please select the reportees"
            fetchOptions={onEmployeeSearch}
            showSearch
            defaultOptions={defaultReporteeList}
            mode="multiple"
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default connect(
  ({
    newCandidateForm: {
      rookieId = '',
      tempData: {
        reportingManager = {},
        reportees = [],
        _id: candidateId = '',
        dateOfJoining = '',
      },
      currentStep = '',
    },
    onboarding: {
      joiningFormalities: { listEmployeeByIds = [] },
    },
  }) => ({
    listEmployeeByIds,
    dateOfJoining,
    currentStep,
    rookieId,
    reportingManager,
    reportees,
    candidateId,
  }),
)(ReportingManagerContent);
