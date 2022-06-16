/* eslint-disable react/jsx-props-no-spreading */
import { Card, Col, Empty, Row, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'umi';
import DownArrowIcon from '@/assets/offboarding/downArrow.png';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        <Spin size="small" spinning={fetching}>
          <Empty description="No data, type to search" />
        </Spin>
      }
      {...props}
    >
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
}

const Assignee = (props) => {
  const {
    dispatch,
    item: { assigned = {} } = {},
    offboarding: { employeeList = [] },
  } = props;
  const { hr = {}, manager = {} } = assigned || {};

  const [hrAssignees, setHrAssignees] = useState([]);
  const [managerAssignees, setManagerAssignees] = useState([]);

  const [delegating, setDelegating] = useState(false);
  const [secondaryManager, setSecondaryManager] = useState(null);

  const getType = (type) => (type ? 'Primary' : 'Secondary');

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'offboarding/fetchEmployeeListEffect',
      payload: {
        name: value,
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfo?.legalName,
        value: user._id,
      }));
    });
  };

  const onDelegate = () => {
    console.log('🚀  ~ done');
    setDelegating(false);
  };

  useEffect(() => {
    if (secondaryManager) {
      const newManagerAssignees = JSON.parse(JSON.stringify(managerAssignees));
      const newManager = employeeList.find((employee) => employee._id === secondaryManager.value);
      const newObj = {
        primary: false,
        name: getEmployeeName(newManager?.generalInfo),
        title: newManager?.title?.name,
        userId: newManager?.generalInfo?.userId,
        avatar: newManager?.generalInfo?.avatar,
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
      },
    ]);
    setManagerAssignees([
      {
        primary: true,
        name: getEmployeeName(manager?.generalInfoInfo),
        title: manager?.titleInfo?.name,
        userId: manager?.generalInfoInfo?.userId,
        avatar: manager?.generalInfoInfo?.avatar,
      },
    ]);
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
            <Row align="middle" gutter={[0, 24]}>
              {hrAssignees.map((y) => (
                <>
                  <Col span={19}>
                    <CustomEmployeeTag
                      name={y.name}
                      title={y.title}
                      avatar={y.avatar}
                      userId={y.userId}
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

export default connect(({ offboarding }) => ({
  offboarding,
}))(Assignee);
