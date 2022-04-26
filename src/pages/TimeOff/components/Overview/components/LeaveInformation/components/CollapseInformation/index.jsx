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
  const {
    typesOfCommonLeaves = [],
    typesOfSpecialLeaves = [],
    policyCommonLeaves = {},
    policySpecialLeaves = {},
    timeOffTypes = [],
  } = props;

  const [viewDocumentModal, setViewDocumentModal] = useState(false);

  const renderPolicyLink = (policy) => {
    if (policy !== null) {
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

  const typeAList = typesOfCommonLeaves.filter((x) => x.defaultSettings?.type === TIMEOFF_TYPE.A);

  return (
    <div className={styles.CollapseInformation}>
      <div className={styles.hrLine} />
      <div className={styles.container}>
        <div className={styles.secondTitle}>
          <span className={styles.secondTitle__left}>Common Leaves</span>
          <div className={styles.secondTitle__right}>
            <span>Under </span>
            {renderPolicyLink(policyCommonLeaves)}
          </div>
        </div>
        <div className={styles.leaveProgressBars}>
          {typeAList.map((type, index) => {
            const { currentAllowance = 0, defaultSettings = {} } = type;
            if (defaultSettings) {
              const { name = '', shortType = '', _id = '' } = defaultSettings;
              const foundType = timeOffTypes.find((t) => t._id === _id) || {};
              return (
                <div key={`${index + 1}`}>
                  <LeaveProgressBar
                    color={colorsList[index % 3]}
                    title={name}
                    shortType={shortType}
                    stepNumber={currentAllowance}
                    limitNumber={foundType.noOfDays}
                  />
                  {index + 1 < typeAList.length && <div className={styles.hr} />}
                </div>
              );
            }
            return '';
          })}
        </div>
      </div>
      <div className={styles.hrLine} />
      <div className={styles.container}>
        <div className={styles.secondTitle}>
          <span className={styles.secondTitle__left}>Special Leaves</span>
          <div className={styles.secondTitle__right}>
            <span>Under </span>
            {renderPolicyLink(policySpecialLeaves)}
          </div>
        </div>
        <Row className={styles.leaveProgressBars}>
          {typesOfSpecialLeaves.map((type, index) => {
            const { currentAllowance = 0, defaultSettings = {} } = type;
            if (defaultSettings) {
              const { name = '', shortType = '' } = defaultSettings;
              return (
                <Col key={`${index + 1}`} span={24}>
                  <SpecialLeaveBox
                    color={colorsList1[index % 2]}
                    title={name}
                    shortType={shortType}
                    days={currentAllowance}
                  />
                  {index + 1 !== typesOfSpecialLeaves.length && <div className={styles.hr} />}
                </Col>
              );
            }
            return '';
          })}
        </Row>
      </div>
      <ViewDocumentModal visible={viewDocumentModal} onClose={setViewDocumentModal} />
    </div>
  );
};
export default CollapseInformation;
