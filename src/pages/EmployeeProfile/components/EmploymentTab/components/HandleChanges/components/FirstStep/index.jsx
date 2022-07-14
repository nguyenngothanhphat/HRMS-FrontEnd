import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker, Radio } from 'antd';
import moment from 'moment';
import React from 'react';
import { MAKE_CHANGE_TYPE } from '@/utils/employeeProfile';
import styles from './styles.less';

const { ALREADY_CHANGE, SCHEDULE_CHANGE } = MAKE_CHANGE_TYPE;
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
              value={moment(changeData.stepOne.effectDate)}
              onChange={(value) => onDateChange(value, ALREADY_CHANGE)}
              suffixIcon={<CalendarOutlined style={{ color: '#161c29' }} />}
              style={{
                width: '250px',
                marginLeft: '110px',
                borderRadius: '5px',
                border: '1px solid #d6dce4',
                color: '#000',
              }}
              format="MM/DD/YYYY"
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
              value={moment(changeData.stepOne.effectDate)}
              onChange={(value) => onDateChange(value, SCHEDULE_CHANGE)}
              suffixIcon={<CalendarOutlined style={{ color: '#161c29' }} />}
              style={{
                width: '250px',
                marginLeft: '200px',
                borderRadius: '5px',
                border: '1px solid #d6dce4',
                color: '#000',
              }}
              format="MM/DD/YYYY"
            />
          ) : null}
        </div>
      </Radio.Group>
    </div>
  );
}
