import React, { PureComponent } from 'react';
import { connect, formatMessage } from 'umi';
import editIcon from '@/assets/pencilIcon.svg';
import styles from './index.less';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';

@connect(({ newCandidateForm: { isEditingSalary, tempData: { processStatus = '' } } = {} }) => ({
  processStatus,
  isEditingSalary,
}))
class SalaryStructureHeader extends PureComponent {
  onClickEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newCandidateForm/save',
      payload: { isEditingSalary: true },
    });
  };

  render() {
    const { jobTitle = '', isEditingSalary = false, processStatus = '' } = this.props;
    return (
      <div className={styles.salaryStructureHeader}>
        <p className={styles.salaryStructureHeader__title}>
          <span className={styles.titleText}>
            {formatMessage({ id: 'component.salaryStructureHeader.title' })}
          </span>
          {processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION && !isEditingSalary && (
            <div className={styles.editBtn} onClick={() => this.onClickEdit()}>
              <img src={editIcon} alt="icon" /> <span>Edit</span>
            </div>
          )}
        </p>
        <p className={styles.salaryStructureHeader__subtitle}>
          The pay division as per the position of ‘{jobTitle}’ has been given below.
        </p>
      </div>
    );
  }
}
export default SalaryStructureHeader;
