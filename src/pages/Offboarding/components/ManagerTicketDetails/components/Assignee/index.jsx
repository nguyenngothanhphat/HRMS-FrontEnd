/* eslint-disable react/jsx-props-no-spreading */
import { Card, Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DownArrowIcon from '@/assets/offboarding/downArrow.png';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import DebounceSelect from '@/components/DebounceSelect';
import { OFFBOARDING } from '@/constants/offboarding';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const Assignee = (props) => {
  const {
    dispatch,
    item: {
      _id = '',
      employee = {},
      assigned = {},
      status = '',
      hrStatus = '',
      managerUpdatedBy = {},
    } = {},
    offboarding: { employeeList = [] },
    user: { currentUser = {} } = {},
  } = props;
  const { hr = {}, manager = {}, delegateManager = {} } = assigned || {};

  const [hrAssignees, setHrAssignees] = useState([]);
  const [managerAssignees, setManagerAssignees] = useState([]);

  const [delegating, setDelegating] = useState(false);
  const [secondaryManager, setSecondaryManager] = useState(null);

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

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'globalData/fetchEmployeeListEffect',
      payload: {
        name: value,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data
        .filter((x) => x._id !== employee?._id)
        .map((user) => ({
          label: user.generalInfo?.legalName,
          value: user._id,
        }));
    });
  };

  const onDelegate = async () => {
    if (
      managerAssignees.length > 1 &&
      managerAssignees?.[managerAssignees.length - 1]?._id !== delegateManager?._id
    ) {
      const res = await dispatch({
        type: 'offboarding/updateRequestEffect',
        payload: {
          id: _id,
          employeeId: employee?._id,
          action: OFFBOARDING.UPDATE_ACTION.MANAGER_DELEGATE,
          assigned: {
            delegateManager: managerAssignees[1]?._id,
          },
        },
      });
      if (res.statusCode === 200) {
        setDelegating(false);
      }
    } else {
      setDelegating(false);
    }
  };

  useEffect(() => {
    if (secondaryManager) {
      const newManagerAssignees = JSON.parse(JSON.stringify(managerAssignees));
      const newManager = employeeList.find((x) => x._id === secondaryManager.value);
      const newObj = {
        primary: false,
        name: getEmployeeName(newManager?.generalInfo),
        title: newManager?.title?.name,
        userId: newManager?.generalInfo?.userId,
        avatar: newManager?.generalInfo?.avatar,
        _id: newManager?._id,
      };
      if (newManagerAssignees.length === 1) {
        newManagerAssignees.push(newObj);
      } else {
        newManagerAssignees[1] = newObj;
      }
      setManagerAssignees(newManagerAssignees);
      setSecondaryManager(null);
    }
  }, [JSON.stringify(secondaryManager)]);

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

  useEffect(() => {
    return () => {
      dispatch({
        type: 'offboarding/save',
        payload: {
          employeeList: [],
        },
      });
    };
  }, []);

  const renderContent = () => {
    return (
      <div className={styles.container}>
        <div className={styles.block}>
          <p className={styles.block__title}>HR Approval</p>
          <div className={styles.block__members}>
            <Row align="middle" gutter={[24, 24]}>
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

        <div className={styles.block}>
          <p className={styles.block__title}>Manager approval</p>
          {delegating && (
            <div className={styles.block__searchEmployeeSelector}>
              <DebounceSelect
                placeholder="Search to assign"
                fetchOptions={onEmployeeSearch}
                showSearch
                value={secondaryManager?.value}
                onChange={(value) => {
                  setSecondaryManager(value);
                }}
                labelInValue
              />
            </div>
          )}
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
      </div>
    );
  };

  const renderButtons = () => {
    if (status !== OFFBOARDING.STATUS.IN_PROGRESS) {
      return null;
    }
    return (
      <div className={styles.actions}>
        <p>
          In case of your unavailability, you may assign this request to someone from the superior
          officers.
        </p>

        <CustomPrimaryButton onClick={delegating ? () => onDelegate() : () => setDelegating(true)}>
          {delegating ? 'Done' : 'Delegate this request'}
        </CustomPrimaryButton>
      </div>
    );
  };

  return (
    <Card title="This request is assigned to:" className={styles.Assignee}>
      {renderContent()}
      {renderButtons()}
    </Card>
  );
};

export default connect(({ offboarding, user }) => ({
  offboarding,
  user,
}))(Assignee);
