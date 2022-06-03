import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu, Spin, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, formatMessage, history } from 'umi';
import { IS_TERRALOGIC_LOGIN } from '@/utils/login';
import avtDefault from '@/assets/defaultAvatar.png';
import {
  setCurrentLocation,
  setTenantId,
  getCurrentTenant,
  getCurrentCompany,
  getCurrentLocation,
  // getAuthority,
  isOwner,
  isAdmin,
  setCurrentCompany,
  // getIsSwitchingRole,
  getSwitchRoleAbility,
} from '@/utils/authority';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = (props) => {
  const {
    currentUser = {},
    dispatch,
    signInRole = [],
    manageTenant = [],
    currentUser: {
      employee: { _id: employeeID = '', generalInfo: { userId = '' } = {} } = {},
    } = {},
    currentUser: { _id: adminOwnerID = '' } = {},
    companyLocationList = [],
    manageLocation = [],
  } = props;
  const { firstName: name = '', avatar = {} } = currentUser;

  const [LOGOUT] = useState('logout');
  const [CHANGE_PASSWORD] = useState('changePassword');
  const [SWITCH_ROLE] = useState('switchRole');
  const [SETTINGS] = useState('settings');
  const [selectLocationAbility, setSelectLocationAbility] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    const checkIsOwner = isOwner();

    const formatSignInRole = signInRole.map((role) => role.toLowerCase());
    if (checkIsOwner || formatSignInRole.includes('owner')) {
      dispatch({
        type: 'location/fetchLocationListByParentCompany',
        payload: {
          company: companyId,
          tenantIds: manageTenant,
        },
      });
    } else {
      dispatch({
        type: 'location/fetchLocationsByCompany',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }

    setSelectLocationAbility(true);

    const authority = JSON.parse(localStorage.getItem('antd-pro-authority')) || [];
    const check = authority.includes('admin') || authority.includes('owner');
    setIsCheck(!check);

    setLoading(false);
  }, []);

  const viewProfile = async () => {
    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();
    localStorage.setItem('tenantCurrentEmployee', tenantId);
    localStorage.setItem('companyCurrentEmployee', companyId);
    localStorage.setItem('idCurrentEmployee', employeeID);
    await dispatch({
      type: 'employeeProfile/save',
      payload: {
        tenantCurrentEmployee: tenantId,
        companyCurrentEmployee: companyId,
      },
    });

    const checkIsAdmin = isAdmin();
    const checkIsOwner = isOwner();
    if (checkIsAdmin || checkIsOwner) {
      history.replace(`/user-profile/${adminOwnerID}`);
    } else {
      history.push(`/directory/employee-profile/${userId}`);
    }
  };

  const wait = (delay, ...args) => {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      setTimeout(resolve, delay, ...args);
    });
  };

  const handleSwitch = async () => {
    let checkAdmin = false;

    let isSwitch = false;
    const formatRole = signInRole.map((role) => role.toLowerCase());

    formatRole.forEach((item) => {
      if (item.includes('admin')) {
        checkAdmin = true;
      }
    });

    // if press Switch button is ON

    // NOTE: ADMIN MODE
    // currently, EMPLOYEE mode is default when a user has two roles ADMIN & EMPLOYEE login.
    // if you have to change the code that ADMIN by default,
    // just "if (isCheck)" and "if (!isSwitchingRole)" in the user/fetchCurrent
    if (!isCheck) {
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

    localStorage.removeItem('currentLocationId');

    const { pathname } = window.location;
    if (pathname === '/dashboard') {
      window.location.reload();
    } else history.replace('/');
  };

  const onMenuClick = async (event) => {
    const { key } = event;

    if (key === LOGOUT) {
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }

    if (key === CHANGE_PASSWORD) {
      history.push('/change-password');
      return;
    }

    if (key === SETTINGS) {
      // eslint-disable-next-line no-alert
      alert('Settings');
      return;
    }

    if (key === SWITCH_ROLE) {
      handleSwitch();
      return;
    }

    if (key === 'ALL') {
      // eslint-disable-next-line no-alert
      localStorage.removeItem('currentLocationId');
      window.location.reload();
      return;
    }

    let selectLocation = '';
    // setCurrentLocation(key);
    const currentCompany = getCurrentCompany();
    let newCompId = '';
    let newCompName = '';
    let newCompTenant = '';

    companyLocationList.forEach((value) => {
      const {
        _id = '',
        company: {
          _id: parentCompId = '',
          name: parentCompName = '',
          tenant: parentTenant = '',
        } = {},
      } = value;
      if (key === _id) {
        selectLocation = _id;
      }
      // ONLY OWNER
      if (_id === key && currentCompany !== parentCompId) {
        newCompId = parentCompId;
        newCompName = parentCompName;
        newCompTenant = parentTenant;
      }
    });

    // ONLY OWNER
    if (newCompId) {
      setCurrentCompany(newCompId);
      setTenantId(newCompTenant);
      notification.success({
        message: `Switching to ${newCompName} company...`,
      });
      await wait(1500).then(() => window.location.reload());
    }

    if (selectLocation) {
      setCurrentLocation(selectLocation);
      window.location.reload();
      // history.push(`/`);
      return;
    }

    viewProfile();
  };

  const renderLocationList = () => {
    const currentLocation = getCurrentLocation();
    const currentCompany = getCurrentCompany();
    const checkIsOwner = isOwner();
    const checkIsAdmin = isAdmin();

    const formatSignInRole = signInRole.map((role) => role.toLowerCase());

    let commonLocationsList = [];
    if (checkIsOwner) {
      commonLocationsList = [...companyLocationList];
    } else if (checkIsAdmin) {
      commonLocationsList = [...manageLocation];
    } else if (formatSignInRole.includes('owner')) {
      commonLocationsList = [...companyLocationList];
    } else {
      const employeeLocation = companyLocationList.filter(
        (location) => location?._id === currentLocation,
      );
      commonLocationsList = [...employeeLocation];
    }

    return (
      <>
        <Menu.Divider className={styles.secondDivider} />
        <Menu.Item className={styles.selectLocation}>Locations</Menu.Item>
        {(checkIsOwner || checkIsAdmin) && (
          <Menu.Item
            key="ALL"
            className={
              currentLocation && currentLocation !== 'undefined'
                ? styles.menuItemLink
                : styles.menuItemLink2
            }
          >
            All
          </Menu.Item>
        )}
        {commonLocationsList.map((value) => {
          const {
            _id = '',
            name: locationName = '',
            company: { _id: parentCompId = '', name: parentCompName = '' } = {},
          } = value;
          return (
            <Menu.Item
              key={_id}
              className={currentLocation !== _id ? styles.menuItemLink : styles.menuItemLink2}
            >
              {parentCompId && currentCompany !== parentCompId && `${parentCompName} - `}{' '}
              {locationName}
            </Menu.Item>
          );
        })}
      </>
    );
  };

  const switchRole = () => {
    const switchRoleAbility = getSwitchRoleAbility();

    return (
      <>
        {switchRoleAbility && (
          <>
            <Menu.Divider className={styles.secondDivider} />
            <Menu.Item key={SWITCH_ROLE} className={styles.menuItemLink}>
              {loading
                ? 'Switching...'
                : `
                Switch to ${isCheck ? 'Admin' : 'Employee'}`}
            </Menu.Item>
          </>
        )}
      </>
    );
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* AVATAR AND INFORMATION */}
      <Menu.Item className={styles.menu__customItem}>
        <div className={styles.viewProfile}>
          <div className={styles.viewProfileAvatar}>
            <Avatar
              size={50}
              className={styles.avatar}
              icon={<UserOutlined />}
              src={currentUser?.employee?.generalInfo?.avatar || avatar?.url || avtDefault}
            />
          </div>
          <div className={styles.viewProfileInfo}>
            <p>{currentUser?.employee?.generalInfo?.legalName || name}</p>
            {currentUser?.employee?.generalInfo?.employeeId && (
              <p>
                {currentUser?.employee?.title?.name} -{' '}
                {currentUser?.employee?.generalInfo?.employeeId}
              </p>
            )}
            {isOwner() && <p>Owner</p>}
          </div>
        </div>
      </Menu.Item>

      {/* VIEW PROFILE BUTTON */}
      {currentUser && (
        <Menu.Item className={styles.menu__customItem}>
          <div className={styles.viewProfileBtn}>
            <Button onClick={viewProfile} className={styles.buttonLink}>
              {formatMessage({ id: 'component.globalHeader.avatarDropdown.view-profile' })}
            </Button>
          </div>
        </Menu.Item>
      )}

      {/* CHANGE PASSWORD */}
      {/* terralogic user cannot change/reset password, only use Google Signin (ticket #852 - gitlab) */}
      {!IS_TERRALOGIC_LOGIN && (
        <>
          <Menu.Divider className={styles.firstDivider} />
          <Menu.Item key={CHANGE_PASSWORD} className={styles.menuItemLink}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.change-password' })}
          </Menu.Item>
        </>
      )}
      {/* SWITCH ROLE  */}
      {switchRole()}

      {/* LOCATION LIST */}
      {selectLocationAbility && renderLocationList()}

      <Menu.Divider className={styles.secondDivider} />
      <Menu.ItemGroup className={styles.groupMenuItem}>
        <Menu.Item key={LOGOUT} className={styles.menuItemLogout}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.logout' })}
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
  return currentUser && name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size={44}
          icon={<UserOutlined />}
          className={styles.avatar}
          src={currentUser?.employee?.generalInfo?.avatar || avatar?.url || avtDefault}
        />
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
};

export default connect(
  ({
    location: { companyLocationList = [] } = {},
    user: {
      companiesOfUser = [],
      currentUser: { roles = [], manageTenant = [], manageLocation = [], signInRole = [] } = {},
      currentUser,
    } = {},
    loading,
  }) => ({
    companyLocationList, // for owner
    manageLocation, // for admin
    roles,
    currentUser,
    signInRole,
    loadingFetchLocation: loading.effects['location/fetchLocationsByCompany'],
    companiesOfUser,
    manageTenant,
  }),
)(AvatarDropdown);
