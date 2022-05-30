import { Col, Row } from 'antd';
import React, { useState } from 'react';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { TIMEOFF_TYPE } from '@/utils/timeOff';
import LeaveProgressBar from '../LeaveProgressBar';
import SpecialLeaveBox from '../SpecialLeaveBox';
import styles from './index.less';

const colorsList = ['#2C6DF9', '#FD4546', '#6236FF'];
const colorsList1 = ['#2C6DF9', '#FFA100'];

const CollapseInformation = (props) => {
  const { commonLeaves = [], specialLeaves = [] } = props;

  const [viewDocumentModal, setViewDocumentModal] = useState(false);

  const renderPolicyLink = (policy) => {
    if (policy) {
      if (Object.keys(policy).length !== 0) {
        const {
          key = '',
          //  _id = ''
        } = policy;

        return <a onClick={() => setViewDocumentModal(true)}>{key || 'Unknown name'}</a>;
      }
    }
    return <a onClick={() => setViewDocumentModal(true)}>Standard Policy</a>;
  };

  const typeAList = commonLeaves.filter((x) => x.type === TIMEOFF_TYPE.A);

  return (
    <div className={styles.CollapseInformation}>
      <div className={styles.hrLine} />
      <div className={styles.container}>
        <div className={styles.secondTitle}>
          <span className={styles.secondTitle__left}>Common Leaves</span>
          <div className={styles.secondTitle__right}>
            <span>Under </span>
            {renderPolicyLink()}
          </div>
        </div>
        <div className={styles.leaveProgressBars}>
          {typeAList.map((type, index) => (
            <div key={`${index + 1}`}>
              <LeaveProgressBar color={colorsList[index % 3]} type={type} />
              {index + 1 < typeAList.length && <div className={styles.hr} />}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.hrLine} />
      <div className={styles.container}>
        <div className={styles.secondTitle}>
          <span className={styles.secondTitle__left}>Special Leaves</span>
          <div className={styles.secondTitle__right}>
            <span>Under </span>
            {renderPolicyLink()}
          </div>
        </div>
        <Row className={styles.leaveProgressBars}>
          {specialLeaves.map((type, index) => (
            <Col key={`${index + 1}`} span={24}>
              <SpecialLeaveBox color={colorsList1[index % 2]} type={type} />
              {index + 1 !== specialLeaves.length && <div className={styles.hr} />}
            </Col>
          ))}
        </Row>
      </div>
      <ViewDocumentModal visible={viewDocumentModal} onClose={setViewDocumentModal} />
    </div>
  );
};
export default CollapseInformation;
