import React, { useState } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

const CollapseField = ({ item = [] }) => {
  const [isCheck, setIsCheck] = useState(false);
  const [itemCheck, setItemCheck] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  // const defaultCheckList = item.items.find(() => )

  const handleChange = (e) => {
    setIsCheck(e.target.checked);
    // setIndeterminate(!!)
  };

  const handleItemChange = () => {
    if (isCheck) return setItemCheck(isCheck);
    console.log('check');
    return false;
  };

  return (
    <div className={styles.CollapseField}>
      <Collapse
        accordion
        expandIconPosition="right"
        expandIcon={(props) => {
          return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
        }}
      >
        <Collapse.Panel
          header={
            <Checkbox
              className={styles.checkbox}
              onClick={(e) => e.stopPropagation()}
              onChange={handleChange}
            >
              {item.title}
            </Checkbox>
          }
          extra="[Can submit any of the below other than (*)mandatory]"
        >
          {item.title === 'Type D: Technical Certifications' ? <InputField /> : <></>}
          <Space direction="vertical">
            <Checkbox.Group
              direction="vertical"
              className={styles.checkboxItem}
              // checked={checked}
              options={item.items.map((obj) => obj.name)}
            />
            {/* {item.items.map((obj) => (
              <Checkbox
                key={obj.key}
                className={styles.checkboxItem}
                onChange={handleItemChange}
                checked={isCheck}
              >
                {obj.name}
              </Checkbox>
            ))} */}
            {item.title === 'Type D: Technical Certifications' ? (
              <Space direction="horizontal">
                <PlusOutlined className={styles.plusIcon} />
                <Typography.Text className={styles.addMore}>Add Employer Details</Typography.Text>
              </Space>
            ) : (
              <></>
            )}
          </Space>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default CollapseField;
