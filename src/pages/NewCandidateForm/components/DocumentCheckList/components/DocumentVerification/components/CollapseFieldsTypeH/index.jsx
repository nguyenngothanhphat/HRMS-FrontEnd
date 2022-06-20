import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Col, Collapse, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseFieldsTypeH = (props) => {
  const { items = [] } = props;

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.titleText}>{items.type}</span>
      </div>
    );
  };

  return (
    <Col span={24}>
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
            {items.documents?.map((val) => {
              return (
                <div className={styles.nameDocument}>
                  <Checkbox style={{ display: 'flex' }}>
                    {val.displayName}
                    <span className={styles.starSymbol}>*</span>
                  </Checkbox>
                  <Input.TextArea
                    // style={{ display: 'block', resize: 'none' }}
                    placeholder="Type your note here"
                  />
                </div>
              );
            })}
          </Panel>
        </Collapse>
      </div>
    </Col>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(CollapseFieldsTypeH);
