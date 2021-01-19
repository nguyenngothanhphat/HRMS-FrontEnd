import React, { PureComponent, useState } from 'react';
import { Row, Col, Collapse, Tooltip, Progress } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import ShowBreakdownIcon from '@/assets/iconViewBreakdown.svg';
import { connect, history } from 'umi';
import ViewPolicyModal from '@/components/ViewPolicyModal';
import LeaveProgressBar from './components/LeaveProgressBar';
import SpecialLeaveBox from './components/SpecialLeaveBox';

import styles from './index.less';

const { Panel } = Collapse;
const colorsList = ['#2C6DF9', '#FD4546', '#6236FF'];
const colorsList1 = ['#2C6DF9', '#FFA100'];

const CollapseInformation = (props) => {
  const {
    typesOfCommonLeaves = [],
    typesOfSpecialLeaves = [],
    policyCommonLeaves = {},
    policySpecialLeaves = {},
  } = props;

  const [viewPolicyModal, setViewPolicyModal] = useState(false);

  const renderPolicyLink = (policy) => {
    if (policy !== null) {
      if (Object.keys(policy).length !== 0) {
        const {
          key = '',
          //  _id = ''
        } = policy;
        // return <a onClick={() => history.push(`/view-document/${_id}`)}>{key}</a>;
        return <a onClick={() => setViewPolicyModal(true)}>{key}</a>;
      }
    }
    return <a onClick={() => setViewPolicyModal(true)}>Standard Policy</a>;
  };

  return (
    <div className={styles.CollapseInformation}>
      <div className={styles.hrLine} />
      <div className={styles.container}>
        <div className={styles.secondTitle}>
          <span className={styles.secondTitle__left}>Common Leaves</span>
          <div className={styles.secondTitle__right}>
            <span>Under </span>
            {renderPolicyLink(policyCommonLeaves)}
          </div>
        </div>
        <div className={styles.leaveProgressBars}>
          {typesOfCommonLeaves.map((type, index) => {
            const { currentAllowance = 0, defaultSettings = {} } = type;
            if (defaultSettings !== null) {
              const {
                name = '',
                shortType = '',
                baseAccrual: { time = 0 } = {},
                type: type1 = '',
              } = defaultSettings;
              if (type1 === 'A') {
                return (
                  <div key={`${index + 1}`}>
                    <LeaveProgressBar
                      color={colorsList[index % 3]}
                      title={name}
                      shortType={shortType}
                      stepNumber={currentAllowance}
                      limitNumber={time}
                    />
                    {index + 1 !== typesOfCommonLeaves.length
                      ? typesOfCommonLeaves[index + 1].defaultSettings.type === 'A' && (
                      <div className={styles.hr} />
                        )
                      : ''}
                  </div>
                );
              }
            }
            return '';
          })}
        </div>
      </div>
      <div className={styles.hrLine} />
      <div className={styles.container}>
        <div className={styles.secondTitle}>
          <span className={styles.secondTitle__left}>Special Leaves</span>
          <div className={styles.secondTitle__right}>
            <span>Under </span>
            {renderPolicyLink(policySpecialLeaves)}
          </div>
        </div>
        <Row className={styles.leaveProgressBars}>
          {typesOfSpecialLeaves.map((type, index) => {
            const { currentAllowance = 0, defaultSettings = {} } = type;
            if (defaultSettings !== null) {
              const { name = '', shortType = '' } = defaultSettings;
              return (
                <Col key={`${index + 1}`} span={24}>
                  <SpecialLeaveBox
                    color={colorsList1[index % 2]}
                    title={name}
                    shortType={shortType}
                    days={currentAllowance}
                  />
                  {index + 1 !== typesOfSpecialLeaves.length && <div className={styles.hr} />}
                </Col>
              );
            }
            return '';
          })}
        </Row>
      </div>
      <ViewPolicyModal visible={viewPolicyModal} onClose={setViewPolicyModal} />
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
      percentMainCircle: 0,
    };
  }

  componentDidMount = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
    });
    // dispatch({
    //   type: 'timeOff/fetchLeaveRequestOfEmployee',
    // });
    const { timeOff: { totalLeaveBalance: { commonLeaves = {} } = {} } = {} } = this.props;
    const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;

    const percent = this.calculateValueForCircleProgress(typesOfCommonLeaves);

    setTimeout(() => {
      for (let i = 0; i < percent; i += 1) {
        setTimeout(() => {
          this.setState({
            percentMainCircle: i,
          });
        }, 0);
      }
    }, 500);
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

  calculateValueForCircleProgress = (typesOfCommonLeaves) => {
    let remaining = 0;
    let total = 0;
    let result = 0;

    typesOfCommonLeaves.forEach((type) => {
      const { currentAllowance = 0, defaultSettings = {} } = type;
      if (defaultSettings !== null) {
        const { type: type1 = '', baseAccrual: { time = 0 } = {} } = defaultSettings;
        if (type1 === 'A') {
          remaining += currentAllowance;
          total += time;
        }
        this.setState({
          remaining,
        });
        result = Math.round((remaining / total) * 100);
      }
    });
    return result;
  };

  render() {
    const { remaining, percentMainCircle } = this.state;
    const {
      onInformationClick = () => {},
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

    // this.calculateValueForCircleProgress(typesOfCommonLeaves);

    return (
      <div className={styles.LeaveInformation}>
        <div className={styles.totalLeaveBalance}>
          <div className={styles.aboveContainer}>
            <span className={styles.title}>Total Leave Balance</span>
            <div className={styles.leaveBalanceBox}>
              <Progress
                type="circle"
                strokeColor="#FFA100"
                trailColor="#EAE7E3"
                percent={percentMainCircle}
                format={(percentVal) => this.renderCircleProgress(percentVal, remaining)}
              />
            </div>
          </div>
          <Collapse
            destroyInactivePanel
            onChange={this.handleShow}
            bordered={false}
            defaultActiveKey={['']}
          >
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
        <Tooltip title="Leave balances detail">
          <div onClick={onInformationClick} className={styles.infoIcon}>
            <InfoCircleOutlined />
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default LeaveInformation;
