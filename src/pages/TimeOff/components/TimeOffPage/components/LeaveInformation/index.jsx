import React, { PureComponent } from 'react';
import { Row, Collapse } from 'antd';
import { InfoCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import LeaveProgressBar from './components/LeaveProgressBar';
import SpecialLeaveBox from './components/SpecialLeaveBox';

import styles from './index.less';

const { Panel } = Collapse;

const CollapseInformation = () => {
  return (
    <div className={styles.CollapseInformation}>
      <div className={styles.title}>
        <span className={styles.title__left}>Common Leaves</span>
        <div className={styles.title__right}>
          <span>Under </span>
          <a>Standard Policy</a>
        </div>
      </div>
      <div className={styles.leaveProgressBars}>
        <LeaveProgressBar
          color="#FF3397"
          title="Casual Leave"
          shorten="CL"
          stepNumber={12}
          limitNumber={12}
        />
        <LeaveProgressBar
          color="#2C6DF9"
          title="Sick Leave"
          shorten="SL"
          stepNumber={4}
          limitNumber={6}
        />
        <LeaveProgressBar
          color="#FFA100"
          title="Compensation Leave"
          shorten="CO"
          stepNumber={1}
          limitNumber={1}
        />
      </div>

      <div className={styles.title}>
        <span className={styles.title__left}>Special Leaves</span>
        <div className={styles.title__right}>
          <span>Under </span>
          <a>Terralogic Fulltime Policy</a>
        </div>
      </div>

      <Row>
        <SpecialLeaveBox color="#FFA100" title="Maternity Leave" shorten="ML" days={90} />
        <SpecialLeaveBox color="#FF3397" title="Bereavement Leave" shorten="BL" days={7} />
        <SpecialLeaveBox color="#2C6DF9" title="Restricted Holiday" shorten="RH" days={1} />
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
    return (
      <div className={styles.LeaveInformation}>
        <div className={styles.totalLeaveBalance}>
          <span className={styles.title}>Total Leave Balance</span>
          <div className={styles.leaveBalanceBox}>
            <span className={styles.text1}>23</span>
            <span className={styles.text2}>Remaining out of</span>
            <span className={styles.text3}>25</span>
          </div>
          <Collapse onChange={this.handleShow} bordered={false} defaultActiveKey={['']}>
            <Panel showArrow={false} header={this.renderHeader()} key="1">
              <CollapseInformation />
            </Panel>
          </Collapse>
        </div>
        <div className={styles.infoIcon}>
          <InfoCircleOutlined />
        </div>
      </div>
    );
  }
}
