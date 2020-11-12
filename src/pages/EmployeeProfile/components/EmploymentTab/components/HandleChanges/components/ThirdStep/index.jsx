import React from 'react';
import { Select } from 'antd';
import styles from './styles.less';

export default function ThirdStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData, fetchedState } = props;
  const { stepThree: { department = '' } = {} } = changeData;
  const getdepartment = department || '';
  const getFilter = fetchedState.employees.filter((item) => item.department._id === getdepartment);
  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div>Department</div>
        <Select
          defaultValue={changeData.stepThree.department || null}
          showSearch
          placeholder="Select a department"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'department')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
      <div className={styles.select}>
        <div>Title</div>
        <Select
          value={changeData.newTitle || null}
          showSearch
          placeholder="Select a title"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'title')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {changeData.stepThree.department
            ? fetchedState.listTitleByDepartment.map((item) => {
                return (
                  <Option key={makeKey()} value={[item.name, item._id]}>
                    {item.name}
                  </Option>
                );
              })
            : null}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div>Reporting to</div>
        <Select
          defaultValue={changeData.stepThree.reportTo || null}
          showSearch
          placeholder="Select a manager"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'reportTo')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {getFilter
            ? getFilter.map((item) => {
                return (
                  <Option key={makeKey()} value={item._id}>
                    {item.generalInfo.firstName || item.generalInfo.legalName || null}
                  </Option>
                );
              })
            : ''}
          ]
        </Select>
      </div>
    </div>
  );
}
