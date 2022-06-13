import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import CommonModal from '@/components/CommonModal';
import { getCurrentTenant } from '@/utils/authority';
import edit from './asset/edit.svg';
import path from './asset/path.svg';
import CurrentInfo from './components/CurrentInfo';
import EditCurrentInfo from './components/EditCurrentInfo';
import EmploymentHistoryTable from './components/EmploymentHistoryTable';
import HandleChanges from './components/HandleChanges';
import styles from './index.less';

const EmploymentTab = (props) => {
  const {
    dispatch,
    listEmployeeActive,
    permissions = {},
    profileOwner = false,
    employeeProfile = {},
    dataOrgChart: { employees: reportees = [], manager = {} },
  } = props;

  const {
    originData: { generalData = {}, employmentData = {}, compensationData = {} } = {},
    isUpdateEmployment = false,
    employee = '',
  } = employeeProfile;

  const { title = {}, location = {}, department = {}, employeeType = {} } = employmentData || {};

  const { firstName = '', legalName = '' } = generalData || {};
  const { compensationType = '', currentAnnualCTC = '' } = compensationData || {};

  const [isChanging, setIsChanging] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState(0);
  const [currentData, setCurrentData] = useState({});
  const [changedData, setChangedData] = useState({});

  const visibleSuccess = employeeProfile ? employeeProfile.visibleSuccess : false;

  const fetchData = () => {
    dispatch({ type: 'employeeProfile/fetchChangeHistories', payload: { employee } });
    dispatch({
      type: 'employeeProfile/fetchEmployeeTypes',
    });
    dispatch({
      type: 'employeeProfile/fetchDepartments',
    });
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { employee },
    });
  };

  useEffect(() => {
    if (isUpdateEmployment) {
      setIsEdit(false);
    }
  }, []);

  useEffect(() => {
    if (employee) {
      fetchData();
    }
  }, [employee]);

  useEffect(() => {
    if (employee) {
      const listIdEmployees = reportees.map((emp) => emp._id);
      setCurrentData({
        name: legalName || firstName || null,
        title: title?._id || null,
        compensationType: compensationType || null,
        location: location?._id || null,
        department: department?._id || null,
        manager: manager?._id || null,
        reportees: listIdEmployees || [],
        employeeType: employeeType?._id || null,
        currentAnnualCTC: currentAnnualCTC || null,
      });
    }
  }, [employee, reportees]);

  const handleMakeChanges = async () => {
    setCurrent(0);
    setIsChanging(!isChanging);
  };

  const handleEditCurrentInfo = () => {
    setIsEdit(!isEdit);
  };

  const handleSubmit = async (data) => {
    let takeEffect = '';
    if (data.stepOne === 'Now') {
      takeEffect = 'UPDATED';
    } else if (Date.parse(data.stepOne) < Date.now()) {
      takeEffect = 'UPDATED';
    } else takeEffect = 'WILL_UPDATE';
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
      effectiveDate: data.stepOne === 'Now' ? new Date() : data.stepOne,
      changeDate: new Date(),
      takeEffect,
      id: data.employee,
      employee: data.employee,
      changedBy: data.changedBy,
      tenantId: getCurrentTenant(),
    };
    const array = Object.keys(payload);
    for (let i = 0; i < array.length; i += 1) {
      if (payload[array[i]] === null || payload[array[i]] === undefined) delete payload[array[i]];
    }
    await dispatch({
      type: 'employeeProfile/updateEmployment',
      payload,
    });
    await dispatch({ type: 'employeeProfile/addNewChangeHistory', payload });
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

  const handleCancelModelSuccess = () => {
    dispatch({
      type: 'employeeProfile/save',
      payload: { visibleSuccess: false },
    });
    setIsEdit(false);
  };

  return (
    <div>
      <div className={styles.employmentTab}>
        <div className={styles.employmentTab__title}>
          <span className={styles.title}>Employment Details</span>
          {isEdit ? (
            <div style={{ display: 'flex', alignItems: 'center' }} />
          ) : (
            permissions.editEmployment !== -1 && (
              <div
                className={styles.employmentTab__action}
                onClick={handleEditCurrentInfo}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <img alt="" src={edit} />
                <span className={styles.editBtn}>Edit</span>
              </div>
            )
          )}
        </div>
        {isEdit ? (
          <EditCurrentInfo
            handleCancel={handleEditCurrentInfo}
            listEmployeeActive={listEmployeeActive}
            profileOwner={profileOwner}
          />
        ) : (
          <CurrentInfo isChanging={isChanging} dispatch={dispatch} data={currentData} />
        )}
      </div>
      <div className={styles.employmentTab}>
        <div className={styles.employmentTab__title} align="middle">
          <span className={styles.title}>
            {isChanging ? `Edit Employment` : 'Employment History'}
          </span>
          {isChanging ? (
            <div onClick={handleMakeChanges} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          ) : (
            permissions.makeChangesHistory !== -1 && (
              <div
                className={styles.employmentTab__action}
                onClick={handleMakeChanges}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <img alt="" src={edit} />
                <span className={styles.editBtn}>Make changes</span>
              </div>
            )
          )}
        </div>
        {isChanging ? (
          <HandleChanges
            nextTab={nextTab}
            isChanging={isChanging}
            data={currentData}
            current={current}
            setChangedData={setChangedData}
          />
        ) : (
          <EmploymentHistoryTable />
        )}
        {isChanging ? (
          <div className={styles.footer}>
            <div>{current + 1}/7 steps</div>
            <div className={styles.buttons}>
              <Button onClick={previousTab} type="text">
                {current > 0 ? 'Back' : null}
              </Button>
              <Button onClick={nextTab} type="primary">
                {current === 6 ? 'Submit' : 'Continue'}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <CommonModal
        width={550}
        visible={visibleSuccess}
        hasFooter={false}
        onClose={handleCancelModelSuccess}
        onFinish={handleCancelModelSuccess}
        hasHeader={false}
        content={
          <>
            <div style={{ textAlign: 'center' }}>
              <img src={imageAddSuccess} alt="update success" />
            </div>
            <br />
            <br />
            <p style={{ textAlign: 'center', color: '#707177', fontWeight: 500 }}>
              Update information successfully
            </p>
            <div className={styles.spaceFooterModalSuccess}>
              <Button onClick={handleCancelModelSuccess} className={styles.btnOkModalSuccess}>
                Okay
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default connect(
  ({
    employeeProfile,
    employee: { dataOrgChart = {} },
    user: { permissions, currentUser = {} },
  }) => ({
    employeeProfile,
    currentUser,
    permissions,
    dataOrgChart,
  }),
)(EmploymentTab);
