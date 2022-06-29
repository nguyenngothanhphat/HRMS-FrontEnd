import React from 'react';
import HintIcon from '@/assets/offboarding/hint.svg';
import ProcessDot from '@/components/ProgressDot';
import { OFFBOARDING_COLOR, PROGRESS_NAME, OFFBOARDING } from '@/utils/offboarding';
import styles from './index.less';

const ProcessStatus = (props) => {
  const { item: { status = '', assigned = {} } = {} } = props;
  const { manager } = assigned;

  const renderText = () => {
    const pmName = manager?.generalInfoInfo?.legalName;
    switch (status) {
      case OFFBOARDING.STATUS.IN_PROGRESS:
        return 'This request is still under review by the reporting manager';
      case OFFBOARDING.STATUS.ACCEPTED:
        return `This request has been approved by ${pmName}`;
      case OFFBOARDING.STATUS.REJECTED:
        return `This request has been rejected by ${pmName}`;
      case OFFBOARDING.STATUS.DELETED:
        return `This request has been deleted`;
      default:
        return '';
    }
  };

  return (
    <div className={styles.ProcessStatus}>
      <div className={styles.left}>
        <div className={styles.hintIcon}>
          <img src={HintIcon} alt="hint" />
        </div>
        <span className={styles.hintText}>{renderText()}</span>
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
