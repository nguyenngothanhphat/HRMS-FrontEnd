import React, { useState } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

const CollapseField = ({ item = [] }) => {
  const [isCheck, setIsCheck] = useState(false);
  const [itemCheck, setItemCheck] = useState(false);
  // const [indeterminate, setIndeterminate] = useState(true);

  const defaultCheckList = [];
  defaultCheckList.push();

  const handleChange = (e) => {
    setIsCheck(e.target.checked);
    setItemCheck(e.target.checked);
  };

  const handleItemChange = () => {
    if (isCheck) return setItemCheck(true);
    if (itemCheck) return setItemCheck(true);
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
              onChange={handleItemChange}
              checked={!!isCheck}
            >
              {item.title}
            </Checkbox>
          }
          extra="[Can submit any of the below other than (*)mandatory]"
        >
          {item.title === 'Type D: Technical Certifications' ? <InputField /> : <></>}
          <Space direction="vertical">
            {/* <Checkbox.Group
              direction="vertical"
              className={styles.checkboxItem}
              checked
              options={item.items.map((obj) => obj.name)}
            /> */}
            {item.items.map((obj) => (
              <Checkbox
                key={obj.key}
                // indeterminate
                className={styles.checkboxItem}
                onChange={handleChange}
                // checked={!!(obj.isRequired || isCheck)}
              >
                {obj.name}
              </Checkbox>
            ))}
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
