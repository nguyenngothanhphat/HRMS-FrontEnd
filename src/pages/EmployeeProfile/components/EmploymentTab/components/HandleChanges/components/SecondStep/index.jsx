import React from 'react';
import { Select, Input } from 'antd';
import styles from './styles.less';

export default function SecondStep(props) {
  const { Option } = Select;
  const { onChange, onSearch } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div>Title</div>
        <Input
          style={{ width: 300 }}
          placeholder="Enter a title"
          onChange={(e) => onChange(e.target.value, 'title')}
        />
      </div>
      <div className={styles.select}>
        <div>Work Location</div>
        <Select
          showSearch
          placeholder="Select a location"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'wLocation')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {['Bengaluru', 'Ho Chi Minh', 'Sillicon Valley'].map((item) => {
            return <Option value={item}>{item}</Option>;
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Employment Type</div>
        <Select
          showSearch
          placeholder="Select an employment type"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'employment')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {['Full-Time', 'Part-Time'].map((item) => {
            return <Option value={item}>{item}</Option>;
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Compensation Type</div>
        <Select
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
            return <Option value={item}>{item}</Option>;
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Annual Salary</div>
        <Input
          style={{ width: 300 }}
          placeholder="Enter an amount"
          onChange={(e) => onChange(e.target.value, 'salary')}
          prefix="$"
        />
      </div>
    </div>
  );
}
