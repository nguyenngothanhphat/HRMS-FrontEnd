/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Select, Input } from 'antd';
import styles from './styles.less';

const compensationTypes = ['Salaried', 'Hourly'];

export default function SecondStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData } = props;

  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>Do you wish to change the compensation?</div>

      <div className={styles.select}>
        <div className={styles.label}>Annual CTC</div>
        <Input
          defaultValue={changeData.stepFour.currentAnnualCTC || null}
          placeholder="Enter the Annual CTC"
          onChange={(e) => onChange(e.target.value, 'currentAnnualCTC')}
        />
      </div>

      <div className={styles.select}>
        <div className={styles.label}>Compensation Type</div>
        <Select
          defaultValue={changeData.stepFour.compensationType || null}
          showSearch
          placeholder="Select an compensation type"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'compensationType')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {compensationTypes.map((item) => {
            return (
              <Option key={makeKey()} value={item}>
                {item}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
    </div>
  );
}
