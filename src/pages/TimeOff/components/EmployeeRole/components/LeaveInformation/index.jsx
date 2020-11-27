import React, { PureComponent } from 'react';
import { Row, Collapse, Tooltip, Progress } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import ShowBreakdownIcon from '@/assets/iconViewBreakdown.svg';
import { connect, history } from 'umi';
import LeaveProgressBar from './components/LeaveProgressBar';
import SpecialLeaveBox from './components/SpecialLeaveBox';

import styles from './index.less';

const { Panel } = Collapse;
const colorsList = ['#FF3397', '#2C6DF9', '#FFA100'];

const CollapseInformation = (props) => {
  const {
    typesOfCommonLeaves = [],
    typesOfSpecialLeaves = [],
    policyCommonLeaves = {},
    policySpecialLeaves = {},
  } = props;

  const renderPolicyLink = (policy) => {
    if (policy !== null) {
      if (Object.keys(policy).length !== 0) {
        const { key = '', _id = '' } = policy;
        return <a onClick={() => history.push(`/view-document/${_id}`)}>{key}</a>;
      }
    }
    return <a>Unknown file</a>;
  };

  return (
    <div className={styles.CollapseInformation}>
      <div className={styles.secondTitle}>
        <span className={styles.secondTitle__left}>Common Leaves</span>
        <div className={styles.secondTitle__right}>
          <span>Under </span>
          {renderPolicyLink(policyCommonLeaves)}
        </div>
      </div>
      <div className={styles.leaveProgressBars}>
        {typesOfCommonLeaves.map((type, index) => {
          const {
            currentAllowance = 0,
            defaultSettings: { name = '', baseAccrual: { time = 0 } = {} } = {},
          } = type;
          return (
            <LeaveProgressBar
              color={colorsList[index % 3]}
              title={name}
              shorten="CL"
              stepNumber={currentAllowance}
              limitNumber={time}
            />
          );
        })}
      </div>

      <div className={styles.secondTitle}>
        <span className={styles.secondTitle__left}>Special Leaves</span>
        <div className={styles.secondTitle__right}>
          <span>Under </span>
          {renderPolicyLink(policySpecialLeaves)}
        </div>
      </div>
      <Row>
        {typesOfSpecialLeaves.map((type, index) => {
          const { currentAllowance = 0, defaultSettings: { name = '' } = {} } = type;
          return (
            <SpecialLeaveBox
              color={colorsList[index % 3]}
              title={name}
              shorten="ML"
              days={currentAllowance}
            />
          );
        })}
      </Row>
    </div>
  );
};
@connect(({ timeOff }) => ({
  timeOff,
}))
class LeaveInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      remaining: 0,
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
    });
    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
    });
  };

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
        {show ? (
          <img src={ShowBreakdownIcon} className={styles.rotateIcon} alt="show-breakdown" />
        ) : (
          <img src={ShowBreakdownIcon} className={styles.defaultIcon} alt="show-breakdown" />
        )}
      </div>
    );
  };

  renderCircleProgress = (percentVal, value) => (
    <div className={styles.circleProgress}>
      <span className={styles.percentValue}>{value}</span>
      <p className={styles.remainingText}>Remaining</p>
    </div>
  );

  calculateValueForCircleProgress = (typesOfCommonLeaves, typesOfSpecialLeaves) => {
    let remaining = 0;
    let total = 0;

    typesOfCommonLeaves.forEach((type) => {
      const {
        currentAllowance = 0,
        defaultSettings: { baseAccrual: { time = 0 } = {} } = {},
      } = type;
      remaining += currentAllowance;
      total += time;
    });

    typesOfSpecialLeaves.forEach((type) => {
      const {
        currentAllowance = 0,
        defaultSettings: { baseAccrual: { time = 0 } = {} } = {},
      } = type;
      remaining += currentAllowance;
      total += time;
    });

    this.setState({
      remaining,
    });
    return Math.round((remaining / total) * 100);
  };

  render() {
    const { remaining } = this.state;
    const {
      onInformationCLick = () => {},
      timeOff: { totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {} } = {},
    } = this.props;
    const {
      timeOffTypes: typesOfCommonLeaves = [],
      policy: policyCommonLeaves = {},
    } = commonLeaves;
    const {
      timeOffTypes: typesOfSpecialLeaves = [],
      policy: policySpecialLeaves = {},
    } = specialLeaves;

    const percent = this.calculateValueForCircleProgress(typesOfCommonLeaves, typesOfSpecialLeaves);

    return (
      <div className={styles.LeaveInformation}>
        <div className={styles.totalLeaveBalance}>
          <span className={styles.title}>Total Leave Balance</span>
          <div className={styles.leaveBalanceBox}>
            <Progress
              type="circle"
              strokeColor="#FFA100"
              trailColor="#EAE7E3"
              percent={percent}
              format={(percentVal) => this.renderCircleProgress(percentVal, remaining)}
            />
          </div>
          <Collapse onChange={this.handleShow} bordered={false} defaultActiveKey={['']}>
            <Panel showArrow={false} header={this.renderHeader()} key="1">
              <CollapseInformation
                typesOfCommonLeaves={typesOfCommonLeaves}
                typesOfSpecialLeaves={typesOfSpecialLeaves}
                policyCommonLeaves={policyCommonLeaves}
                policySpecialLeaves={policySpecialLeaves}
              />
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

export default LeaveInformation;
