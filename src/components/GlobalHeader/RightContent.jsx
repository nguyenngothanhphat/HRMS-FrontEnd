// import { Tooltip, Tag } from 'antd';
import { getSwitchRoleAbility, isOwner } from '@/utils/authority';
import { BellOutlined, BuildOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import GlobalEmployeeSearch from './components/GlobalEmployeeSearch';
import SelectCompanyModal from './components/SelectCompanyModal';
import styles from './index.less';

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

  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isSwitchCompanyVisible, setIsSwitchCompanyVisible] = useState(false);
  const checkIsOwner =
    isOwner() && currentUser.signInRole.map((role) => role.toLowerCase()).includes('owner');

  useEffect(() => {
    let authority = JSON.parse(localStorage.getItem('antd-pro-authority'));
    authority = authority.filter(
      (item) => item === 'owner' || item === 'admin' || item === 'employee',
    );

    authority.forEach((item) => {
      if (item.includes('owner')) {
        setIsCheck(false);
      } else if (item === 'admin') {
        setIsCheck(false);
      } else {
        setIsCheck(true);
      }
    });
    setLoading(false);
  }, [setIsCheck, setLoading]);

  function buttonSwitch() {
    let checkAdmin = false;
    const { signInRole = [] } = currentUser;

    const formatRole = signInRole.map((role) => role.toLowerCase());

    formatRole.forEach((item) => {
      if (item.includes('admin')) {
        checkAdmin = true;
      }
    });

    const handleSwitch = async () => {
      let isSwitch = false;

      // if press Switch button is ON
      if (isCheck) {
        if (checkAdmin) {
          isSwitch = false;
        }
      } else {
        isSwitch = true;
      }
      setIsCheck(!isCheck);
      setLoading(true);

      await dispatch({
        type: 'user/fetchCurrent',
        isSwitchingRole: isSwitch,
      });

      // history.push('/dashboard');
      window.location.reload();
    };

    const switchRoleAbility = getSwitchRoleAbility();
    return (
      <>
        {switchRoleAbility ? (
          <div className={`${styles.action} ${styles.switchRole}`} onClick={handleSwitch}>
            <span className={styles.roleTitle}>
              {loading ? <LoadingOutlined /> : <>{!isCheck ? 'EMPLOYEE' : 'ADMIN'}</>}
            </span>
          </div>
        ) : null}
      </>
    );
  }

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
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Search"
        visible={visible}
        onSearch={(value) => {
          if (value) {
            handleSearch(value);
          }
        }}
      />
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
