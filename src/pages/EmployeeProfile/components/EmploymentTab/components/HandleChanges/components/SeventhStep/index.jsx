/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Input } from 'antd';
import styles from './styles.less';

export default function SeventhStep(props) {
  const { onChange, changeData } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className={styles.SeventhStep}>
      <div className={styles.headings}>What is the reason to make this change?</div>

      <div className={styles.select}>
        <Input.TextArea
          defaultValue={changeData.stepSeven.reasonChange || null}
          placeholder="Enter Reason for change..."
          onChange={(e) => onChange(e.target.value, 'reasonChange')}
          autoSize={{ minRows: 3 }}
        />
      </div>
    </div>
  );
}
