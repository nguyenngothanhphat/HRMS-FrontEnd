import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { mapType } from '@/utils/newCandidateForm';
import File from '../File';
import EmployerDetails from './components/EmployerDetails';
import styles from './index.less';

const PreviousEmployment = (props) => {
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

  const onValuesChange = (index, values) => {
    const result = [...items];
    result[index] = { ...result[index], ...values };
    onSaveRedux(result);
  };

  // const getDisabledCurrentlyWorking = (obj, index) => {
  //   const findIndex = items.findIndex((x) => x.currentlyWorking);
  //   if (findIndex === -1) return false;
  //   return findIndex !== index;
  // };

  return (
    <div className={styles.PreviousEmployment}>
      <Collapse
        accordion
        defaultActiveKey="1"
        expandIconPosition="right"
        expandIcon={({ isActive }) => {
          return isActive ? <MinusOutlined /> : <PlusOutlined />;
        }}
      >
        <Collapse.Panel
          key="1"
          header={
            <span style={{ display: 'inline-block' }}>
              Type {type}: {name}
            </span>
          }
        >
          {items.map((item, i) => (
            <div className={styles.container}>
              <EmployerDetails
                index={i}
                onValuesChange={onValuesChange}
                employer={item}
                // disabledCurrentlyWorking={getDisabledCurrentlyWorking(item, i)}
              />
              <div className={styles.someText}>Proof of employment</div>
              {item.data
                .filter((x) => x.value || x.required)
                .map((x, j) => (
                  <File
                    item={x}
                    index={j}
                    type={type}
                    onNotAvailableClick={onNotAvailableClick}
                    onViewCommentClick={onViewCommentClick}
                    onViewDocumentClick={onViewDocumentClick}
                  />
                ))}
            </div>
          ))}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default connect(({ candidatePortal: { candidate = '', data, tempData } = {} }) => ({
  data,
  tempData,
  candidate,
}))(PreviousEmployment);
