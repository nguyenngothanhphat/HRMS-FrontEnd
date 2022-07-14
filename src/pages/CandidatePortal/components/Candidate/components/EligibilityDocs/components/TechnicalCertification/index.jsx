import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { mapType } from '@/utils/newCandidateForm';
import File from '../File';
import Certification from './components/Certification';
import styles from './index.less';

const TechnicalCertification = (props) => {
  const {
    dispatch,
    layout: { type = '', name = '' } = {},
    items = [],
    onNotAvailableClick = () => {},
    onViewCommentClick = () => {},
    onViewDocumentClick = () => {},
  } = props;

  const onSaveRedux = (result) => {
    dispatch({
      type: 'candidatePortal/saveOrigin',
      payload: {
        [mapType[type]]: result,
      },
    });
  };

  // add component
  const onAdd = () => {
    const result = [
      ...items,
      {
        name: null,
        issuedDate: null,
        expiryDate: null,
        neverExpired: false,
        alias: `Certification ${items.length}${1}`,
        key: `certification${items.length}${1}`,
      },
    ];
    onSaveRedux(result);
  };

  // remove component
  const onRemove = (index) => {
    const result = [...items];
    result.splice(index, 1);
    onSaveRedux(result);
  };

  const onValuesChange = (index, values) => {
    const result = [...items];
    result[index] = { ...result[index], ...values };
    onSaveRedux(result);
  };

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
              <Certification
                certification={cer}
                length={items.length}
                index={index}
                onRemove={onRemove}
                onValuesChange={onValuesChange}
              />
              <File
                item={cer}
                index={index}
                type={type}
                onNotAvailableClick={onNotAvailableClick}
                onViewCommentClick={onViewCommentClick}
                onViewDocumentClick={onViewDocumentClick}
              />
            </div>
          ))}

          <div className={styles.addBtn} onClick={onAdd}>
            <PlusOutlined className={styles.plusIcon} />
            <span className={styles.title}>Please Add any relevant Certifications Info</span>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(TechnicalCertification);
