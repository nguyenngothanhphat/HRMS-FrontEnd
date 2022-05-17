import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import File from '../File';
import styles from './index.less';

const CollapseField = (props) => {
  const { layout = {}, items = [] } = props;

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
              Type {layout.type}: {layout.name}
            </span>
          }
        >
          <div className={styles.space}>
            {items.map((item, i) => (
              <File item={item} index={i} type={layout.type} />
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default CollapseField;
