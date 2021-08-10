import { Input } from 'antd';
import React, { PureComponent } from 'react';
// import { formatMessage } from 'umi';

import { connect } from 'umi';
import styles from './index.less';

@connect(({ candidatePortal: { salaryNote = '' } = {} }) => ({
  salaryNote,
}))
class SalaryNote extends PureComponent {
  render() {
    const { salaryNote = '' } = this.props;
    return (
      <div className={styles.SalaryNote}>
        <span className={styles.title}>Salary Structure Note</span>
        <Input.TextArea defaultValue={salaryNote} disabled autoSize={{ minRows: 3, maxRows: 7 }} />
      </div>
    );
  }
}
export default SalaryNote;
