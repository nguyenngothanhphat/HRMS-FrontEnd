import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, Progress, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { roundNumber, TIMEOFF_TYPE } from '@/utils/timeOff';
import ShowBreakdownIcon from '@/assets/iconViewBreakdown.svg';
import CollapseInformation from './components/CollapseInformation';
import styles from './index.less';

const { Panel } = Collapse;

const LeaveInformation = (props) => {
  const {
    onInformationClick = () => {},
    timeOff: {
      yourTimeOffTypes,
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
    } = {},
    viewDocumentVisible = false,
  } = props;

  const [isShow, setIsShow] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [percentMainCircle, setPercentMainCircle] = useState(0);

  const calculateValueForCircleProgress = () => {
    let total = 0;
    let taken = 0;
    let result = 0;

    commonLeaves.forEach((type) => {
      if (type.type === TIMEOFF_TYPE.A) {
        taken += type.taken;
        total += type.total;
      }
    });

    result = ((total - taken) * 100) / total;
    setRemaining(total - taken);
    setPercentMainCircle(result);
  };

  useEffect(() => {
    if (yourTimeOffTypes) {
      calculateValueForCircleProgress();
    }
  }, [JSON.stringify(yourTimeOffTypes)]);

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

  const renderCircleProgress = (value) => (
    <div className={styles.circleProgress}>
      <span className={styles.percentValue}>{roundNumber(value)}</span>
      <p className={styles.remainingText}>Remaining</p>
    </div>
  );

  return (
    <div className={styles.LeaveInformation} style={viewDocumentVisible ? { zIndex: '1002' } : {}}>
      <div className={styles.totalLeaveBalance}>
        <div className={styles.aboveContainer}>
          <span className={styles.title}>Total Leave Balance</span>
          <div className={styles.leaveBalanceBox}>
            <Progress
              type="circle"
              strokeColor="#FFA100"
              trailColor="#EAE7E3"
              percent={percentMainCircle}
              format={() => renderCircleProgress(remaining)}
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
      <Tooltip title="Leave balances detail">
        <div onClick={onInformationClick} className={styles.infoIcon}>
          <InfoCircleOutlined />
        </div>
      </Tooltip>
    </div>
  );
};

export default connect(({ timeOff, user }) => ({
  timeOff,
  user,
}))(LeaveInformation);
