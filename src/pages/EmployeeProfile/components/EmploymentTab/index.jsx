/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Button, div } from 'antd';
import { connect } from 'umi';
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

@connect(({ employeeProfile }) => ({
  employeeProfile,
}))
class EmploymentTab extends Component {
  constructor(props) {
    super(props);
    const { employeeProfile } = this.props;

    const { title, location } = employeeProfile.originData.employmentData;
    const { firstName, legalName } = employeeProfile.originData.generalData;
    const { currentAnnualCTC } = employeeProfile.originData.compensationData;
    this.state = {
      isChanging: false,
      isEdit: false,
      submitted: false,
      current: 0,
      currentData: {
        name: legalName || firstName || null,
        title: title?.name || null,
        annualSalary: currentAnnualCTC || 0,
        location: location?.name || null,
      },
    };
  }

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

  checkRoleEmployee = (roles) => {
    let flag = false;
    const { roles: rolesConst } = this.state;
    const checkRole = (obj) => obj._id === rolesConst.employee;
    if (roles.length === 1 && roles.some(checkRole)) {
      flag = true;
    }
    return flag;
  };

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
        title: data.stepTwo.title || null,
        manager: data.stepThree.reportTo || null,
        currentAnnualCTC: Number(data.stepTwo.salary) || null,
        location: data.stepTwo.wLocation || null,
        employeeType: data.stepTwo.employment || null,
        department: data.stepThree.department || null,
        compensationType: data.stepTwo.compensation || null,
        effectiveDate: data.stepOne === 'Now' ? new Date() : data.stepOne,
        changeDate: new Date(),
        takeEffect,
        employee: data.employee,
        changedBy: data.changedBy,
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
    const { dispatch } = this.props;
    return (
      <div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title}>
            <div>Employment & Compensation</div>
            {isEdit ? (
              <div style={{ display: 'flex' }} />
            ) : (
              <div onClick={this.handleEditCurrentInfo} style={{ display: 'flex' }}>
                <img alt="" src={edit} />
                <div>Edit</div>
              </div>
            )}
          </div>
          {isEdit ? (
            <EditCurrentInfo handleCancel={this.handleEditCurrentInfo} />
          ) : (
            <CurrentInfo isChanging={isChanging} dispatch={dispatch} data={currentData} />
          )}
        </div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title} align="middle">
            <div>
              {isChanging
                ? `Employment & Compensation - ${steps[current].title}`
                : 'Change History'}
            </div>
            {isChanging ? (
              <div onClick={this.handleMakeChanges} style={{ display: 'flex' }}>
                <img alt="" src={path} />
                <div>Cancel & Return</div>
              </div>
            ) : (
              <div onClick={this.handleMakeChanges} style={{ display: 'flex' }}>
                <img alt="" src={edit} />
                <div>Make changes</div>
              </div>
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
