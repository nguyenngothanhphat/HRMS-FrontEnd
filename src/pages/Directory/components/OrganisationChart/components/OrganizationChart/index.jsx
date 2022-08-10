import { UserOutlined } from '@ant-design/icons';
import { Avatar, Popover, Spin } from 'antd';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { connect } from 'umi';
import lines from '@/assets/lines.svg';
import line from '@/assets/lineParent.svg';
import bigLines from '@/assets/bigLines.svg';
import avtDefault from '@/assets/avtDefault.jpg';
import EmployeeNode from './components/EmployeeNode';
import ManagerNode from './components/ManagerNode';
import UserNode from './components/UserNode';
import styles from './index.less';

const OrganizationChart = (props) => {
  const { dataOrgChart = {}, loading, selectedId, setSelectedId = () => {} } = props;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsedChild, setIsCollapsedChild] = useState(true);

  const handleCollapse = (name) => {
    if (name === 'parent') {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsCollapsedChild(!isCollapsedChild);
    }
  };

  const truncate = (value) => {
    if (value.length > 30) {
      return `${value.substr(0, 12)}...`;
    }
    return value;
  };

  const truncateLegalName = (value) => {
    if (value.length > 20) {
      return (
        <Popover
          placement="top"
          content={<span style={{ fontWeight: 500 }}>{value}</span>}
          trigger="hover"
        >
          {value.substr(0, 15)}...
        </Popover>
      );
    }
    return value;
  };

  const clickCardInfo = (userData) => {
    setSelectedId(userData._id);
  };

  const renderCardInfo = (userData, name) => {
    const {
      generalInfo: {
        legalName = '',
        avatar = '',
        firstName: userFirstName = '',
        middleName: userMiddleName = '',
        lastName: userLastName = '',
      } = {} || {},
      department: { name: deptName = '' } = {} || {},
      title: { name: jobTitleName = '' } = {} || {},
      location: {
        headQuarterAddress: { country: { name: countryName = '' } = {} || {} } = {} || {},
      } = {} || {},
    } = userData;
    const legalFullName = legalName || `${userFirstName} ${userMiddleName} ${userLastName}`;

    const popupImg = (url) => {
      return (
        <div className={styles.popupImg}>
          <img src={url} alt="avatar" />
        </div>
      );
    };

    return (
      <div className={styles.node__card} onClick={() => clickCardInfo(userData, name)}>
        <Popover placement="rightTop" content={popupImg(avatar || avtDefault)} trigger="hover">
          <Avatar
            className={styles.avatar}
            src={avatar || avtDefault}
            size={42}
            icon={<UserOutlined />}
          />
        </Popover>
        <div className={styles.node__card__info}>
          <div className={styles.legalName}>{truncateLegalName(legalFullName)}</div>
          <div className={styles.deptName}>{`${truncate(jobTitleName)}, ${deptName}`}</div>
          <div className={styles.countryName}>{countryName}</div>
        </div>
      </div>
    );
  };

  const renderManagerNode = () => {
    const { dataOrgChart: { manager = {} } = {} } = props;
    const propsState = { itemSelected: selectedId, isCollapsed };

    return (
      <>
        {isEmpty(manager) ? null : (
          <ManagerNode
            renderCardInfo={renderCardInfo}
            handleCollapse={handleCollapse}
            propsState={propsState}
            manager={manager}
          />
        )}
      </>
    );
  };

  const renderUserNode = () => {
    const propsState = { itemSelected: selectedId, isCollapsedChild };
    if (isEmpty(dataOrgChart)) return null;

    return (
      <UserNode
        renderCardInfo={renderCardInfo}
        handleCollapse={handleCollapse}
        propsState={propsState}
        dataOrgChart={dataOrgChart}
      />
    );
  };

  const renderChildrenList = () => {
    const { employees: listEmployees = [] } = dataOrgChart;

    const handleGetLine = (length) => {
      if (length === 1) return line;
      if (length > 2) return bigLines;
      return lines;
    };

    const checkCollapse = () => {
      let collapse = false;
      if (isCollapsed) {
        if (isCollapsedChild) {
          collapse = isCollapsedChild;
        }
      }

      return collapse;
    };

    if (listEmployees.length === 0) return null;
    listEmployees.sort((a, b) => {
      const nameA = a.generalInfo?.legalName?.toLowerCase();
      const nameB = b.generalInfo?.legalName?.toLowerCase();
      // eslint-disable-next-line no-nested-ternary
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
    return (
      <Collapse isOpened={isCollapsedChild}>
        <div className={styles.nodesTree}>
          <div className={styles.lineNode}>
            <div className={styles.lineNode__line}>
              <img alt="lines" src={handleGetLine(listEmployees.length)} />
            </div>
          </div>
          <div className={styles.childrenList}>
            {listEmployees.map((employee) => {
              return (
                <EmployeeNode
                  isCollapsed={checkCollapse()}
                  key={employee._id}
                  itemSelected={selectedId}
                  employee={employee}
                  renderCardInfo={renderCardInfo}
                />
              );
            })}
          </div>
        </div>
      </Collapse>
    );
  };

  const { manager = {} } = dataOrgChart;

  return (
    <div className={styles.orgChartRoot}>
      {loading ? (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.charts}>
          {renderManagerNode()}

          <Collapse isOpened={isCollapsed} hasNestedCollapse>
            {isEmpty(manager) ? null : (
              <div className={styles.charts__line}>
                <img alt="line" src={line} />
              </div>
            )}
            {renderUserNode()}
            {renderChildrenList()}
          </Collapse>
        </div>
      )}
    </div>
  );
};

export default connect(
  ({ employee: { dataOrgChart = {}, listEmployeeAll = [] } = {}, loading }) => ({
    dataOrgChart,
    loading: loading.effects['employee/fetchDataOrgChart'],
    listEmployeeAll,
  }),
)(OrganizationChart);
