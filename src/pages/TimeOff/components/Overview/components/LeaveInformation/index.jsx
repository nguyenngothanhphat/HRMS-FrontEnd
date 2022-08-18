import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, Progress, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import ShowBreakdownIcon from '@/assets/iconViewBreakdown.svg';
import CollapseInformation from './components/CollapseInformation';
import styles from './index.less';
import TypeInfoPopover from '../TypeInfoPopover';

const { Panel } = Collapse;

const LeaveInformation = (props) => {
  const {
    onInformationClick = () => {},
    timeOff: {
      yourTimeOffTypes: { overview = {}, commonLeaves = [], specialLeaves = [] } = {},
    } = {},
  } = props;

  const [isShow, setIsShow] = useState(false);

  const handleShow = () => {
    setIsShow(!isShow);
  };

  const renderHeader = () => {
    return (
      <div className={styles.showBtn}>
        <span>View Leave breakdown</span>
        {isShow ? (
          <img src={ShowBreakdownIcon} className={styles.rotateIcon} alt="show-breakdown" />
        ) : (
          <img src={ShowBreakdownIcon} className={styles.defaultIcon} alt="show-breakdown" />
        )}
      </div>
    );
  };

  const renderCircleProgress = () => (
    <div className={styles.circleProgress}>
      <span className={styles.percentValue}>{overview?.remaining || 0}</span>
      <p className={styles.remainingText}>Remaining</p>
    </div>
  );

  return (
    <div className={styles.LeaveInformation}>
      <div className={styles.totalLeaveBalance}>
        <div className={styles.aboveContainer}>
          <div className={styles.header}>
            <span className={styles.title}>Total Leave Balance</span>
            <TypeInfoPopover placement="rightTop" data={[...commonLeaves, ...specialLeaves]}>
              <Tooltip title="Leave balances detail">
                <div className={styles.infoIcon} onClick={onInformationClick}>
                  <InfoCircleOutlined />
                </div>
              </Tooltip>
            </TypeInfoPopover>
          </div>
          <div className={styles.leaveBalanceBox}>
            <Progress
              type="circle"
              strokeColor="#FFA100"
              trailColor="#EAE7E3"
              percent={overview.total ? (overview.remaining / overview.total) * 100 : 0}
              format={renderCircleProgress}
            />
          </div>
        </div>
        <Collapse
          destroyInactivePanel
          onChange={handleShow}
          bordered={false}
          defaultActiveKey={['']}
        >
          <Panel showArrow={false} header={renderHeader()} key="1">
            <CollapseInformation commonLeaves={commonLeaves} specialLeaves={specialLeaves} />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default connect(({ timeOff, user }) => ({
  timeOff,
  user,
}))(LeaveInformation);
