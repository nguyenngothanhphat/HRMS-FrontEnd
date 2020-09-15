import React, { useState } from 'react';
import { Radio, DatePicker, Select } from 'antd';
import styles from './styles.less';

export default function HandleChanges(props) {
  const { current } = props;
  const [radio, setRadio] = useState(1);
  const onRadioChange = (e) => {
    setRadio(e.target.value);
  };
  const FirstStep = () => {
    return (
      <div>
        <div className={styles.headings}>When do you wish the changes to take effect?</div>
        <Radio.Group onChange={onRadioChange} value={radio}>
          <Radio className={styles.radios} value={1}>
            A change that already happened.
            {radio === 1 ? (
              <DatePicker
                style={{
                  width: '60%',
                  marginLeft: '50%',
                  borderRadius: '5px',
                  border: '1px solid #d6dce4',
                  color: '#000',
                }}
                format="DD/MM/YYYY"
              />
            ) : null}
          </Radio>
          <Radio className={styles.radios} value={2}>
            An immediate change.
          </Radio>
          <Radio className={styles.radios} value={3}>
            Scheduled change
            {radio === 3 ? (
              <DatePicker
                style={{
                  width: '75%',
                  marginLeft: '95%',
                  borderRadius: '5px',
                  border: '1px solid #d6dce4',
                  color: '#000',
                }}
                format="DD/MM/YYYY"
              />
            ) : null}
          </Radio>
        </Radio.Group>
      </div>
    );
  };

  const SecondStep = () => {
    const { Option } = Select;
    function onChange(value) {
      console.log(`selected ${value}`);
    }
    function onSearch(value) {
      console.log('searched: ', value);
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={styles.headings}>What do you wish to change?</div>
        <div className={styles.select}>
          <div>Title</div>
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Select a location"
            optionFilterProp="children"
            onChange={onChange}
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
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Select an employment type"
            optionFilterProp="children"
            onChange={onChange}
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
      </div>
    );
  };
  return (
    <div className={styles.handleChanges}>
      {current === 0 ? <FirstStep /> : null}
      {current === 1 ? <SecondStep /> : null}
    </div>
  );
}
