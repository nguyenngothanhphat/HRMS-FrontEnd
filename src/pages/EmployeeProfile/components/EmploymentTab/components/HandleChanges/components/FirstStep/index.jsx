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
        <div className={styles.radios}>
          <Radio value={1} style={{ paddingTop: '6px' }}>
            A change that already happened.
          </Radio>
          {radio === 1 ? (
            <DatePicker
              defaultValue={changeData.stepOne === 'Before' ? null : moment(changeData.stepOne)}
              onChange={(value) => onDateChange(value, 'Before')}
              suffixIcon={<CalendarOutlined style={{ color: '#161c29' }} />}
              style={{
                width: '250px',
                marginLeft: '110px',
                borderRadius: '5px',
                border: '1px solid #d6dce4',
                color: '#000',
              }}
              format="DD/MM/YYYY"
            />
          ) : null}
        </div>
        <div className={styles.radios}>
          <Radio value={2} style={{ paddingTop: '6px' }}>
            An immediate change.
          </Radio>
        </div>

        <div className={styles.radios}>
          <Radio value={3} style={{ paddingTop: '6px' }}>
            Scheduled change
          </Radio>
          {radio === 3 ? (
            <DatePicker
              defaultValue={changeData.stepOne === 'Later' ? null : moment(changeData.stepOne)}
              onChange={(value) => onDateChange(value, 'Later')}
              suffixIcon={<CalendarOutlined style={{ color: '#161c29' }} />}
              style={{
                width: '250px',
                marginLeft: '200px',
                borderRadius: '5px',
                border: '1px solid #d6dce4',
                color: '#000',
              }}
              format="DD/MM/YYYY"
            />
          ) : null}
        </div>
      </Radio.Group>
    </div>
  );
}
