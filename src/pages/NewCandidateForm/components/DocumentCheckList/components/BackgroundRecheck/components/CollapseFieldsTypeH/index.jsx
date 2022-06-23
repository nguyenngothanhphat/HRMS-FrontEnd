import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Col, Collapse, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import HardCopy from './HardCopy';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseFieldsTypeH = (props) => {
  const {
    items = [],
    setComment = () => {},
    setIsChecked = () => {},
    setSelectingFile = () => {},
    onComment,
  } = props;
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.titleText}>{items.type}</span>
      </div>
    );
  };

  return (
    <div className={styles.CollapseFieldsTypeH}>
      <Collapse
        accordion
        expandIconPosition="right"
        defaultActiveKey="1"
        expandIcon={({ isActive }) => {
          return isActive ? (
            <MinusOutlined className={styles.alternativeExpandIcon} />
          ) : (
            <PlusOutlined className={styles.alternativeExpandIcon} />
          );
        }}
      >
        <Panel header={renderHeader()} key="1">
          {items?.documents.map((val) => {
            return (
              <HardCopy
                item={val}
                resubmitComment={val.resubmitComment}
                value={val.value}
                type={items.type}
                setSelectingFile={setSelectingFile}
                setComment={setComment}
                setIsChecked={setIsChecked}
                onComment={onComment}
              />
            );
          })}
        </Panel>
      </Collapse>
    </div>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(CollapseFieldsTypeH);
