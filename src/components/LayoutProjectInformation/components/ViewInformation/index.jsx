import { Button, Col, Divider, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect, Link } from 'umi';
import avtDefault from '@/assets/avtDefault.jpg';
import MockCustomerLogo from '@/assets/mockCustomerLogo.png';
import CustomTag from '../CustomTag';
import s from '../../index.less';

@connect(({ loading, customerProfile: { listTag = [], info = {} } = {} }) => ({
  info,
  listTag,
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
      } = {},
      legalName = '',
      status = '',
      pendingTickets = '',
      pendingTasks = '',
      activeProject = '',
      customerId = '',
      openLeads = '',
    } = info;

    const items = [
      {
        name: 'Customer',
        value: 'FPT',
      },
      {
        name: 'Project alias',
        value: 'ABC',
      },
      {
        name: 'Project ID',
        value: 'TER101',
      },
      {
        name: 'Status',
        value: 'Pending Biz Code',
      },
      {
        name: 'Engagement Type',
        value: 'T&M',
      },
      {
        name: 'Division',
        value: 'Design',
      },
      {
        name: 'Account Owner',
        value: <span className={s.clickable}>Brandon Mango</span>,
      },
      {
        name: 'Engineering Owner',
        value: <span className={s.clickable}>Omar Donin</span>,
      },
    ];

    const tags = ['Design', 'Application Dev', 'Backend Dev', 'Frontend Dev'];
    const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];
    const getColor = (index) => {
      return colors[index % colors.length];
    };

    return (
      <div className={s.viewRight__projectInfo} style={{ position: 'relative' }}>
        <Button className={s.btnEdit}>Edit</Button>
        <img
          src="/assets/images/img-cover.jpg"
          alt="img-cover"
          className={s.projectInfo__imgCover}
        />
        <img src={avatar || MockCustomerLogo} alt="img-avt" className={s.projectInfo__imgAvt} />
        <img
          src="/assets/images/iconUploadImage.svg"
          onClick={this.openModalUpload}
          alt="img-upload"
          className={s.projectInfo__imgAvt__upload}
        />
        <div className={s.projectInfo__textNameAndTitle}>
          <p className={s.projectInfo__textNameAndTitle__name}>ABC Redesign</p>
        </div>
        <div className={s.projectInfo__viewBottom}>
          <div className={s.projectInfo__viewBottom__row}>
            {items.map((x) => {
              return (
                <Row>
                  <Col span={12}>
                    <p className={s.label}>{x.name}</p>
                  </Col>
                  <Col span={12}>
                    <p className={s.value}>{x.value}</p>
                  </Col>
                </Row>
              );
            })}
          </div>

          <Divider />
          <p>Tags</p>
          {tags.map((t, i) => (
            <CustomTag color={getColor(i)}>{t}</CustomTag>
          ))}
        </div>
      </div>
    );
  }
}

export default ViewInformation;
