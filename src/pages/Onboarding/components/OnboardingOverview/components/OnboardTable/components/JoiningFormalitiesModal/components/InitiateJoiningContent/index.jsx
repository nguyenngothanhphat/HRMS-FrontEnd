import React from 'react';
import { Checkbox, Tooltip } from 'antd';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import TooltipIcon from '@/assets/tooltip.svg';

export default function InitiateJoiningContent(props) {
  const { listJoiningFormalities = [], checkList, setCheckList } = props;

  return (
    <>
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={(value) => setCheckList(value)}
        value={checkList}
      >
        {listJoiningFormalities.map((item) => (
          <div key={item.name}>
            <Checkbox value={item._id}>
              <div className={styles.labelCheckbox}>{item.name}</div>
            </Checkbox>
            <Tooltip
              title={<div className={styles.contentTooltip}>{item.description}</div>}
              color="#fff"
              placement="right"
              overlayClassName={styles.tooltipOverlay}
            >
              <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
            </Tooltip>
          </div>
        ))}
      </Checkbox.Group>
    </>
  );
}
