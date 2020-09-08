import React from 'react';
import { Collapse, Space, Checkbox } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from './index.less';

const CollapseField = () => {
  return (
    <div className={styles.CollapseField}>
      <Collapse
        accordion
        expandIconPosition="right"
        expandIcon={(props) => {
          return props.isActive ? <MinusOutlined /> : <PlusOutlined />;
        }}
      >
        <Collapse.Panel header={<Checkbox> </Checkbox>} key="1">
          <Space direction="vertical">
            <Checkbox>Aadhar Card*</Checkbox>
            <Checkbox>PAN Card*</Checkbox>
            <Checkbox>Passport</Checkbox>
            <Checkbox>Driving License</Checkbox>
            <Checkbox>Voter Card</Checkbox>
          </Space>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default CollapseField;
