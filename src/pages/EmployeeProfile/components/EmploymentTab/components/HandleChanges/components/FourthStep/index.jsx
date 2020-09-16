import React from 'react';
import styles from './styles.less';

export default function FourthStep(props) {
  const { onRadioChange, radio } = props;
  return (
    <div>
      <div className={styles.headings}>When do you wish the changes to take effect?</div>
      <label class={styles.container}>
        One
        <input type="checkbox" checked="checked" />
        <span class={styles.checkmark}></span>
      </label>
    </div>
  );
}
