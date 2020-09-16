import React, { PureComponent } from 'react';
import { Button, div } from 'antd';
import { EditOutlined } from '@ant-design/icons';
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

class EmploymentTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChanging: false,
      current: 0,
      currentData: {
        title: 'UX Lead',
        joiningDate: '10th December 2018',
        location: 'Bengaluru, India',
        employType: 'Full Time Employee',
        compenType: 'Salaried',
        annualSalary: '$75000',
        manager: 'Anil Reddy',
        timeOff: '20 Day PTO Applicable',
      },
    };
  }

  handleMakeChanges = () => {
    const { isChanging } = this.state;
    this.setState({ isChanging: !isChanging });
  };

  // handleOk = () => {
  //   this.nextTab();
  // };

  handleChangeHistory = () => {
    this.setState({
      isChanging: true,
    });
  };

  nextTab = () => {
    const { current } = this.state;
    this.setState({ current: current + 1 });
  };

  previousTab = () => {
    const { current } = this.state;
    this.setState({ current: current - 1 });
  };

  // onChangeSteps = (current) => {
  //   this.setState({ current });
  // };

  render() {
    const { isChanging, current, currentData } = this.state;
    return (
      <div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title}>
            <div>Employment & Compensation {isChanging ? `- ${steps[current].title}` : null}</div>

            {isChanging ? (
              <div onClick={this.handleMakeChanges}>Cancel & Return</div>
            ) : (
              <div onClick={this.handleMakeChanges}>Make changes</div>
            )}
          </div>
          {isChanging ? <HandleChanges current={current} /> : <CurrentInfo data={currentData} />}
          {isChanging ? (
            <div className={styles.footer}>
              <div>{current + 1}/5 steps</div>
              <div className={styles.buttons}>
                <Button onClick={this.previousTab} type="text">
                  {current > 0 ? 'Back' : null}
                </Button>
                <Button onClick={this.nextTab} type="primary">
                  Continue
                </Button>
              </div>
            </div>
          ) : null}
        </div>
        <div className={styles.employmentTab}>
          <div className={styles.employmentTab_title} align="middle">
            <div>Change History</div>
            <div className={styles.employmentTab_changeIcon}>
              <EditOutlined
                className={styles.employmentTab_iconEdit}
                onClick={this.handleChangeHistory}
              />
            </div>
          </div>
          <ChangeHistoryTable />
        </div>
      </div>
    );
  }
}

export default EmploymentTab;
