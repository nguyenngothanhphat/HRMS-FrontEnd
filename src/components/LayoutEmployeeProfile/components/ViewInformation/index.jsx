import { Checkbox, Divider, Dropdown, Input, Menu, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import bioSvg from '@/assets/bioActions.svg';
import CommonModal from '@/components/CommonModal';
import ModalUpload from '@/components/ModalUpload';
import { getCurrentTenant } from '@/utils/authority';
import { setHideOffboarding, setOffboardingEmpMode } from '@/utils/offboarding';
import s from './index.less';

const { TextArea } = Input;
const { SubMenu } = Menu;

@connect(
  ({
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
      placementText: 'topCenter',
    };

    this.actionBtnRef = React.createRef();
  }

  componentDidMount = () => {
    this.onScroll('addEventListener');
  };

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

  componentDidUpdate = () => {
    this.onScroll('addEventListener');
  };

  componentWillUnmount = () => {
    this.onScroll('removeEventListener');
  };

  viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  onScroll = (name) => {
    if (name === 'addEventListener') {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    } else {
      window.removeEventListener('scroll', this.handleScroll);
    }
  };

  handleScroll = () => {
    const positionY = window.scrollY;

    if (positionY > 300) {
      this.setState({
        placementText: 'bottomCenter',
      });
    } else {
      this.setState({
        placementText: 'topCenter',
      });
    }
  };

  getPlacement = (placement) => {
    this.setState({
      placementText: placement,
    });
  };

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
    // const checkTypeOf = otherSkills instanceof Array ? otherSkills : [otherSkills];
    // const listFormatOther = checkTypeOf?.map((item) => {
    //   if (temp >= 5) {
    //     temp -= 5;
    //   }
    //   temp += 1;
    //   return {
    //     color: colors[temp - 1],
    //     name: item,
    //     id: item,
    //   };
    // });
    return [...listFormat];
  };

  getResponse = (resp) => {
    const {
      dispatch,
      generalData: { _id: id = '', employee = '' } = {},
      myEmployeeID = '',
    } = this.props;
    const { statusCode, data = {} } = resp;
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
    const { bio } = this.state;
    const check = 170 - bio.length;
    return (
      <div className={s.formEditBio}>
        <div className={s.formEditBio__description1}>Only 170 character allowed!</div>
        <TextArea
          autoSize={{
            minRows: 4,
            maxRows: 7,
          }}
          defaultValue={bio}
          onChange={this.onChangeInput}
        />
        <div className={s.formEditBio__description2}>
          <span style={{ opacity: 0.5 }}>Remaining characters: </span>
          {check >= 0 ? (
            <span style={{ opacity: 0.5 }}>{check}</span>
          ) : (
            <span style={{ color: '#ff6c6c' }}>{check} (Limit exceeded)</span>
          )}
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
    const { permissions = {}, isProfileOwner = false } = this.props;
    if (isShowAvatar || permissions.viewAvatarEmployee !== -1 || isProfileOwner)
      return avatar || avtDefault;
    return avtDefault;
  };

  handleClickMenu = (menu) => {
    const { handleClickOnActions = () => {} } = this.props;
    const { key = '' } = menu;
    handleClickOnActions(key);
  };

  redirectOffboarding = () => {
    setHideOffboarding(false);
    setOffboardingEmpMode(true);
    history.push({
      pathname: '/offboarding/my-request',
    });
  };

  btnAction = (permissions, isProfileOwner) => {
    const { loading, loadingFetchEmployee } = this.props;
    const { placementText } = this.state;

    const subDropdown = (
      <SubMenu className={s.subMenu} key="sub1" title="Job Change">
        <Menu.Item
          key="offboarding"
          className={s.menuItem}
          onClick={this.redirectOffboarding}
          // disabled
        >
          Resignation
        </Menu.Item>
      </SubMenu>
    );

    const menu = (
      <Menu
        className={s.menuDropdown}
        mode="inline"
        onClick={this.handleClickMenu}
        disabled={loading || loadingFetchEmployee}
      >
        {isProfileOwner && (
          <Menu.Item key="editBio" className={s.menuItem} onClick={this.handleEditBio}>
            Edit Bio
          </Menu.Item>
        )}
        {isProfileOwner && subDropdown}
        {permissions.viewAdvancedActions !== -1 && (
          <>
            <Menu.Item key="0" className={s.menuItem}>
              Put on Leave (LWP)
            </Menu.Item>
            <Menu.Item key="1" className={s.menuItem}>
              Raise Termination
            </Menu.Item>
            <Menu.Item key="2" className={s.menuItem}>
              Request Details
            </Menu.Item>
          </>
        )}
      </Menu>
    );

    return (
      <>
        <Dropdown
          className={s.actionBtn}
          overlay={menu}
          trigger={['click']}
          placement={placementText}
        >
          <div ref={this.actionBtnRef} onClick={(e) => e.preventDefault()}>
            Actions <img alt="bio" src={bioSvg} />
          </div>
        </Dropdown>
      </>
    );
  };

  _renderListCertification = (list) => {
    if (list.length === 0) {
      return <div className={s.infoEmployee__textNameAndTitle__title}>No certifications</div>;
    }
    return list.map((item, index) => {
      const { name = '', _id = '' } = item;
      return (
        <div key={_id} className={s.infoEmployee__textNameAndTitle__certifications}>
          {index + 1} - {name}
        </div>
      );
    });
  };

  render() {
    const {
      generalData,
      // compensationData,
      originGeneralData: { bioInfo = '', isShowAvatar = true } = {},
      // employeeLocation = '',
      permissions = {},
      isProfileOwner = false,
      manager = {},
      location: { name: locationName = '' } = {},
      department: { name: departmentName = '' } = {},
      // joinDate = '',
      title,
      loadingFetchEmployee = false,
      loading = false,
    } = this.props;

    const {
      legalName = '',
      avatar = '',
      linkedIn = '',
      workEmail = '',
      certification = [],
      userId = '',
      skills = [],
    } = generalData;

    const { visible, openEditBio } = this.state;
    const { generalInfo: { legalName: managerName = '', userId: managerUserId = '' } = {} || {} } =
      manager || {};

    const { bio } = this.state;
    const check = 170 - bio.length;

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
    const formatListSkill = this.formatListSkill(skills, listColors) || [];

    const avatarUrl = this.getAvatarUrl(avatar, isShowAvatar);

    return (
      <div className={s.ViewInformation}>
        <div className={s.ViewInformation__infoEmployee}>
          <img
            src="/assets/images/img-cover.jpg"
            alt="img-cover"
            className={s.infoEmployee__imgCover}
          />
          <img
            src={avatarUrl}
            alt="img-avt"
            className={s.infoEmployee__imgAvt}
            onError={(e) => {
              e.target.src = avtDefault;
            }}
          />
          {(permissions.updateAvatarEmployee !== -1 || isProfileOwner) && (
            <img
              src="/assets/images/iconUploadImage.svg"
              onClick={this.openModalUpload}
              alt="img-upload"
              className={s.infoEmployee__imgAvt__upload}
            />
          )}
          <div className={s.infoEmployee__textNameAndTitle}>
            {legalName && (
              <p className={s.infoEmployee__textNameAndTitle__name}>
                {legalName} ({userId}
              </p>
            )}
            {title?.name && (
              <p className={s.infoEmployee__textNameAndTitle__title} style={{ margin: '5px 0' }}>
                {title?.name || ''}
              </p>
            )}
          </div>

          <div className={s.infoEmployee__viewBottom}>
            <p className={s.infoEmployee__viewBottom__description} style={{ marginTop: '10px' }}>
              {bioInfo}
            </p>
            {(permissions.editShowAvatarEmployee !== -1 || isProfileOwner) && (
              <>
                <Divider />
                <div className={s.infoEmployee__viewBottom__row}>
                  <Checkbox
                    className={s.showAvatar}
                    checked={isShowAvatar}
                    disabled={loadingFetchEmployee}
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
              {formatListSkill.length === 0 && (
                <div className={s.infoEmployee__viewBottom__certifications}>
                  <div className={s.infoEmployee__textNameAndTitle__title}>No skills</div>
                </div>
              )}
              {formatListSkill.map((item) => (
                <Tag
                  style={{
                    color: `${item.color.colorText}`,
                    fontWeight: 'normal',
                  }}
                  key={item.id}
                  color={item.color.bg}
                >
                  {item.name}
                </Tag>
              ))}
            </div>
            <Divider />
            <p className={s.titleTag}>Certifications</p>
            <div className={s.infoEmployee__viewBottom__certifications}>
              {this._renderListCertification(certification)}
            </div>
            <Divider />

            <div className={s.infoEmployee__viewBottom__row}>
              <p className={s.titleTag}>Location</p>
              <p className={s.infoEmployee__textNameAndTitle__title}>{locationName}</p>
            </div>
            <div className={s.infoEmployee__viewBottom__row}>
              <p className={s.titleTag}>Reporting to</p>
              <p className={s.infoEmployee__textNameAndTitle__title}>
                <span className={s.managerName} onClick={() => this.viewProfile(managerUserId)}>
                  {managerName}
                </span>
              </p>
            </div>
            <div className={s.infoEmployee__viewBottom__row}>
              <p className={s.titleTag}>Department</p>
              <p className={s.infoEmployee__textNameAndTitle__title}>{departmentName}</p>
            </div>

            <Divider />
            <div className={s.infoEmployee__socialMedia}>
              <Tooltip
                title={
                  linkedIn
                    ? 'LinkedIn'
                    : 'Please update the Linkedin Profile in the Employee profile page'
                }
              >
                <a href={linkedIn || '#'} target="_blank" rel="noopener noreferrer">
                  <img src="/assets/images/iconLinkedin.svg" alt="img-arrow" />
                </a>
              </Tooltip>
              <Tooltip title="Email">
                <a href={`mailto:${workEmail}`}>
                  <img src="/assets/images/iconMail.svg" alt="img-arrow" />
                </a>
              </Tooltip>
            </div>
            {(isProfileOwner || permissions.viewAdvancedActions !== -1) && (
              <div className={s.viewBtnAction}>{this.btnAction(permissions, isProfileOwner)}</div>
            )}
          </div>
          <ModalUpload
            titleModal="Profile Picture Update"
            visible={visible}
            handleCancel={this.handleCancel}
            widthImage="40%"
            getResponse={this.getResponse}
          />
          <CommonModal
            visible={openEditBio}
            onClose={this.handleEditBio}
            content={this._renderFormEditBio()}
            hasCancelButton={false}
            title="Edit Bio"
            firstText="Save"
            width={500}
            loading={loading}
            onFinish={this.handleSaveBio}
            disabledButton={check < 0}
          />
        </div>
      </div>
    );
  }
}

export default ViewInformation;
