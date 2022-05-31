import React from 'react';
import { Select } from 'antd';
import styles from './styles.less';

export default function ThirdStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData, fetchedState = {} } = props;
  const { stepTwo: { department = '' } = {} } = changeData;
  const { employeeList = [] } = fetchedState;

  const sameDeptEmployees = employeeList.filter(
    (item) => item.department._id === department || item.department._id === '',
  );

  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div className={styles.label}>Title</div>
        <Select
          value={changeData.newTitle || null}
          showSearch
          placeholder="Select a title"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'title')}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {changeData.stepTwo.department
            ? fetchedState.listTitleByDepartment.map((item) => {
                return (
                  <Option key={makeKey()} value={item._id}>
                    {item.name}
                  </Option>
                );
              })
            : null}
          ]
        </Select>
      </div>
      <div className={styles.select}>
        <div className={styles.label}>Reporting To</div>
        <Select
          defaultValue={changeData.stepThree.reportTo || null}
          showSearch
          placeholder="Select a manager"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'reportTo')}
          onSearch={onSearch}
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
      <div className={styles.select}>
        <div className={styles.label}>Reportees</div>
        <Select
          defaultValue={changeData.stepThree.reportees || null}
          showSearch
          placeholder="Select reportees"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'reportees')}
          onSearch={onSearch}
          showArrow
          mode="multiple"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {sameDeptEmployees.map((item) => {
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
