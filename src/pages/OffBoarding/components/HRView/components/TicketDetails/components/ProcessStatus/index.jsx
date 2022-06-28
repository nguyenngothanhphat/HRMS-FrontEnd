import React from 'react';
import HintIcon from '@/assets/offboarding/hint.svg';
import ProcessDot from '@/components/ProgressDot';
import { OFFBOARDING_COLOR, PROGRESS_NAME } from '@/utils/offboarding';
import styles from './index.less';

const ProcessStatus = (props) => {
  const { item = {} } = props;
  const { status = '' } = item;

  return (
    <div className={styles.ProcessStatus}>
      <div className={styles.left}>
        <div className={styles.hintIcon}>
          <img src={HintIcon} alt="hint" />
        </div>
        <span className={styles.hintText}>
          This request is still under review by the reporting manager
        </span>
      </div>
      <div className={styles.right}>
        <span className={styles.label}>Status: </span>
        <ProcessDot
          name={PROGRESS_NAME[status]}
          color={OFFBOARDING_COLOR[status]}
          fontSize={16}
          fontWeight={500}
        />
      </div>
    </div>
  );
};

export default ProcessStatus;
