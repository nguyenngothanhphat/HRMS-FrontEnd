import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { mapType } from '@/utils/newCandidateForm';
import Certification from './components/Certification';
import styles from './index.less';

const TechnicalCertification = (props) => {
  const { dispatch, layout: { type = '', name = '' } = {}, layout = {}, items = [] } = props;

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
            <Certification
              certification={cer}
              length={items.length}
              index={index}
              onRemove={onRemove}
              onValuesChange={onValuesChange}
            />
          ))}

          <div className={styles.addBtn} onClick={onAdd}>
            <PlusOutlined className={styles.plusIcon} />
            <span className={styles.title}>Add other Certifications</span>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(TechnicalCertification);
