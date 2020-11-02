import React, { PureComponent, useState } from 'react';
import { Row, Collapse, Tooltip } from 'antd';
import { InfoCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import LeaveProgressBar from './components/LeaveProgressBar';
import SpecialLeaveBox from './components/SpecialLeaveBox';

import styles from './index.less';

const { Panel } = Collapse;

const mockData = {
  totalLeaveDay: 25,
  remainingLeaveDay: 23,
  casualLeave: {
    stepNumber: 12,
    limitNumber: 12,
  },
  sickLeave: {
    stepNumber: 4,
    limitNumber: 6,
  },
  compensationLeave: {
    stepNumber: 1,
    limitNumber: 1,
  },
  maternityLeaveNumber: 90,
  bereavementLeaveNumber: 7,
  restrictedHolidayNumber: 1,
};

const CollapseInformation = (props) => {
  const { data = {} } = props;
  return (
    <div className={styles.CollapseInformation}>
      <div className={styles.secondTitle}>
        <span className={styles.secondTitle__left}>Common Leaves</span>
        <div className={styles.secondTitle__right}>
          <span>Under </span>
          <a>Standard Policy</a>
        </div>
      </div>
      <div className={styles.leaveProgressBars}>
        <LeaveProgressBar
          color="#FF3397"
          title="Casual Leave"
          shorten="CL"
          stepNumber={data.casualLeave.stepNumber}
          limitNumber={data.casualLeave.limitNumber}
        />
        <LeaveProgressBar
          color="#2C6DF9"
          title="Sick Leave"
          shorten="SL"
          stepNumber={data.sickLeave.stepNumber}
          limitNumber={data.sickLeave.limitNumber}
        />
        <LeaveProgressBar
          color="#FFA100"
          title="Compensation Leave"
          shorten="CO"
          stepNumber={data.compensationLeave.stepNumber}
          limitNumber={data.compensationLeave.limitNumber}
        />
      </div>

      <div className={styles.secondTitle}>
        <span className={styles.secondTitle__left}>Special Leaves</span>
        <div className={styles.secondTitle__right}>
          <span>Under </span>
          <a>Terralogic Fulltime Policy</a>
        </div>
      </div>
      <Row>
        <SpecialLeaveBox
          color="#FFA100"
          title="Maternity Leave"
          shorten="ML"
          days={data.maternityLeaveNumber}
        />
        <SpecialLeaveBox
          color="#FF3397"
          title="Bereavement Leave"
          shorten="BL"
          days={data.bereavementLeaveNumber}
        />
        <SpecialLeaveBox
          color="#2C6DF9"
          title="Restricted Holiday"
          shorten="RH"
          days={data.restrictedHolidayNumber}
        />
      </Row>
    </div>
  );
};
export default class LeaveInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleShow = () => {
    const { show } = this.state;
    this.setState({
      show: !show,
    });
  };

  renderHeader = () => {
    const { show } = this.state;
    return (
      <div className={styles.showBtn}>
        <span>View Leave breakdown</span>
        {show ? <UpOutlined /> : <DownOutlined />}
      </div>
    );
  };

  render() {
    const { onInformationCLick = () => {} } = this.props;
    return (
      <div className={styles.LeaveInformation}>
        <div className={styles.totalLeaveBalance}>
          <span className={styles.title}>Total Leave Balance</span>
          <div className={styles.leaveBalanceBox}>
            <span className={styles.text1}>{`0${mockData.remainingLeaveDay}`.slice(-2)}</span>
            <span className={styles.text2}>Remaining out of</span>
            <span className={styles.text3}>{`0${mockData.totalLeaveDay}`.slice(-2)}</span>
          </div>
          <Collapse onChange={this.handleShow} bordered={false} defaultActiveKey={['']}>
            <Panel showArrow={false} header={this.renderHeader()} key="1">
              <CollapseInformation data={mockData} />
            </Panel>
          </Collapse>
        </div>
        <Tooltip title="More information">
          <div onClick={onInformationCLick} className={styles.infoIcon}>
            <InfoCircleOutlined />
          </div>
        </Tooltip>
      </div>
    );
  }
}
