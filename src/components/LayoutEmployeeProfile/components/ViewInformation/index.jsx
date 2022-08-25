import { Checkbox, Divider, Dropdown, Input, Menu, Tag, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import bioSvg from '@/assets/bioActions.svg';
import CommonModal from '@/components/CommonModal';
import ModalUpload from '@/components/ModalUpload';
import { setHideOffboarding, setOffboardingEmpMode } from '@/utils/offboarding';
import s from './index.less';

const { TextArea } = Input;
const { SubMenu } = Menu;

const ViewInformation = (props) => {
  const actionBtnRef = useRef();

  const [visible, setVisible] = useState(false);
  const [openEditBio, setOpenEditBio] = useState(false);
  const [bio, setBio] = useState('');
  const [placementText, setPlacementText] = useState('topCenter');

  const {
    dispatch,
    permissions = {},
    isProfileOwner = false,
    // joinDate = '',
    loadingFetchEmployee = false,
    loading = false,
    employeeProfile: { employee = '', employmentData = {} } = {},
    user: { currentUser: { employee: { _id: myEmployeeID = '' } = {} } = {} } = {},
  } = props;

  const {
    manager: {
      generalInfo: { legalName: managerName = '', userId: managerUserId = '' } = {} || {},
    } = {},
    location: { name: locationName = '' } = {},
    department: { name: departmentName = '' } = {},
    title = {},
    generalInfo = {},
  } = employmentData;

  const {
    legalName = '',
    avatar = '',
    linkedIn = '',
    workEmail = '',
    certification = [],
    userId = '',
    skills = [],
    bioInfo = '',
    isShowAvatar = true,
  } = generalInfo;

  const bioCheck = 170 - bio.length;

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

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const handleScroll = () => {
    const positionY = window.scrollY;

    if (positionY > 300) {
      setPlacementText('bottomCenter');
    } else {
      setPlacementText('topCenter');
    }
  };

  const onScroll = (name) => {
    if (name === 'addEventListener') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
  };

  useEffect(() => {
    onScroll('addEventListener');
    return () => {
      onScroll('removeEventListener');
    };
  }, []);

  useEffect(() => {
    setBio(bioInfo);
  }, [bioInfo]);

  const toggleUploadAvatarModal = () => {
    setVisible(!visible);
  };

  const formatListSkill = (arr, colors) => {
    let temp = 0;
    const listFormat = arr?.map((item) => {
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
    return [...listFormat];
  };

  const getResponse = (resp) => {
    const { statusCode, data = {} } = resp;
    if (statusCode === 200) {
      const [first] = data;
      toggleUploadAvatarModal();
      dispatch({
        type: 'employeeProfile/updateGeneralInfo',
        payload: {
          _id: employee,
          generalInfo: {
            avatar: first.url,
          },
        },
        isUpdateMyAvt: employee === myEmployeeID,
      });
    }
  };

  const handleSaveBio = async () => {
    const res = await dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload: {
        _id: employee,
        generalInfo: {
          bioInfo: bio,
        },
      },
    });
    if (res.statusCode === 200) {
      setOpenEditBio(false);
    }
  };

  const onChangeInput = ({ target: { value } }) => {
    setBio(value);
  };

  const _renderFormEditBio = () => {
    return (
      <div className={s.formEditBio}>
        <div className={s.formEditBio__description1}>Only 170 character allowed!</div>
        <TextArea
          autoSize={{
            minRows: 4,
            maxRows: 7,
          }}
          defaultValue={bio}
          onChange={onChangeInput}
        />
        <div className={s.formEditBio__description2}>
          <span style={{ opacity: 0.5 }}>Remaining characters: </span>
          {bioCheck >= 0 ? (
            <span style={{ opacity: 0.5 }}>{bioCheck}</span>
          ) : (
            <span style={{ color: '#ff6c6c' }}>{bioCheck} (Limit exceeded)</span>
          )}
        </div>
      </div>
    );
  };

  const onChangeShowAvatar = (e) => {
    const { target: { checked } = {} } = e;
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload: {
        _id: employee,
        generalInfo: {
          isShowAvatar: checked,
        },
      },
    });
  };

  const getAvatarUrl = () => {
    if (isShowAvatar || permissions.viewAvatarEmployee !== -1 || isProfileOwner)
      return avatar || avtDefault;
    return avtDefault;
  };

  const handleClickMenu = (menu) => {
    const { handleClickOnActions = () => {} } = props;
    const { key = '' } = menu;
    handleClickOnActions(key);
  };

  const redirectOffboarding = () => {
    setHideOffboarding(false);
    setOffboardingEmpMode(true);
    history.push({
      pathname: '/offboarding/my-request',
    });
  };

  const btnAction = () => {
    const subDropdown = (
      <SubMenu className={s.subMenu} key="sub1" title="Job Change">
        <Menu.Item
          key="offboarding"
          className={s.menuItem}
          onClick={redirectOffboarding}
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
        onClick={handleClickMenu}
        disabled={loading || loadingFetchEmployee}
      >
        {isProfileOwner && (
          <Menu.Item key="editBio" className={s.menuItem} onClick={() => setOpenEditBio(true)}>
            Edit Bio
          </Menu.Item>
        )}
        {isProfileOwner && subDropdown}
        {/* {permissions.viewAdvancedActions !== -1 && (
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
        )} */}
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
          <div ref={actionBtnRef} onClick={(e) => e.preventDefault()}>
            Actions <img alt="bio" src={bioSvg} />
          </div>
        </Dropdown>
      </>
    );
  };

  const _renderListCertification = (list = []) => {
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

  const listSkill = formatListSkill(skills, listColors) || [];

  const avatarUrl = getAvatarUrl();

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
            onClick={toggleUploadAvatarModal}
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
                  onChange={onChangeShowAvatar}
                >
                  Show profile picture to other users
                </Checkbox>
              </div>
            </>
          )}
          <Divider />
          <p className={s.titleTag}>Skills</p>
          <div>
            {listSkill.length === 0 && (
              <div className={s.infoEmployee__viewBottom__certifications}>
                <div className={s.infoEmployee__textNameAndTitle__title}>No skills</div>
              </div>
            )}
            {listSkill.map((item) => (
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
          <p className={s.titleTag}>Certifications</p>
          <div className={s.infoEmployee__viewBottom__certifications}>
            {_renderListCertification(certification)}
          </div>
          <Divider />

          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Location</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>{locationName}</p>
          </div>
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Reporting to</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>
              <span className={s.managerName} onClick={() => viewProfile(managerUserId)}>
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
            <div className={s.viewBtnAction}>{btnAction()}</div>
          )}
        </div>
        <ModalUpload
          titleModal="Profile Picture Update"
          visible={visible}
          handleCancel={toggleUploadAvatarModal}
          widthImage="40%"
          getResponse={getResponse}
        />
        <CommonModal
          visible={openEditBio}
          onClose={() => setOpenEditBio(false)}
          content={_renderFormEditBio()}
          hasCancelButton={false}
          title="Edit Bio"
          firstText="Save"
          width={500}
          loading={loading}
          onFinish={handleSaveBio}
          disabledButton={bioCheck < 0}
        />
      </div>
    </div>
  );
};

export default connect(({ employeeProfile = {}, user }) => ({
  employeeProfile,
  user,
}))(ViewInformation);
