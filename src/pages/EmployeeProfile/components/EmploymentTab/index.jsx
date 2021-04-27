/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Button, div } from 'antd';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
// import { checkPermissions } from '@/utils/permissions';
import edit from './asset/edit.svg';
import path from './asset/path.svg';
import CurrentInfo from './components/CurrentInfo';
import HandleChanges from './components/HandleChanges';
import ChangeHistoryTable from './components/ChangeHistoryTable';
import EditCurrentInfo from './components/EditCurrentInfo';
import styles from './index.less';

const steps = [
  { title: 'Effective Date', content: 'Effective Date' },
  { title: 'Compensation Details', content: 'Compensation Details' },
  { title: 'Work Group', content: 'Work Group' },
  { title: 'Who to Notify', content: 'Who to Notify' },
  { title: 'Review Changes', content: 'Review Changes' },
];

@connect(({ employeeProfile, user: { currentUser = {} } }) => ({
  employeeProfile,
  currentUser,
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

    const { title = {}, location = {} } = employeeProfile?.originData?.employmentData;
    const { firstName = '', legalName = '' } = employeeProfile?.originData?.generalData;
    const { compensationType = null } = employeeProfile?.originData?.compensationData;
    this.setState({
      currentData: {
        name: legalName || firstName || null,
        title: title?.name || null,
        compensationType: compensationType || null,
        location: location?.name || null,
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
        location: data.stepTwo.wLocation || null,
        employeeType: data.stepTwo.employment || null,
        department: data.stepThree.department || null,
        compensationType: `${data.stepTwo.compensation || null} - ${
          data.stepTwo.compensationType || null
        }`,
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
    } else if (current === 4) {
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

  render() {
    const { isChanging, current, currentData, isEdit } = this.state;
    const {
      dispatch,
      currentUser: {
        // roles = [],
        permissions = {},
      },
    } = this.props;
    // const permissions = checkPermissions(roles);
    return (
      <div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab__title}>
            <span className={styles.title}>Employment & Compensation</span>
            {isEdit ? (
              <div style={{ display: 'flex' }} />
            ) : (
              permissions.editEmployment !== -1 && (
                <div
                  className={styles.employmentTab__action}
                  onClick={this.handleEditCurrentInfo}
                  style={{ display: 'flex' }}
                >
                  <img alt="" src={edit} />
                  <span className={styles.editBtn}>Edit</span>
                </div>
              )
            )}
          </div>
          {isEdit ? (
            <EditCurrentInfo handleCancel={this.handleEditCurrentInfo} />
          ) : (
            <CurrentInfo isChanging={isChanging} dispatch={dispatch} data={currentData} />
          )}
        </div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab__title} align="middle">
            <span className={styles.title}>
              {isChanging
                ? `Employment & Compensation - ${steps[current].title}`
                : 'Change History'}
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
            <ChangeHistoryTable />
          )}
          {isChanging ? (
            <div className={styles.footer}>
              <div>{current + 1}/5 steps</div>
              <div className={styles.buttons}>
                <Button onClick={this.previousTab} type="text">
                  {current > 0 ? 'Back' : null}
                </Button>
                <Button onClick={this.nextTab} type="primary">
                  {current === 4 ? 'Submit' : 'Continue'}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default EmploymentTab;
