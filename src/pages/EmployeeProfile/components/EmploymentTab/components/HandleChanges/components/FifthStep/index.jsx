/* eslint-disable jsx-a11y/label-has-associated-control */
import { Select } from 'antd';
import React from 'react';
import styles from './styles.less';

const { Option } = Select;

export default function FifthStep(props) {
  const { onRadioChange, radio } = props;
  const { onChange, changeData, fetchedState: { employeeList = [] } = {} } = props;

  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div>
      <div className={styles.headings}>
        What do you wish to notify about the changes that are made?
      </div>

      <label className={styles.container}>
        <input
          value={4}
          checked={radio.toEmployee}
          onChange={(e) => onRadioChange(e)}
          type="checkbox"
        />
        <span className={styles.checkmark} />
        Employee
      </label>
      <label className={styles.container}>
        <input
          value={5}
          checked={radio.toManager}
          onChange={(e) => onRadioChange(e)}
          type="checkbox"
        />
        <span className={styles.checkmark} />
        Employee’s Reporting Manager
      </label>
      <div className={styles.select}>
        <Select
          defaultValue={changeData.stepFive.toOthers || null}
          showSearch
          placeholder="Others"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'toOthers')}
          showArrow
          mode="multiple"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {employeeList.map((item) => {
            return (
              <Option key={makeKey()} value={item._id}>
                {item.generalInfo?.legalName || null}
              </Option>
            );
          })}
        </Select>
      </div>
    </div>
  );
}
