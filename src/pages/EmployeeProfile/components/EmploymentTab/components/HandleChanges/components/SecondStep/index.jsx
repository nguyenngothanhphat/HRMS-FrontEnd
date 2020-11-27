/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Select } from 'antd';
import styles from './styles.less';

const compenTypes = ['Salaried', 'Stock options', 'Other non-cash benefits'];

export default function SecondStep(props) {
  const { Option } = Select;
  const { onChange, onSearch, changeData, fetchedState, onRadioChange } = props;

  const makeKey = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.headings}>What do you wish to change?</div>

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
          {compenTypes.map((item) => {
            return (
              <Option key={makeKey()} value={item}>
                {item}
              </Option>
            );
          })}
          ]
        </Select>
      </div>
      {changeData.stepTwo.compensation === compenTypes[0] ? (
        <div className={styles.select}>
          <div>Salary type</div>
          <div style={{ width: '300px', display: 'flex', justifyContent: 'space-evenly' }}>
            <label className={styles.container}>
              <input
                value={7}
                checked={changeData.stepTwo.compensationType === 'Hourly'}
                onChange={(e) => onRadioChange(e)}
                type="checkbox"
              />
              <span className={styles.checkmark} />
              Hourly
            </label>
            <label className={styles.container}>
              <input
                value={8}
                checked={changeData.stepTwo.compensationType === 'Annually'}
                onChange={(e) => onRadioChange(e)}
                type="checkbox"
              />
              <span className={styles.checkmark} />
              Annually
            </label>
          </div>
        </div>
      ) : null}
      {changeData.stepTwo.compensation === compenTypes[1] ? (
        <div className={styles.select}>
          <div>Options</div>
          <div style={{ width: '300px', display: 'flex', justifyContent: 'space-evenly' }}>
            <label className={styles.container}>
              <input
                value={9}
                checked={changeData.stepTwo.compensationType === 'Intentive'}
                onChange={(e) => onRadioChange(e)}
                type="checkbox"
              />
              <span className={styles.checkmark} />
              Intentive
            </label>
            <label className={styles.container}>
              <input
                value={10}
                checked={changeData.stepTwo.compensationType === 'Bonus'}
                onChange={(e) => onRadioChange(e)}
                type="checkbox"
              />
              <span className={styles.checkmark} />
              Bonus
            </label>
            <label className={styles.container}>
              <input
                value={11}
                checked={changeData.stepTwo.compensationType === 'Stock option'}
                onChange={(e) => onRadioChange(e)}
                type="checkbox"
              />
              <span className={styles.checkmark} />
              Stock option
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
