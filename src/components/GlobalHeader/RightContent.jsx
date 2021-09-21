// import { Tooltip, Tag } from 'antd';
import { isOwner } from '@/utils/authority';
import { BellOutlined, BuildOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import GlobalEmployeeSearch from './components/GlobalEmployeeSearch';
import SelectCompanyModal from './components/SelectCompanyModal';
import styles from './index.less';
import GlobalSearchNew from './components/GlobalSearchNew/index';

const GlobalHeaderRight = (props) => {
  const {
    theme,
    layout,
    dispatch,
    currentUser,
    companiesOfUser,
    employeesManagement: { searchEmployeesList = [] },
    loadingList,
  } = props;
  const [visible, setVisible] = useState(false);

  const [isSwitchCompanyVisible, setIsSwitchCompanyVisible] = useState(false);
  const checkIsOwner =
    isOwner() && currentUser.signInRole.map((role) => role.toLowerCase()).includes('owner');

  let className = styles.right;

  const handleCancel = () => {
    setVisible(!visible);
  };

  const handleSearch = (value) => {
    setVisible(!visible);
    dispatch({
      type: 'employeesManagement/fetchSearchEmployeesList',
      payload: {
        query: value,
      },
    });
  };

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Search"
        visible={visible}
        onSearch={(value) => {
          if (value) {
            handleSearch(value);
          }
        }}
      /> */}
      <GlobalSearchNew />
      <div className={`${styles.action} ${styles.notify}`}>
        <BellOutlined />
      </div>
      {!(!checkIsOwner && companiesOfUser.length === 1) && (
        <>
          <Tooltip title="Switch company">
            <div
              className={`${styles.action} ${styles.notify}`}
              onClick={() => setIsSwitchCompanyVisible(true)}
            >
              <BuildOutlined />
            </div>
          </Tooltip>
        </>
      )}
      {/* {buttonSwitch()} */}

      <Avatar />
      <GlobalEmployeeSearch
        titleModal="GLOBAL EMPLOYEE SEARCH"
        visible={visible}
        handleCancel={handleCancel}
        employeesList={searchEmployeesList}
        loading={loadingList}
      />
      <SelectCompanyModal visible={isSwitchCompanyVisible} onClose={setIsSwitchCompanyVisible} />
    </div>
  );
};

export default connect(
  ({
    settings,
    user: { companiesOfUser = [], currentUser = {} },
    employeesManagement,
    loading,
  }) => ({
    theme: settings.navTheme,
    layout: settings.layout,
    employeesManagement,
    currentUser,
    companiesOfUser,
    loadingList: loading.effects['employeesManagement/fetchSearchEmployeesList'],
  }),
)(GlobalHeaderRight);
