import React from 'react';
import { Select, InputNumber } from 'antd';
import styles from './styles.less';

export default function SecondStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData, fetchedState } = props;

  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div>Title</div>
        <Select
          defaultValue={changeData.newTitle || null}
          showSearch
          placeholder="Select a title"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'title')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {fetchedState.listTitle.map((item) => {
            return (
              <Option key={makeKey()} value={[item.name, item._id]}>
                {item.name}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Work Location</div>
        <Select
          defaultValue={changeData.newLocation || null}
          showSearch
          placeholder="Select a location"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'wLocation')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {fetchedState.locations.map((item) => {
            return (
              <Option key={makeKey()} value={[item.name, item.id]}>
                {item.name}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Employment Type</div>
        <Select
          defaultValue={changeData.stepTwo.employment || null}
          showSearch
          placeholder="Select an employment type"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'employment')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
        <div>Compensation Type</div>
        <Select
          defaultValue={changeData.stepTwo.compensation || null}
          showSearch
          placeholder="Select an compensation type"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'compensation')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {['Salaried', 'Stock options', 'Other non-cash benefits'].map((item) => {
            return (
              <Option key={makeKey()} value={item}>
                {item}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Annual Salary</div>
        <InputNumber
          defaultValue={changeData.stepTwo.salary}
          style={{ width: 300 }}
          min={0}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          placeholder="Enter an amount"
          onChange={(value) => onChange(value, 'salary')}
        />
      </div>
    </div>
  );
}
