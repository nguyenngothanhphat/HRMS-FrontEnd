import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu, Spin, notification } from 'antd';
import avtDefault from '@/assets/avtDefault.jpg';
import React from 'react';
import { connect, formatMessage, history } from 'umi';
import {
  setCurrentLocation,
  setTenantId,
  getCurrentTenant,
  getCurrentCompany,
  getCurrentLocation,
  isOwner,
  isAdmin,
  setCurrentCompany,
} from '@/utils/authority';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: {
      companiesOfUser = [],
      currentUser: { roles = [], manageTenant = [], manageLocation = [], signInRole = [] } = {},
    } = {},
    loading,
  }) => ({
    listLocationsByCompany, // for owner
    manageLocation, // for admin
    roles,
    signInRole,
    loadingFetchLocation: loading.effects['locationSelection/fetchLocationsByCompany'],
    companiesOfUser,
    manageTenant,
  }),
)
class AvatarDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LOGOUT: 'logout',
      // VIEWPROFILE: 'viewProfile',
      CHANGEPASSWORD: 'changePassword',
      SETTINGS: 'settings',
      selectLocationAbility: false,
    };
  }

  componentDidMount = async () => {
    const {
      dispatch,
      manageTenant = [],
      // , roles = []
      signInRole = [],
    } = this.props;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    const checkIsOwner = isOwner();

    const formatSignInRole = signInRole.map((role) => role.toLowerCase());
    if (checkIsOwner || formatSignInRole.includes('owner')) {
      await dispatch({
        type: 'locationSelection/fetchLocationListByParentCompany',
        payload: {
          company: companyId,
          tenantIds: manageTenant,
        },
      });
    } else {
      await dispatch({
        type: 'locationSelection/fetchLocationsByCompany',
        payload: {
          company: companyId,
          tenantId,
        },
      });
    }

    this.setState({
      selectLocationAbility: true,
    });

    // roles.forEach((role) => {
    //   const { _id = '' } = role;
    //   if (['ADMIN-CSA', 'HR-GLOBAL'].includes(_id)) {
    //     this.setState({
    //       selectLocationAbility: true,
    //     });
    //   }
    // });
  };

  onFinish = () => {
    history.push('/');
  };

  viewProfile = () => {
    const { currentUser: { employee: { _id = '' } = {} } = {} } = this.props;
    history.push(`/employees/employee-profile/${_id}`);
  };

  wait = (delay, ...args) => {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      setTimeout(resolve, delay, ...args);
    });
  };

  onMenuClick = async (event) => {
    const { key } = event;
    const { LOGOUT, CHANGEPASSWORD, SETTINGS } = this.state;
    const { listLocationsByCompany = [] } = this.props;

    if (key === LOGOUT) {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    if (key === CHANGEPASSWORD) {
      history.push('/change-password');

      return;
    }

    if (key === SETTINGS) {
      // eslint-disable-next-line no-alert
      alert('Settings');
      return;
    }

    if (key === 'ALL') {
      // eslint-disable-next-line no-alert
      localStorage.removeItem('currentLocationId');
      window.location.reload();
      return;
    }

    let selectLocation = '';
    setCurrentLocation(key);
    const currentCompany = getCurrentCompany();
    let newCompId = '';
    let newCompName = '';
    let newCompTenant = '';

    listLocationsByCompany.forEach((value) => {
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
      await this.wait(1500).then(() => window.location.reload());
    }

    if (selectLocation) {
      window.location.reload();
      // history.push(`/`);
      return;
    }

    this.viewProfile();
  };

  getChildCompanies = async () => {
    const { companiesOfUser = [] } = this.props;
    const currentCompanyId = getCurrentCompany();
    const resultList = companiesOfUser.map(
      (company) => company?.childOfCompany === currentCompanyId,
    );
    // eslint-disable-next-line compat/compat
    const list = await Promise.all(this.getLocationsOfChildCompany(resultList));
    return list;
  };

  renderLocationList = () => {
    const { listLocationsByCompany = [], manageLocation = [], signInRole = [] } = this.props;
    const currentLocation = getCurrentLocation();
    const currentCompany = getCurrentCompany();
    const checkIsOwner = isOwner();
    const checkIsAdmin = isAdmin();

    const formatSignInRole = signInRole.map((role) => role.toLowerCase());

    let commonLocationsList = [];
    if (checkIsOwner) {
      commonLocationsList = [...listLocationsByCompany];
    } else if (checkIsAdmin) {
      commonLocationsList = [...manageLocation];
    } else if (formatSignInRole.includes('owner')) {
      commonLocationsList = [...listLocationsByCompany];
    } else {
      const employeeLocation = listLocationsByCompany.filter(
        (location) => location?._id === currentLocation,
      );
      commonLocationsList = [...employeeLocation];
    }

    return (
      <>
        <Menu.Divider className={styles.secondDivider} />
        <Menu.Item className={styles.selectLocation}>Locations</Menu.Item>
        {checkIsOwner && (
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
        {/* {listOfChildCompanies.map((value) => {
          const { _id = '', name: locationName = '' } = value;
          return (
            <Menu.Item
              key={_id}
              className={currentLocation !== _id ? styles.menuItemLink : styles.menuItemLink2}
            >
              {locationName}
            </Menu.Item>
          );
        })} */}
      </>
    );
  };

  render() {
    const { currentUser = {} } = this.props;
    // const {
    //   name = '',
    //   generalInfo: { avatar = '', employeeId = '' } = {},
    //   title = {},
    // } = currentUser;
    const { firstName: name = '', avatar = '', employeeId = '', title = {} } = currentUser;
    const { selectLocationAbility } = this.state;

    const { LOGOUT, CHANGEPASSWORD } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <div className={styles.viewProfile}>
          <div className={styles.viewProfileAvatar}>
            <Avatar
              size={50}
              className={styles.avatar}
              icon={<UserOutlined />}
              src={avatar || avtDefault}
            />
          </div>
          <div className={styles.viewProfileInfo}>
            <p>{name}</p>
            {employeeId && (
              <p>
                {title?.name} - {employeeId}
              </p>
            )}
          </div>
        </div>
        {/* <Menu.Item key={VIEWPROFILE} className={styles.menuItemViewProfile}> */}
        <div className={styles.viewProfileBtn}>
          <Button onClick={this.viewProfile} className={styles.buttonLink}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.view-profile' })}
          </Button>
        </div>
        {/* </Menu.Item> */}
        <Menu.Divider className={styles.firstDivider} />
        <Menu.Item key={CHANGEPASSWORD} className={styles.menuItemLink}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.change-password' })}
        </Menu.Item>
        {/* <Menu.Item key={SETTINGS} className={styles.menuItemLink}>
          {formatMessage({ id: 'component.globalHeader.avatarDropdown.settings' })}
        </Menu.Item> */}

        {selectLocationAbility && this.renderLocationList()}

        <Menu.Divider className={styles.secondDivider} />
        <Menu.ItemGroup className={styles.groupMenuItem}>
          <Menu.Item key={LOGOUT} className={styles.menuItemLogout}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.logout' })}
          </Menu.Item>
          {/* <Menu.Item className={styles.sessionLogin}>
            {formatMessage({ id: 'component.globalHeader.avatarDropdown.session-login' })}: 11:30
          </Menu.Item> */}
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
            src={avatar || avtDefault}
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
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
