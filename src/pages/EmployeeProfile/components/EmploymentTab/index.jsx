/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
// import { checkPermissions } from '@/utils/permissions';
import edit from './asset/edit.svg';
import path from './asset/path.svg';
import CurrentInfo from './components/CurrentInfo';
import HandleChanges from './components/HandleChanges';
import EmploymentHistoryTable from './components/EmploymentHistoryTable';
import EditCurrentInfo from './components/EditCurrentInfo';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import styles from './index.less';
import CommonModal from '@/components/CommonModal';

@connect(({ employeeProfile, user: { permissions, currentUser = {} } }) => ({
  employeeProfile,
  currentUser,
  permissions,
}))
class EmploymentTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChanging: false,
      isEdit: false,
      submitted: false,
      current: 0,
      currentData: {},
    };
  }

  componentDidMount = () => {
    const { employeeProfile = {} } = this.props;

    const {
      title = {},
      location = {},
      department = {},
      manager = {},
      employeeType = {},
    } = employeeProfile?.originData?.employmentData || {};
    const { firstName = '', legalName = '' } = employeeProfile?.originData?.generalData || {};
    const { compensationType = '', currentAnnualCTC = '' } =
      employeeProfile?.originData?.compensationData || {};
    this.setState({
      currentData: {
        name: legalName || firstName || null,
        title: title?._id || null,
        compensationType: compensationType || null,
        location: location?._id || null,
        department: department?._id || null,
        manager: manager?._id || null,
        reportees: manager?.reportees || [],
        employeeType: employeeType?._id || null,
        currentAnnualCTC: currentAnnualCTC || null,
      },
    });
  };

  static getDerivedStateFromProps(props) {
    const {
      employeeProfile: { isUpdateEmployment = false },
    } = props;

    if (isUpdateEmployment) {
      return {
        isEdit: false,
      };
    }

    return null;
  }

  handleMakeChanges = async () => {
    const { isChanging } = this.state;
    this.setState({ current: 0 });
    this.setState({ isChanging: !isChanging });
    this.setState({ submitted: false });
  };

  handleEditCurrentInfo = () => {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  };

  handleSubmit = async (data) => {
    const { submitted } = this.state;
    if (submitted) {
      const { dispatch } = this.props;
      let takeEffect = '';
      if (data.stepOne === 'Now') {
        takeEffect = 'UPDATED';
      } else if (Date.parse(data.stepOne) < Date.now()) {
        takeEffect = 'UPDATED';
      } else takeEffect = 'WILL_UPDATE';
      const payload = {
        title: data.stepThree.title || null,
        manager: data.stepThree.reportTo || null,
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
        employee: data.employee,
        changedBy: data.changedBy,
        tenantId: getCurrentTenant(),
      };
      const array = Object.keys(payload);
      for (let i = 0; i < array.length; i += 1) {
        if (payload[array[i]] === null || payload[array[i]] === undefined) delete payload[array[i]];
      }
      dispatch({ type: 'employeeProfile/addNewChangeHistory', payload });
    }
  };

  nextTab = (msg) => {
    const { current } = this.state;
    if (msg === 'STOP') {
      this.setState({ current: 0 });
    } else if (current === 6) {
      this.setState({ submitted: true });
      this.setState({ current: 0 });
      this.setState({ isChanging: false });
    } else if (msg === 'TITLE_REQUIRED') {
      this.setState({ current: 2 });
    } else this.setState({ current: current + 1 });
  };

  previousTab = () => {
    const { current } = this.state;
    this.setState({ current: current - 1 });
  };

  handleCancelModelSuccess = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/save',
      payload: { visibleSuccess: false },
    });
  };

  render() {
    const { employeeProfile } = this.props;
    const visibleSuccess = employeeProfile ? employeeProfile.visibleSuccess : false;
    const { isChanging, current, currentData, isEdit } = this.state;
    const { dispatch, listEmployeeActive, permissions = {}, profileOwner = false } = this.props;

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
                  onClick={this.handleEditCurrentInfo}
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
              handleCancel={this.handleEditCurrentInfo}
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
              <div onClick={this.handleMakeChanges} className={styles.cancelButton}>
                <img alt="" src={path} />
                <span className={styles.editBtn}>Cancel & Return</span>
              </div>
            ) : (
              permissions.makeChangesHistory !== -1 && (
                <div
                  className={styles.employmentTab__action}
                  onClick={this.handleMakeChanges}
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
              nextTab={this.nextTab}
              isChanging={isChanging}
              onSubmit={this.handleSubmit}
              data={currentData}
              current={current}
            />
          ) : (
            <EmploymentHistoryTable />
          )}
          {isChanging ? (
            <div className={styles.footer}>
              <div>{current + 1}/7 steps</div>
              <div className={styles.buttons}>
                <Button onClick={this.previousTab} type="text">
                  {current > 0 ? 'Back' : null}
                </Button>
                <Button onClick={this.nextTab} type="primary">
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
          onClose={this.handleCancelModelSuccess}
          onFinish={this.handleCancelModelSuccess}
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
                <Button
                  onClick={this.handleCancelModelSuccess}
                  className={styles.btnOkModalSuccess}
                >
                  Okay
                </Button>
              </div>
            </>
          }
        />
      </div>
    );
  }
}

export default EmploymentTab;
