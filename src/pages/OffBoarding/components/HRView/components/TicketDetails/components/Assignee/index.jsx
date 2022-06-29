/* eslint-disable react/jsx-props-no-spreading */
import { Card, Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getEmployeeName, OFFBOARDING } from '@/utils/offboarding';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import DownArrowIcon from '@/assets/offboarding/downArrow.png';
import styles from './index.less';

const Assignee = (props) => {
  const { item: { status = '', assigned = {} } = {}, user: { currentUser = {} } = {} } = props;
  const { hr = {}, manager = {}, delegateManager = {} } = assigned || {};

  const [hrAssignees, setHrAssignees] = useState([]);
  const [managerAssignees, setManagerAssignees] = useState([]);

  const getType = (type) => (type ? 'Primary' : 'Secondary');

  useEffect(() => {
    setHrAssignees([
      {
        primary: true,
        name: getEmployeeName(hr?.generalInfoInfo),
        title: hr?.titleInfo?.name,
        userId: hr?.generalInfoInfo?.userId,
        avatar: hr?.generalInfoInfo?.avatar,
        _id: hr?._id,
        isYou: currentUser?.employee?._id === hr?._id,
      },
    ]);
    const managerTemp = [
      {
        primary: true,
        name: getEmployeeName(manager?.generalInfoInfo),
        title: manager?.titleInfo?.name,
        userId: manager?.generalInfoInfo?.userId,
        avatar: manager?.generalInfoInfo?.avatar,
        _id: manager?._id,
        isYou: currentUser?.employee?._id === manager?._id,
        highlight: status === OFFBOARDING.STATUS.ACCEPTED,
      },
    ];
    if (!isEmpty(delegateManager)) {
      managerTemp.push({
        primary: false,
        name: getEmployeeName(delegateManager?.generalInfoInfo),
        title: delegateManager?.titleInfo?.name,
        userId: delegateManager?.generalInfoInfo?.userId,
        avatar: delegateManager?.generalInfoInfo?.avatar,
        _id: delegateManager?._id,
        isYou: currentUser?.employee?._id === delegateManager?._id,
      });
    }
    setManagerAssignees(managerTemp);
  }, [JSON.stringify(assigned)]);

  const renderContent = () => {
    return (
      <div className={styles.container}>
        <div className={styles.block}>
          <p className={styles.block__title}>Manager approval</p>

          <div className={styles.block__members}>
            <Row align="middle" gutter={[0, 24]}>
              {managerAssignees.map((y) => (
                <>
                  <Col span={19}>
                    <CustomEmployeeTag
                      name={y.name}
                      title={y.title}
                      avatar={y.avatar}
                      userId={y.userId}
                      isYou={y.isYou}
                      highlight={y.highlight}
                    />
                  </Col>
                  <Col span={5}>
                    <div className={styles.options}>
                      <span className={styles.type}>{getType(y.primary)}</span>
                      {!y.primary && (
                        <img src={DownArrowIcon} alt="" className={styles.arrowIcon} />
                      )}
                    </div>
                  </Col>
                </>
              ))}
            </Row>
          </div>
        </div>

        <div className={styles.block}>
          <p className={styles.block__title}>HR Approval</p>
          <div className={styles.block__members}>
            <Row align="middle" gutter={[0, 24]}>
              {hrAssignees.map((y) => (
                <>
                  <Col span={19}>
                    <CustomEmployeeTag
                      name={y.name}
                      title={y.title}
                      avatar={y.avatar}
                      userId={y.userId}
                      isYou={y.isYou}
                    />
                  </Col>
                  <Col span={5}>
                    <div className={styles.options}>
                      <span className={styles.type}>{getType(y.primary)}</span>
                    </div>
                  </Col>
                </>
              ))}
            </Row>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card title="This request is assigned to:" className={styles.Assignee}>
      {renderContent()}
    </Card>
  );
};

export default connect(({ offboarding, user }) => ({
  offboarding,
  user,
}))(Assignee);
