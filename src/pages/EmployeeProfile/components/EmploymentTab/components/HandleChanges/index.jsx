import React, { useState } from 'react';
import { Radio, DatePicker } from 'antd';
import styles from './styles.less';

export default function HandleChanges(props) {
  const { current } = props;
  const [radio, setRadio] = useState(1);

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setRadio(e.target.value);
  };

  return (
    <div className={styles.handleChanges}>
      <div className={styles.headings}>When do you wish the changes to take effect?</div>
      <Radio.Group onChange={onChange} value={radio}>
        <Radio className={styles.radios} value={1}>
          A change that already happened.
          {radio === 1 ? (
            <DatePicker
              style={{
                width: '60%',
                marginLeft: '50%',
                borderRadius: '5px',
                border: '1px solid #d6dce4',
                color: '#000',
              }}
              format="DD/MM/YYYY"
            />
          ) : null}
        </Radio>
        <Radio className={styles.radios} value={2}>
          An immediate change.
        </Radio>
        <Radio className={styles.radios} value={3}>
          Scheduled change
          {radio === 3 ? (
            <DatePicker
              style={{
                width: '75%',
                marginLeft: '95%',
                borderRadius: '5px',
                border: '1px solid #d6dce4',
                color: '#000',
              }}
              format="DD/MM/YYYY"
            />
          ) : null}
        </Radio>
      </Radio.Group>
    </div>
  );
}
