import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { getCurrentTenant } from '@/utils/authority';
import path from './asset/path.svg';
import CurrentInfo from './components/CurrentInfo';
import EditCurrentInfo from './components/EditCurrentInfo';
import EmploymentHistoryTable from './components/EmploymentHistoryTable';
import HandleChanges from './components/HandleChanges';
import styles from './index.less';

const EmploymentTab = (props) => {
  const { dispatch, permissions = {}, employeeProfile = {}, loadingReportees = false } = props;

  const {
    employmentData = {},
    compensationData = {},
    employmentData: {
      title = {},
      location = {},
      department = {},
      employeeType = {},
      manager = {},
      reportees = [],
      generalInfo = {},
    } = {},
    employee = '',
    isProfileOwner = false,
  } = employeeProfile;

  const { firstName = '', legalName = '' } = generalInfo || {};
  const { compensationType = '', currentAnnualCTC = '' } = compensationData || {};

  const [isChanging, setIsChanging] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [current, setCurrent] = useState(0);
  const [currentData, setCurrentData] = useState({});
  const [changedData, setChangedData] = useState({});
  const [currentPayload, setCurrentPayload] = useState({});

  const fetchData = () => {
    dispatch({
      type: 'employeeProfile/fetchCompensation',
      payload: { employee },
    });
    dispatch({
      type: 'employeeProfile/fetchEmployeeTypes',
    });
    dispatch({
      type: 'employeeProfile/fetchDepartments',
    });
  };

  const fetchChangeHistories = (payload) => {
    setCurrentPayload(payload);
    dispatch({
      type: 'employeeProfile/fetchChangeHistories',
      payload,
    });
  };

  useEffect(() => {
    if (employee) {
      fetchData();
    }
  }, [employee]);

  useEffect(() => {
    if (employee) {
      setCurrentData({
        name: legalName || firstName || null,
        title: title?._id || null,
        compensationType: compensationType || null,
        location: location?._id || null,
        department: department?._id || null,
        manager: manager?._id || null,
        reportees: reportees.map((emp) => emp._id) || [],
        employeeType: employeeType?._id || null,
        currentAnnualCTC: currentAnnualCTC || null,
      });
    }
  }, [JSON.stringify(reportees), JSON.stringify(employmentData)]);

  const handleMakeChanges = async () => {
    setCurrent(0);
    setIsChanging(!isChanging);
  };

  const handleEditCurrentInfo = () => {
    setIsEdit(!isEdit);
  };

  const getChangesText = () => {
    const oldValues = {
      location: location.name,
      department: department.name,
      title: title.name,
      employeeType: employeeType.name,
      currentAnnualCTC,
      compensationType,
      manager: manager?.generalInfo?.legalName,
      reportees: currentData.reportees.length,
    };

    const newValues = {
      location: changedData.newLocation,
      department: changedData.newDepartment,
      title: changedData.newTitle,
      employeeType: changedData.newEmploymentType,
      currentAnnualCTC: changedData.stepFour.currentAnnualCTC,
      compensationType: changedData.stepFour.compensationType,
      manager: changedData.newManager,
      reportees: changedData.stepThree.reportees.length,
    };

    const getText = (oldValue, newValue) => {
      if (oldValue !== newValue && newValue) {
        return `${oldValue || 'None'} => ${newValue}`;
      }
      return '';
    };

    const compensationTypeDetail = getText(oldValues.compensationType, newValues.compensationType);
    const departmentDetail = getText(oldValues.department, newValues.department);
    const managerDetail = getText(oldValues.manager, newValues.manager);
    const titleDetail = getText(oldValues.title, newValues.title);
    const reporteesDetail = getText(
      currentData.reportees.length,
      changedData.stepThree.reportees.length,
    );
    const locationDetail = getText(oldValues.location, newValues.location);
    const employeeTypeDetail = getText(oldValues.employeeType, newValues.employeeType);
    const annualCTCDetail = getText(oldValues.currentAnnualCTC, newValues.currentAnnualCTC);

    return {
      compensationTypeDetail,
      departmentDetail,
      managerDetail,
      titleDetail,
      reporteesDetail,
      locationDetail,
      employeeTypeDetail,
      annualCTCDetail,
    };
  };

  const handleSubmit = async (data) => {
    const payload = {
      title: data.stepThree.title || null,
      manager: data.stepThree.reportTo || null,
      managerBefore: data.stepThree.reportToBefore || null,
      reasonChange: data.stepSeven.reasonChange || '',
      reportees: data.stepThree.reportees || null,
      location: data.stepTwo.wLocation || null,
      employeeType: data.stepTwo.employment || null,
      department: data.stepTwo.department || null,
      compensationType: data.stepFour.compensationType || null,
      annualCTC: data.stepFour.currentAnnualCTC || null,
      notifyTo: data.stepFive.notifyTo || [],
      effectiveDate: data.stepOne.effectDate || Date.now(),
      changeDate: new Date(),
      id: employee,
      employee,
      changedBy: data.changedBy,
      tenantId: getCurrentTenant(),
      type: data.stepOne.type,

      // changed text
      ...getChangesText(),
    };
    const array = Object.keys(payload);
    for (let i = 0; i < array.length; i += 1) {
      if (payload[array[i]] === null || payload[array[i]] === undefined) delete payload[array[i]];
    }
    await dispatch({
      type: 'employeeProfile/patchEmployment',
      payload: {
        _id: employee,
        ...payload,
      },
    });
    dispatch({ type: 'employeeProfile/addNewChangeHistory', payload }).then((res) => {
      if (res.statusCode === 200) {
        fetchChangeHistories(currentPayload);
      }
    });
  };

  const nextTab = (msg) => {
    if (msg === 'STOP') {
      setCurrent(0);
      return;
    }
    if (current === 6) {
      setCurrent(0);
      setIsChanging(false);
      handleSubmit(changedData);
      return;
    }
    if (msg === 'TITLE_REQUIRED') {
      setCurrent(2);
      return;
    }

    setCurrent(current + 1);
  };

  const previousTab = () => {
    setCurrent(current - 1);
  };

  const options = () => {
    return isEdit ? (
      <div style={{ display: 'flex', alignItems: 'center' }} />
    ) : (
      permissions.editEmployment !== -1 && (
        <CustomEditButton onClick={handleEditCurrentInfo}>Edit</CustomEditButton>
      )
    );
  };

  const makeChanges = () => {
    return isChanging ? (
      <CustomEditButton onClick={handleMakeChanges} image={path}>
        Cancel & Return
      </CustomEditButton>
    ) : (
      permissions.makeChangesHistory !== -1 && (
        <CustomEditButton onClick={handleMakeChanges}>Make changes</CustomEditButton>
      )
    );
  };

  return (
    <div className={styles.PersonalInformation}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Employment Details" extra={options()}>
            <div className={styles.container}>
              {isEdit ? (
                <EditCurrentInfo
                  handleCancel={handleEditCurrentInfo}
                  isProfileOwner={isProfileOwner}
                />
              ) : (
                <CurrentInfo isChanging={isChanging} dispatch={dispatch} data={currentData} />
              )}
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={isChanging ? `Edit Employment` : 'Employment History'} extra={makeChanges()}>
            <Spin spinning={loadingReportees}>
              {isChanging ? (
                <HandleChanges
                  nextTab={nextTab}
                  isChanging={isChanging}
                  data={currentData}
                  current={current}
                  setChangedData={setChangedData}
                  isModified={isModified}
                  setIsModified={setIsModified}
                />
              ) : (
                <EmploymentHistoryTable fetchChangeHistories={fetchChangeHistories} />
              )}
              {isChanging ? (
                <div className={styles.footer}>
                  <div className={styles.step}>{current + 1}/7 steps</div>
                  <div className={styles.buttons}>
                    <CustomSecondaryButton onClick={previousTab}>
                      <span
                        style={{
                          color: '#ffa100',
                        }}
                      >
                        {current > 0 ? 'Back' : null}
                      </span>
                    </CustomSecondaryButton>
                    <CustomPrimaryButton onClick={nextTab} disabled={!isModified && current === 5}>
                      {current === 6 ? 'Submit' : 'Continue'}
                    </CustomPrimaryButton>
                  </div>
                </div>
              ) : null}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ employeeProfile, user: { permissions, currentUser = {} } }) => ({
  employeeProfile,
  currentUser,
  permissions,
}))(EmploymentTab);
