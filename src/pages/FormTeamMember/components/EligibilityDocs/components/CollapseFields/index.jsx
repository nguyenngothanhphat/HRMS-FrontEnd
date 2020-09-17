/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

const CollapseField = ({
  item = [],
  handleCheckBox,
  defaultCheckListContainer = [],
  checkHeader = {},
}) => {
  // const [checkList, setCheckList] = useState(defaultCheckListContainer[0]);
  // const [checkList_, setCheckList_] = useState(defaultCheckListContainer[2]);
  // const [checkAll, setCheckAll] = useState(false);
  // const [indeterminate, setIndeterminate] = useState(true);
  const [isCheck, setIsCheck] = useState(false);
  const [isItemCheck, setIsItemCheck] = useState(false);

  const handleChange = (e) => {
    // setCheckList(checkedList);
    // setCheckList_(checkedList);
    // setIndeterminate(!!checkedList.length && checkedList.length < item.items.length);
    // setCheckAll(checkedList.length === item.items.length);
    // setIsCheck(!isCheck);
    handleCheckBox(e.target.value);
  };

  // const handleCheckAllChange = (e) => {
  //   setCheckList(e.target.checked ? item.items : []);
  //   setCheckList_(e.target.checked ? item.items : []);
  //   setIndeterminate(false);
  //   setCheckAll(e.target.checked);
  //   if (isCheck) setCheckAll(isCheck);
  // };

  // const checkHeader = item.items.find((obj) => obj.isRequired);
  // const handleChange = (e) => {
  //   console.log(checkHeader);
  //   setIsCheck(e.target.checked);
  // };

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
              // onChange={handleCheckAllChange}
              name={item.title}
              // checked={checkHeader.isRequired}
              defaultChecked={checkHeader.isRequired}
              // indeterminate={indeterminate}
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
              // eslint-disable-next-line no-nested-ternary
              defaultChecked={checkHeader.isRequired}
              // value={}
              options={item.items.map((obj) => obj.name)}
              // onChange={handleChange}
            /> */}
            {item.items.map((obj) => (
              <Checkbox
                key={obj.key}
                // indeterminate
                className={styles.checkboxItem}
                onChange={handleChange}
                // checked={obj.isRequired}
                // name={obj.name}
                defaultChecked={obj.isRequired}
                value={obj.name}
                disabled={obj.isRequired}
              >
                {obj.name}
                {obj.isRequired ? '*' : <></>}
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
