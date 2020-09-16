/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

const CollapseField = ({ item = [], handleCheckBox, defaultCheckListContainer = [] }) => {
  const [checkList, setCheckList] = useState(defaultCheckListContainer[0]);
  const [checkList_, setCheckList_] = useState(defaultCheckListContainer[2]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  const handleChange = (checkedList) => {
    setCheckList(checkedList);
    setCheckList_(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < item.items.length);
    setCheckAll(checkedList.length === item.items.length);
  };

  const handleCheckAllChange = (e) => {
    setCheckList(e.target.checked ? item.items : []);
    setCheckList_(e.target.checked ? item.items : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
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
              onChange={handleCheckAllChange}
              name={item.title}
              checked={checkAll}
              indeterminate={indeterminate}
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
              // eslint-disable-next-line no-nested-ternary
              value={
                item.title === 'Type A: Identity Proof'
                  ? checkList
                  : item.title === 'Type C: Educational'
                  ? checkList_
                  : ''
              }
              options={item.items}
              onChange={handleChange}
            />
            {/* {item.items.map((obj) => (
              <Checkbox
                key={obj.key}
                // indeterminate
                className={styles.checkboxItem}
                onChange={handleChange}
                checked={obj.isRequired}
                name={obj.name}
              >
                {obj.name}
                {obj.isRequired ? '*' : <></>}
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
