import React from 'react';
import { Select } from 'antd';
import styles from './styles.less';

export default function SecondStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData, fetchedState, listLocationsByCompany } = props;

  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>

      <div className={styles.select}>
        <div className={styles.label}>Work Location</div>
        <Select
          defaultValue={changeData.newLocation || null}
          showSearch
          placeholder="Select a location"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'wLocation')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {listLocationsByCompany.map((item) => {
            return (
              <Option key={makeKey()} value={item._id}>
                {item.name}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div className={styles.label}>Employment Type</div>
        <Select
          defaultValue={changeData.stepTwo.employment || null}
          showSearch
          placeholder="Select an employment type"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'employment')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {fetchedState.employeeTypes.map((item) => {
            return (
              <Option key={makeKey()} value={item._id}>
                {item.name}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div className={styles.label}>Department</div>
        <Select
          defaultValue={changeData.stepTwo.department || null}
          showSearch
          placeholder="Select a department"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'department')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {fetchedState.departments.map((item) => {
            return (
              <Option key={makeKey()} value={item._id}>
                {item.name}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
    </div>
  );
}
