import React, { Component } from 'react';
import { Divider, Button, Spin, Input, Tooltip, Menu, Dropdown, Checkbox, Tag } from 'antd';

import avtDefault from '@/assets/avtDefault.jpg';
import bioSvg from '@/assets/bioActions.svg';
import { connect, history } from 'umi';
import moment from 'moment';
import ModalUpload from '@/components/ModalUpload';
import CustomModal from '@/components/CustomModal';
import s from '@/components/LayoutEmployeeProfile/index.less';
import { getCurrentTenant } from '@/utils/authority';

const { TextArea } = Input;
const { SubMenu } = Menu;

const HR_MANAGER = 'HR-MANAGER';
const HR_EMPLOYEE = 'HR';
const MANAGER = 'MANAGER';

@connect(
  ({
    loading,
    employeeProfile: {
      tempData: { generalData = {}, compensationData = {} } = {},
      originData: {
        generalData: originGeneralData = {},
        employmentData: {
          manager = {},
          location = {},
          department = {},
          joinDate = '',
          title = {},
        } = {},
      } = {},
    } = {},
    user: { currentUser: { employee: { _id: myEmployeeID = '' } = {}, roles = [] } = {} } = {},
  }) => ({
    generalData,
    compensationData,
    originGeneralData,
    loading: loading.effects['employeeProfile/fetchGeneralInfo'],
    myEmployeeID,
    manager,
    location,
    department,
    joinDate,
    title,
    roles,
  }),
)
class ViewInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      openEditBio: false,
      bio: '',
    };
  }

  shouldComponentUpdate(nextProps) {
    const { generalData: { bioInfo = '' } = {} } = this.props;
    const { generalData: { bioInfo: nextBioInfo = '' } = {} } = nextProps;
    if (bioInfo !== nextBioInfo) {
      this.setState({
        bio: nextBioInfo,
      });
    }
    return true;
  }

  handleEditBio = () => {
    const { openEditBio } = this.state;
    this.setState({
      openEditBio: !openEditBio,
    });
  };

  openModalUpload = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  formatListSkill = (skills, colors) => {
    let temp = 0;
    const listFormat = skills?.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item.name,
        id: item._id,
      };
    });
    return listFormat;
  };

  getResponse = (resp) => {
    const {
      dispatch,
      generalData: { _id: id = '', employee = '' } = {},
      myEmployeeID = '',
    } = this.props;
    const { statusCode, data = [] } = resp;
    const check = employee === myEmployeeID;
    if (statusCode === 200) {
      const [first] = data;
      this.handleCancel();
      dispatch({
        type: 'employeeProfile/updateGeneralInfo',
        payload: {
          id,
          avatar: first.url,
          tenantId: getCurrentTenant(),
        },
        dataTempKept: {},
        key: 'noKey',
        isUpdateMyAvt: check,
      });
    }
  };

  handleSaveBio = () => {
    const { dispatch, generalData: { _id: id = '' } = {} } = this.props;
    const { bio } = this.state;
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload: {
        id,
        bioInfo: bio,
        tenantId: getCurrentTenant(),
      },
    });
    this.handleEditBio();
  };

  onChangeInput = ({ target: { value } }) => {
    this.setState({
      bio: value,
    });
  };

  _renderFormEditBio = () => {
    const { loading } = this.props;
    const { bio } = this.state;
    const check = 170 - bio.length;
    return (
      <div className={s.formEditBio}>
        <div className={s.formEditBio__title}>Edit Bio</div>
        <div className={s.formEditBio__description1}>Only 170 chracter allowed!</div>
        <TextArea rows={3} defaultValue={bio} onChange={this.onChangeInput} />
        <div className={s.formEditBio__description2}>
          <span style={{ opacity: 0.5 }}> Remaining characters: </span>
          {check >= 0 ? (
            <span style={{ opacity: 0.5 }}>{check}</span>
          ) : (
            <span style={{ color: '#ff6c6c' }}>{check} (Limt exceeded)</span>
          )}
        </div>
        <div className={s.viewBtnSave}>
          <Button
            onClick={this.handleSaveBio}
            className={s.btnSave}
            type="primary"
            disabled={check < 0}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  onChangeShowAvatar = (e) => {
    const { target: { checked } = {} } = e;
    const { dispatch, generalData: { _id: id = '' } = {} } = this.props;
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload: {
        id,
        isShowAvatar: checked,
        tenantId: getCurrentTenant(),
      },
    });
  };

  getAvatarUrl = (avatar, isShowAvatar) => {
    const { permissions = {}, profileOwner = false } = this.props;
    if (isShowAvatar || permissions.viewAvatarEmployee !== -1 || profileOwner)
      return avatar || avtDefault;
    return avtDefault;
  };

  handleClickMenu = (menu) => {
    const { handleClickOnActions = () => {} } = this.props;
    const { key = '' } = menu;
    handleClickOnActions(key);
  };

  redirectOffboarding = () => {
    const { roles = [], dispatch } = this.props;
    const checkRoleHrAndManager =
      roles.includes(HR_MANAGER) || roles.includes(HR_EMPLOYEE) || roles.includes(MANAGER);
    if (checkRoleHrAndManager) {
      dispatch({
        type: 'offboarding/save',
        payload: {
          screenMode: 'JOB-CHANGE',
        },
      });
      history.push('/offboarding');
    } else {
      history.push('/offboarding');
    }
  };

  btnAction = (permissions, profileOwner) => {
    const subDropdown = (
      <SubMenu className={s.subMenu} key="sub1" title="Job Change">
        <Menu.Item key="offboarding" className={s.menuItem} onClick={this.redirectOffboarding}>
          Offboarding
        </Menu.Item>
      </SubMenu>
    );

    const menu = (
      <Menu className={s.menuDropdown} mode="inline" onClick={this.handleClickMenu}>
        {(permissions.updateAvatarEmployee !== -1 || profileOwner) && (
          <Menu.Item key="editBio" className={s.menuItem} onClick={this.handleEditBio}>
            Edit Bio
          </Menu.Item>
        )}
        {subDropdown}
        <Menu.Item key="0" className={s.menuItem}>
          Put on Leave (LWP)
        </Menu.Item>
        <Menu.Item key="1" className={s.menuItem}>
          Raise Termination
        </Menu.Item>
        <Menu.Item key="2" className={s.menuItem}>
          Request Details
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Dropdown className={s.actionBtn} overlay={menu} trigger={['click']}>
          <div onClick={(e) => e.preventDefault()}>
            Actions <img alt="bio" src={bioSvg} />
          </div>
        </Dropdown>
      </>
    );
  };

  render() {
    const {
      generalData,
      // compensationData,
      loading,
      originGeneralData: { bioInfo = '', isShowAvatar = true } = {},
      // employeeLocation = '',
      permissions = {},
      profileOwner = false,
      manager = {},
      location: { name: locationName = '' } = {},
      department: { name: departmentName = '' } = {},
      joinDate = '',
      title,
    } = this.props;

    const checkVisible = profileOwner || permissions.viewOtherInformation !== -1;

    const {
      firstName = '',
      avatar = '',
      linkedIn = '',
      workEmail = '',
      workNumber = '',
    } = generalData;

    // const { tittle: { name: title = '' } = {} } = compensationData;
    const { visible, openEditBio } = this.state;
    const joiningDate = joinDate ? moment(joinDate).format('MM.DD.YY') : '-';
    const { generalInfo: { firstName: managerFN = '', lastName: managerLN = '' } = {} } = manager;
    // const listColors = ['red', 'purple', 'green', 'magenta', 'blue'];
    const listColors = [
      {
        bg: '#E0F4F0',
        colorText: '#00c598',
      },
      {
        bg: '#ffefef',
        colorText: '#fd4546',
      },
      {
        bg: '#f1edff',
        colorText: '#6236ff',
      },
      {
        bg: '#f1f8ff',
        colorText: '#006bec',
      },
      {
        bg: '#fff7fa',
        colorText: '#ff6ca1',
      },
    ];
    const formatListSkill = this.formatListSkill(generalData.skills, listColors) || [];

    const avatarUrl = this.getAvatarUrl(avatar, isShowAvatar);

    if (loading)
      return (
        <div className={s.viewLoading}>
          <Spin />
        </div>
      );
    return (
      <div className={s.viewRight__infoEmployee}>
        <img
          src="/assets/images/img-cover.jpg"
          alt="img-cover"
          className={s.infoEmployee__imgCover}
        />
        <img src={avatarUrl} alt="img-avt" className={s.infoEmployee__imgAvt} />
        {(permissions.updateAvatarEmployee !== -1 || profileOwner) && (
          <img
            src="/assets/images/iconUploadImage.svg"
            onClick={this.openModalUpload}
            alt="img-upload"
            className={s.infoEmployee__imgAvt__upload}
          />
        )}
        <div className={s.infoEmployee__textNameAndTitle}>
          <p className={s.infoEmployee__textNameAndTitle__name}>{firstName}</p>
          <p className={s.infoEmployee__textNameAndTitle__title} style={{ margin: '5px 0' }}>
            {title ? title.name : ''}
          </p>
        </div>

        <div className={s.infoEmployee__viewBottom}>
          <p className={s.infoEmployee__viewBottom__description} style={{ marginTop: '10px' }}>
            {bioInfo}
          </p>
          {(permissions.editShowAvatarEmployee !== -1 || profileOwner) && (
            <>
              <Divider />
              <div className={s.infoEmployee__viewBottom__row}>
                <Checkbox
                  className={s.showAvatar}
                  checked={isShowAvatar}
                  onChange={this.onChangeShowAvatar}
                >
                  Show profile picture to other users
                </Checkbox>
              </div>
            </>
          )}
          <Divider />
          <p className={s.titleTag}>Skills</p>
          <div>
            {formatListSkill.map((item) => (
              <Tag
                style={{
                  color: `${item.color.colorText}`,
                }}
                key={item.id}
                color={item.color.bg}
              >
                {item.name}
              </Tag>
            ))}
          </div>
          <Divider />
          {checkVisible ? (
            <div className={s.infoEmployee__viewBottom__row}>
              <p className={s.titleTag}>Joining Date</p>
              <p className={s.infoEmployee__textNameAndTitle__title}>{joiningDate}</p>
            </div>
          ) : (
            ''
          )}

          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Location</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>{locationName}</p>
          </div>
          {/* <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Reporting to</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>
              {managerFN} {managerLN}
            </p>
          </div>
          <Divider />
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag1}>Email</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>{workEmail}</p>
          </div>
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag1}>Contact number</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>{workNumber}</p>
          </div>
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag1}>Joining department</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>Not implemented</p>
          </div>
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag1}>Current department</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>{departmentName}</p>
          </div> 

          <Divider /> */}
          <div className={s.infoEmployee__socialMedia}>
            <Tooltip title="LinkedIn">
              <a disabled={!linkedIn} href={linkedIn} target="_blank" rel="noopener noreferrer">
                <img
                  src="/assets/images/iconLinkedin.svg"
                  alt="img-arrow"
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </Tooltip>
            <Tooltip title="Email">
              <img
                src="/assets/images/iconMail.svg"
                alt="img-arrow"
                style={{ marginLeft: '5px', cursor: 'pointer' }}
              />
            </Tooltip>
          </div>
          <div className={s.viewBtnAction}>{this.btnAction(permissions, profileOwner)}</div>
        </div>
        <ModalUpload
          titleModal="Profile Picture Update"
          visible={visible}
          handleCancel={this.handleCancel}
          widthImage="40%"
          getResponse={this.getResponse}
        />
        <CustomModal
          open={openEditBio}
          closeModal={this.handleEditBio}
          content={this._renderFormEditBio()}
        />
      </div>
    );
  }
}

export default ViewInformation;
