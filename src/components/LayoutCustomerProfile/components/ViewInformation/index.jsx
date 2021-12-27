import { Button, Col, Divider, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect, Link } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import linkedinIcon from '@/assets/linkedinIcon.svg';
import MockCustomerLogo from '@/assets/mockCustomerLogo.png';
import websiteIcon from '@/assets/websiteIcon.svg';
import plusIcon from '../../../../assets/plus-Icon.svg';
import s from '../../index.less';

// import { getCurrentTenant } from '@/utils/authority';

@connect(({ loading, customerProfile: { info = {} } = {} }) => ({
  info,
  loadingInfo: loading.effects['customerProfile/fetchCustomerInfo'],
}))
class ViewInformation extends Component {
  getAvatarUrl = (avatar, isShowAvatar) => {
    const { permissions = {}, profileOwner = false } = this.props;
    if (isShowAvatar || permissions.viewAvatarEmployee !== -1 || profileOwner)
      return avatar || avtDefault;
    return avtDefault;
  };

  render() {
    const { info, listTag } = this.props;
    const {
      accountOwner: {
        generalInfo: { legalName: nameLegal = '', avatar = '' } = {},
        company: { name = '' } = {},
      } = {} || {},
      tags = [],
      legalName = '',
      status = '',
      pendingTickets = '',
      pendingTasks = '',
      activeProject = '',
      customerId = '',
      openLeads = '',
    } = info || {};
    // const { avatar = '', linkedIn = '', workEmail = '' } = generalData;

    // const { tittle: { name: title = '' } = {} } = compensationData;
    // const listColors = ['red', 'purple', 'green', 'magenta', 'blue'];

    // const avatarUrl = this.getAvatarUrl(avatar, isShowAvatar);

    // if (loading)
    //   return (
    //     <div className={s.viewLoading}>
    //       <Spin />
    //     </div>
    //   );
    return (
      <div className={s.viewRight__infoEmployee} style={{ position: 'relative' }}>
        <Button className={s.btnEdit}>Edit</Button>
        <img
          src="/assets/images/img-cover.jpg"
          alt="img-cover"
          className={s.infoEmployee__imgCover}
        />
        <img src={avatar || MockCustomerLogo} alt="img-avt" className={s.infoEmployee__imgAvt} />
        {/* {(permissions.updateAvatarEmployee !== -1 || profileOwner) && ( */}
        <img
          src="/assets/images/iconUploadImage.svg"
          onClick={this.openModalUpload}
          alt="img-upload"
          className={s.infoEmployee__imgAvt__upload}
        />
        {/* )} */}
        <div className={s.infoEmployee__textNameAndTitle}>
          <p className={s.infoEmployee__textNameAndTitle__name}>{legalName}</p>
          {/* <p className={s.infoEmployee__textNameAndTitle__title} style={{ margin: '5px 0' }}>
            {title ? title.name : ''}
          </p> */}
        </div>
        <div className={s.infoEmployee__viewBottom}>
          {/* {(permissions.editShowAvatarEmployee !== -1 || profileOwner) && ( */}

          {/* <Divider /> */}
          <div className={s.infoEmployee__viewBottom__row}>
            <Row>
              <Col span={18}>
                <p className={s.label}>Company alias (DBA):</p>
              </Col>
              <Col span={6}>
                <p className={s.value}>{name}</p>
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <p className={s.label}>Customer ID:</p>
              </Col>
              <Col span={6}>
                <p className={s.value}>{customerId}</p>
              </Col>
            </Row>

            <Row>
              <Col span={18}>
                <p className={s.label}>Status:</p>
              </Col>
              <Col span={6}>
                <p className={s.value}>{status}</p>
              </Col>
            </Row>

            <Row>
              <Col span={18}>
                <p className={s.label}>Account Owner:</p>
              </Col>
              <Col span={6}>
                <Link className={s.value}>{nameLegal}</Link>
              </Col>
            </Row>
          </div>

          {/* )} */}
          <Divider />
          <div className={s.infoEmployee__viewBottom__row}>
            <Row>
              <Col span={18}>
                <p className={s.label}>Open Leads:</p>
              </Col>
              <Col span={6}>
                <p className={s.value}>{openLeads}</p>
              </Col>
            </Row>

            <Row>
              <Col span={18}>
                <p className={s.label}>Active Projects:</p>
              </Col>
              <Col span={6}>
                <Link className={s.value}>{activeProject}</Link>
              </Col>
            </Row>

            <Row>
              <Col span={18}>
                <p className={s.label}>Open Tickets:</p>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p className={s.value}>{pendingTickets}</p>
                <img
                  style={{ display: 'inline-block', paddingBottom: '13px', paddingLeft: '8px' }}
                  src={plusIcon}
                  alt="plus"
                />
              </Col>
            </Row>

            <Row>
              <Col span={18}>
                <p className={s.label}>Open Tasks:</p>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p className={s.value}>{pendingTasks}</p>
                <img
                  style={{ display: 'inline-block', paddingBottom: '13px', paddingLeft: '8px' }}
                  src={plusIcon}
                  alt="plus"
                />
              </Col>
            </Row>
          </div>
          {/* <p className={s.titleTag}>Skills</p>
          <div> */}
          {/* {formatListSkill.map((item) => ( */}
          {/* <Tag>Tuan LUOngw</Tag> */}
          {/* ))} */}
          {/* </div> */}
          <Divider />
          <p>Tags</p>
          {tags.map((item) => {
            return <Tag key={item}>{item}</Tag>;
          })}

          <Divider />
          <div style={{ textAlign: 'center' }} className={s.infoEmployee__socialMedia}>
            <Tooltip title="LinkedIn" style={{ marginRight: '10px' }}>
              <a href="" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="img-arrow" />
              </a>
            </Tooltip>
            <Tooltip title="website">
              <a href="" target="_blank" rel="noopener noreferrer">
                <img src={websiteIcon} alt="img-arrow" />
              </a>
            </Tooltip>
          </div>
        </div>
        {/* <ModalUpload
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
        /> */}
      </div>
    );
  }
}

export default ViewInformation;
