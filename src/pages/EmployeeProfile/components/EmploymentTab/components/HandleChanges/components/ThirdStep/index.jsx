import React from 'react';
import { Select, Input } from 'antd';
import styles from './styles.less';

export default function ThirdStep(props) {
  const { Option } = Select;
  const { onChange, onSearch } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div>Department</div>
        <Select
          showSearch
          placeholder="Select a department"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'department')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {['Engineer', 'HR', 'Support', 'Design'].map((item) => {
            return <Option value={item}>{item}</Option>;
          })}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Position</div>
        <Input
          style={{ width: 300 }}
          placeholder="Enter the position"
          onChange={(e) => onChange(e.target.value, 'position')}
        />
      </div>
      <div className={styles.select}>
        <div>Reporting to</div>
        <Select
          showSearch
          placeholder=""
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'reportTo')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {['Anil Reddy'].map((item) => {
            return <Option value={item}>{item}</Option>;
          })}
          ]
        </Select>
      </div>
    </div>
  );
}
