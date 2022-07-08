import { Checkbox, Col, Popover, Row, Tree } from 'antd';
import React from 'react';
import styles from './index.less';

const ContentPopover = (props) => {
  const {
    children,
    data = [],
    onCheck = () => {},
    checkAll = false,
    onCheckAll = () => {},
    selected = [],
  } = props;

  const RenderTree = () => {
    return (
      <Row className={styles.content}>
        <Col span={24}>
          <Checkbox
            onChange={onCheckAll}
            checked={checkAll}
            style={{ display: 'flex', margin: '8px 0' }}
          >
            Select All
          </Checkbox>
        </Col>

        <Col span={24}>
          <Tree
            checkable
            treeData={data}
            defaultExpandAll
            onCheck={onCheck}
            checkedKeys={selected}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Popover
      content={<RenderTree />}
      trigger="click"
      placement="bottomRight"
      overlayClassName={styles.ContentPopover}
    >
      {children}
    </Popover>
  );
};

export default ContentPopover;
