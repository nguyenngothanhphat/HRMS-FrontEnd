import React from 'react';
import { Collapse, Space, Checkbox, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputField from '../InputField';
import styles from './index.less';

const CollapseField = ({ item = [] }) => {
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
            <Checkbox className={styles.checkbox} onClick={(e) => e.stopPropagation()}>
              {item.title}
            </Checkbox>
          }
          extra="[Can submit any of the below other than (*)mandatory]"
        >
          {item.title === 'Type D: Technical Certifications' ? <InputField /> : <></>}
          <Space direction="vertical">
            {item.items.map((obj) => (
              <Checkbox key={obj.key} className={styles.checkboxItem}>
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
