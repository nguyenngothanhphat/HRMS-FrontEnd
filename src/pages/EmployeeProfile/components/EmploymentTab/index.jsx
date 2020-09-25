import React, { PureComponent } from 'react';
import { Button, div } from 'antd';
import { dialog } from '@/utils/utils';
import { connect } from 'umi';
import moment from 'moment';
import edit from './asset/edit.svg';
import path from './asset/path.svg';
import CurrentInfo from './components/CurrentInfo';
import HandleChanges from './components/HandleChanges';
import ChangeHistoryTable from './components/ChangeHistoryTable';
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
class EmploymentTab extends PureComponent {
  constructor(props) {
    super(props);
    const { employeeProfile } = this.props;

    const {
      title,
      joinDate,
      location,
      employeeType,
      manager,
    } = employeeProfile.originData.employmentData;
    const { firstName } = employeeProfile.originData.generalData;
    const {
      compensationType,
      currentAnnualCTC,
      timeOffPolicy,
    } = employeeProfile.originData.compensationData;
    this.state = {
      isChanging: false,
      current: 0,
      currentData: {
        name: firstName,
        title: title.name,
        joiningDate: moment(joinDate).locale('en').format('Do MMMM YYYY'),
        location: location.name,
        employType: employeeType.name,
        compenType: compensationType || 'This person is missing payment method',
        annualSalary: currentAnnualCTC || 0,
        manager: manager.generalInfo.firstName,
        timeOff: timeOffPolicy || 'This person is not allowed to take time off',
      },
    };
  }

  handleMakeChanges = async () => {
    const { isChanging } = this.state;
    this.setState({ current: 0 });
    this.setState({ isChanging: !isChanging });
  };

  handleChangeHistory = () => {
    this.setState({
      isChanging: true,
    });
  };

  handleSubmit = (data) => {
    const { dispatch } = this.props;
    let takeEffect = '';
    if (data.stepOne === 'Now') {
      takeEffect = 'UPDATE_NOW';
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
      effectiveDate: data.stepOne === 'Now' ? new Date() : null,
      changeDate: new Date(),
      takeEffect,
      employee: data.employee || null,
      changedBy: data.changedBy || null,
    };
    const array = Object.keys(payload);
    for (let i = 0; i < array.length; i += 1) {
      if (payload[array[i]] === null || payload[array[i]] === undefined) delete payload[array[i]];
    }
    dispatch({ type: 'employeeProfile/addNewChangeHistory', payload });
  };

  nextTab = (msg) => {
    const { current } = this.state;
    if (msg === 'STOP') {
      this.setState({ current: 0 });
    } else if (current === 4) {
      this.setState({ current: 0 });
      this.setState({ isChanging: false });
    } else this.setState({ current: current + 1 });
  };

  previousTab = () => {
    const { current } = this.state;
    this.setState({ current: current - 1 });
  };

  render() {
    const { isChanging, current, currentData } = this.state;
    return (
      <div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title}>
            <div>Employment & Compensation {isChanging ? `- ${steps[current].title}` : null}</div>

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
            <CurrentInfo data={currentData} />
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
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title} align="middle">
            <div>Change History</div>
            <div className={styles.employmentTab_changeIcon} />
          </div>
          <ChangeHistoryTable />
        </div>
      </div>
    );
  }
}

export default EmploymentTab;
