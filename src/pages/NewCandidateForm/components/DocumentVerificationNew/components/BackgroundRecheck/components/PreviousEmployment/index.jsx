import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';
import { connect } from 'umi';
import File from '../File';
import EmployerDetails from './components/EmployerDetails';
import styles from './index.less';

const PreviousEmployment = (props) => {
  const {
    layout: { type = '', name = '' } = {},
    items = [],
    onVerifyDocument = () => {},
    onViewCommentClick = () => {},
  } = props;

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
              <EmployerDetails index={i} employer={item} />
              <div className={styles.someText}>Proof of employment</div>
              {item.data
                .filter((x) => x.value || x.required)
                .map((x, j) => (
                  <File
                    item={x}
                    index={j}
                    type={type}
                    onVerifyDocument={onVerifyDocument}
                    onViewCommentClick={onViewCommentClick}
                    blockIndex={i}
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
