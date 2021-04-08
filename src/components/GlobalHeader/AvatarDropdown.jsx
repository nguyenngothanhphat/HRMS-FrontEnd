import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu, Spin } from 'antd';
import avtDefault from '@/assets/avtDefault.jpg';
import React from 'react';
import { connect, formatMessage, history } from 'umi';
import {
  setCurrentLocation,
  getCurrentTenant,
  getCurrentCompany,
  getCurrentLocation,
  isOwner,
} from '@/utils/authority';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { companiesOfUser = [], currentUser: { roles = [] } = {} } = {},
    loading,
  }) => ({
    listLocationsByCompany,
    roles,
    loadingFetchLocation: loading.effects['locationSelection/fetchLocationsByCompany'],
    companiesOfUser,
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
      // , roles = []
    } = this.props;
    const companyId = getCurrentCompany();
    const tenantId = getCurrentTenant();
    await dispatch({
      type: 'locationSelection/fetchLocationsByCompany',
      payload: {
        company: companyId,
        tenantId,
      },
    });

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

  onMenuClick = (event) => {
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

    setCurrentLocation(key);
    let selectLocation = '';

    listLocationsByCompany.forEach((value) => {
      const { _id = '' } = value;
      if (key === _id) {
        selectLocation = _id;
      }
    });

    if (selectLocation) {
      window.location.reload();
      // history.push(`/`);
      return;
    }

    this.viewProfile();
  };

  getLocationsOfChildCompany = (resultList) => {
    const { dispatch } = this.props;

    resultList.forEach(async (company) => {
      const { _id = '', tenant = '' } = company;
      // const res = await dispatch({
      //   type: 'locationSelection/fetchLocationsOfChildCompany',
      //   payload: {
      //     company: _id,
      //     tenantId: tenant,
      //   },
      // });
      // const { statusCode = 0, data = [] } = res;
      // if (statusCode === 200) {
      //   return data.map((location) => {
      //     return {
      //       _id: location?._id,
      //       name: location?.name,
      //     };
      //   });
      // }
      return {};
    });
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
    const { listLocationsByCompany = [] } = this.props;
    const currentLocation = getCurrentLocation();

    const checkIsOwner = isOwner();
    // const listOfChildCompanies = this.getChildCompanies();
    // console.log('listOfChildCompanies', listOfChildCompanies);
    return (
      <>
        <Menu.Divider className={styles.secondDivider} />
        <Menu.Item className={styles.selectLocation}>Location</Menu.Item>
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
        {listLocationsByCompany.map((value) => {
          const { _id = '', name: locationName = '' } = value;
          return (
            <Menu.Item
              key={_id}
              className={currentLocation !== _id ? styles.menuItemLink : styles.menuItemLink2}
            >
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
