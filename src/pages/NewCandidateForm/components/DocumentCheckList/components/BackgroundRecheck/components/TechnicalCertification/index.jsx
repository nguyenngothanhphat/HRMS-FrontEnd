import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import { connect } from 'umi';
import File from '../File';
import Certification from './components/Certification';
import styles from './index.less';

const TechnicalCertification = (props) => {
  const {
    layout: { type = '', name = '' } = {},
    items = [],
    onVerifyDocument = () => {},
    onViewCommentClick = () => {},
    onViewDocumentClick = () => {},
  } = props;

  return (
    <div className={styles.TechnicalCertification}>
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
              Type {type}: {name}
            </span>
          }
        >
          {items.map((cer, index) => (
            <div className={styles.container}>
              <File
                item={cer}
                index={index}
                type={type}
                onVerifyDocument={onVerifyDocument}
                onViewCommentClick={onViewCommentClick}
                onViewDocumentClick={onViewDocumentClick}
              />
              <Certification certification={cer} length={items.length} index={index} />
            </div>
          ))}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(TechnicalCertification);
