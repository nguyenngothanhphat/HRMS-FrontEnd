/* eslint-disable react/jsx-props-no-spreading */
import { Card, Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { OFFBOARDING } from '@/constants/offboarding';
import { getEmployeeName } from '@/utils/offboarding';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import DownArrowIcon from '@/assets/offboarding/downArrow.png';
import styles from './index.less';

const Assignee = (props) => {
  const {
    item: { status = '', hrStatus = '', assigned = {}, managerUpdatedBy = {} } = {},
    user: { currentUser = {} } = {},
  } = props;
  const { hr = {}, manager = {}, delegateManager = {} } = assigned || {};

  const [hrAssignees, setHrAssignees] = useState([]);
  const [managerAssignees, setManagerAssignees] = useState([]);

  const getType = (type) => (type ? 'Primary' : 'Secondary');

  const getStatus = (stt) => {
    if (stt === OFFBOARDING.STATUS.ACCEPTED) {
      return 'accepted';
    }
    if (stt === OFFBOARDING.STATUS.REJECTED) {
      return 'rejected';
    }
    return null;
  };

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
        highlight:
          hrStatus === OFFBOARDING.STATUS.ACCEPTED || hrStatus === OFFBOARDING.STATUS.REJECTED,
        status: getStatus(hrStatus),
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
        highlight: status === OFFBOARDING.STATUS.ACCEPTED && managerUpdatedBy?._id === manager?._id,
        status: getStatus(status),
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
        highlight:
          status === OFFBOARDING.STATUS.ACCEPTED && managerUpdatedBy?._id === delegateManager?._id,
        status: getStatus(status),
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
            <Row align="middle" gutter={[24, 24]}>
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
                      status={y.status}
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
                      highlight={y.highlight}
                      status={y.status}
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
