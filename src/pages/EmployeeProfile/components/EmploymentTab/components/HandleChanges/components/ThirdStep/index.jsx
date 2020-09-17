import React from 'react';
import { Select, Input } from 'antd';
import styles from './styles.less';

export default function ThirdStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData } = props;
  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div>Department</div>
        <Select
          defaultValue={changeData.stepThree.department}
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
        <div>Position</div>
        <Input
          defaultValue={changeData.stepThree.position}
          style={{ width: 300 }}
          placeholder="Enter the position"
          onChange={(e) => onChange(e.target.value, 'position')}
        />
      </div>
      <div className={styles.select}>
        <div>Reporting to</div>
        <Select
          defaultValue={changeData.stepThree.reportTo}
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
