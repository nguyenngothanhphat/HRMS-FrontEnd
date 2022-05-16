/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Collapse, Space, Checkbox, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import cancelIcon from '@/assets/cancel-symbols-copy.svg';
import undo from '@/assets/candidatePortal/undo-signs.svg';
import doneIcon from '@/assets/candidatePortal/doneSign.svg';
import UploadImage from '../UploadImage';
import styles from './index.less';

const CollapseField = (props) => {
  const { item = {} } = props;

  return (
    <div className={styles.CollapseField}>
      <Collapse
        defaultActiveKey="1"
        accordion
        expandIconPosition="right"
        expandIcon={({ isActive }) => {
          return isActive ? <MinusOutlined /> : <PlusOutlined />;
        }}
      >
        <Collapse.Panel
          key="1"
          header={
            <span style={{ display: 'inline-block', marginRight: '20px' }}>
              Type {item.type}: {item.name}
            </span>
          }
        >
          <Space direction="vertical" className={styles.Space}>
            Hehe
          </Space>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default CollapseField;
