import React from 'react';
import { Select } from 'antd';
import styles from './styles.less';

export default function ThirdStep(props) {
  const { Option } = Select;
  const {
    onChange,
    onSearch,
    changeData,
    fetchedState = {},
    loadingFetchEmployeeList = false,
    loadingFetchTitleList = false,
  } = props;

  const { employeeList = [] } = fetchedState;
  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>
      <div className={styles.select}>
        <div className={styles.label}>Title</div>
        <Select
          value={changeData.stepThree.title || null}
          showSearch
          placeholder="Select a title"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'title')}
          loading={loadingFetchTitleList}
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
        </Select>
      </div>
      <div className={styles.select}>
        <div className={styles.label}>Reporting To</div>
        <Select
          value={changeData.stepThree.reportTo || null}
          showSearch
          placeholder="Select a manager"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'reportTo')}
          onSearch={onSearch}
          loading={loadingFetchEmployeeList}
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
          value={changeData.stepThree.reportees || null}
          showSearch
          placeholder="Select reportees"
          optionFilterProp="children"
          onChange={(value) => onChange(value, 'reportees')}
          onSearch={onSearch}
          showArrow
          loading={loadingFetchEmployeeList}
          allowClear
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
