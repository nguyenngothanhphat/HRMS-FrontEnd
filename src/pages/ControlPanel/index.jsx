import { LogoutOutlined, SettingOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import avtDefault from '@/assets/avtDefault.jpg';
import { Avatar, Button, Skeleton, Input, Tooltip, Upload, message } from 'antd';

import React, { Component } from 'react';
import { connect, history } from 'umi';
import { debounce } from 'lodash';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

@connect(({ user: { currentUser = {}, companiesOfUser = [] } = {}, loading }) => ({
  currentUser,
  companiesOfUser,
  loadingCompaniesOfUser: loading.effects['user/fetchCompanyOfUser'],
}))
class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companySearch: '',
      newAvatar: '',
    };
    this.setDebounce = debounce((companySearch) => {
      this.setState({
        companySearch,
      });
    }, 500);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // fetch list companies
    dispatch({
      type: 'user/clearDataInACompany',
    });
    // clear company details
    dispatch({
      type: 'companiesManagement/clearCompanyDetails',
    });
    // fetch list companies
    dispatch({
      type: 'user/fetchCompanyOfUser',
    });
    // set default tab to 1
    dispatch({
      type: 'companiesManagement/save',
      payload: { selectedNewCompanyTab: 1 },
    });
    localStorage.removeItem('currentCompanyId');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('currentLocationId');
  }

  handleLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  onCompanySearch = (e) => {
    // console.log('value', e);
    const { target: { value = '' } = {} } = e;
    this.setDebounce(value);
  };

  renderCompanies = (isOwner, isAdmin) => {
    const { companySearch: text } = this.state;
    const { companiesOfUser = [], loadingCompaniesOfUser = false } = this.props;

    let searchCompany = [...companiesOfUser];
    if (text) {
      searchCompany = companiesOfUser.filter((company) =>
        company?.name.toLowerCase().includes(text.toLowerCase()),
      );
    }

    const sortedCompanyList = searchCompany.sort((a, b) => a.name.localeCompare(b.name));
    if (loadingCompaniesOfUser) {
      return (
        <div>
          <Skeleton active />
        </div>
      );
    }
    return (
      <div className={s.companiesContainer}>
        <div className={s.searchBox}>
          <span className={s.searchText}>Please select a company profile to proceed</span>
          <div className={s.searchInput}>
            <Input
              placeholder="Search for company"
              size="large"
              suffix={<SearchOutlined />}
              onChange={(e) => this.onCompanySearch(e)}
              // onSearch={onSearch}
            />
          </div>
        </div>
        {sortedCompanyList.map((comp) => {
          return <ItemCompany company={comp} isOwner={isOwner} isAdmin={isAdmin} />;
        })}
      </div>
    );
  };

  checkRole = (roleName) => {
    const { currentUser: { signInRole = [] } = {} } = this.props;
    const formatRole = signInRole.map((role) => role.toLowerCase());
    if (formatRole.includes(roleName)) return true;
    return false;
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleUpload = async (file) => {
    const { dispatch, currentUser: { _id: currentUserId = '', firstName = '' } = {} } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    const res = await dispatch({
      type: 'upload/uploadFile',
      payload: formData,
      isUploadAvatar: true,
    });
    const { statusCode, data = [] } = res;
    if (statusCode === 200 && data.length > 0) {
      dispatch({
        type: 'adminApp/updateAdmins',
        payload: {
          id: currentUserId,
          firstName,
          avatar: data[0].id, // id of attachment
        },
        isUpdateAvatar: true,
      });
      this.setState({
        newAvatar: data[0].url,
      });
    }
  };

  render() {
    const { currentUser: { avatar: { url = '' } = {}, email = '' } = {} } = this.props;
    const { newAvatar } = this.state;
    const isOwner = this.checkRole('owner');
    const isAdmin = this.checkRole('admin');

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.blockUserLogin}>
            <div className={s.blockUserLogin__avt}>
              <Upload
                showUploadList={false}
                action={(file) => this.handleUpload(file)}
                beforeUpload={this.beforeUpload}
              >
                <Avatar size={56} icon={<UserOutlined />} src={newAvatar || url || avtDefault} />
              </Upload>
            </div>
            <div className={s.blockUserLogin__info}>
              <p>
                You are logged in as <span className={s.blockUserLogin__info__email}>{email}</span>
              </p>
              {(isOwner || isAdmin) && (
                <p style={{ marginTop: '8px' }}>You have administrative privileges.</p>
              )}
              <div className={s.blockUserLogin__info__login} onClick={this.handleLogout}>
                Log in with another account
              </div>
            </div>
            <div className={s.blockUserLogin__action}>
              <Tooltip title="Settings">
                <SettingOutlined className={s.blockUserLogin__action__icon} />
              </Tooltip>
              <Tooltip title="Logout">
                <LogoutOutlined
                  onClick={this.handleLogout}
                  className={s.blockUserLogin__action__icon}
                  style={{ marginLeft: '24px' }}
                />
              </Tooltip>
            </div>
          </div>

          {/* RENDER COMPANIES */}
          {this.renderCompanies(isOwner, isAdmin)}

          {isOwner && (
            <Button
              className={s.btnAddNew}
              onClick={() => history.push('/control-panel/add-company')}
            >
              Add new company
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default ControlPanel;
