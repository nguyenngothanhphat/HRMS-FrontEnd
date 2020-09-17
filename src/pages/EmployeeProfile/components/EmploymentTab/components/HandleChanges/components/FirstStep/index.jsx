import React from 'react';
import { Radio, DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './styles.less';

export default function FirstStep(props) {
  const { onDateChange, onRadioChange, changeData, radio } = props;

  return (
    <div>
      <div className={styles.headings}>When do you wish the changes to take effect?</div>
      <Radio.Group onChange={onRadioChange} value={radio}>
        <Radio className={styles.radios} value={1}>
          A change that already happened.
          {radio === 1 ? (
            <DatePicker
              defaultValue={changeData.stepOne === 'Before' ? null : moment(changeData.stepOne)}
              onChange={onDateChange}
              suffixIcon={<CalendarOutlined style={{ color: '#161c29' }} />}
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
              defaultValue={changeData.stepOne === 'Later' ? null : moment(changeData.stepOne)}
              onChange={onDateChange}
              suffixIcon={<CalendarOutlined style={{ color: '#161c29' }} />}
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
