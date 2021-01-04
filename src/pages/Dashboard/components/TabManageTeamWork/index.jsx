/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Avatar, Spin } from 'antd';
import moment from 'moment';
import s from './index.less';

const { TabPane } = Tabs;

export default class ManageTeamWork extends PureComponent {
  renderItemMyTeam = (item = {}) => {
    const {
      generalInfo: { avatar = '', firstName = '' } = {},
      title: { name: title = '' } = {},
    } = item;
    return (
      <div className={s.containerItemMyTeam}>
        <Avatar size={42} src={avatar} icon={<UserOutlined />} />
        <div className={s.containerItemMyTeam__viewInfo}>
          <div className={s.containerItemMyTeam__viewInfo__name}>{firstName}</div>
          <div className={s.containerItemMyTeam__viewInfo__jobDetail}>{title}</div>
        </div>
      </div>
    );
  };

  renderItemProject = (item = {}) => {
    const { name = '', status = '', createdAt = '', endDate = '' } = item;
    return (
      <div className={s.containerItemProject}>
        <div className={s.viewTop}>{name}</div>
        <div className={s.viewBottom}>
          <div className={s.viewBottom__row}>
            <p>
              Status: <span>{status}</span>
            </p>
          </div>
          <div className={s.viewBottom__row}>
            <p>
              Created: <span>{moment(createdAt).format('DD/MM/YYYY')}</span>
            </p>
            <p>
              End: <span>{moment(endDate).format('DD/MM/YYYY')}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  viewEmpty = (text = 'Member') => {
    return <div className={s.viewEmpty}>No {text}</div>;
  };

  render() {
    const {
      listMyTeam = [],
      loadingMyTeam = false,
      listProject = [],
      loadingProject = false,
    } = this.props;

    return (
      <div className={s.root}>
        <Tabs
          defaultActiveKey="1"
          tabBarExtraContent={
            <div className={s.extraBtn}>
              <PlusOutlined />
            </div>
          }
        >
          <TabPane tab="My Team" key="1">
            <div className={s.contentTab}>
              {loadingMyTeam ? (
                <div className={s.contentTab__loading}>
                  <Spin />
                </div>
              ) : (
                <Row gutter={[40, 10]}>
                  {listMyTeam.length === 0
                    ? this.viewEmpty()
                    : listMyTeam.map((item) => (
                        <Col span={12} key={item._id}>
                          {this.renderItemMyTeam(item)}
                        </Col>
                      ))}
                </Row>
              )}
            </div>
          </TabPane>
          <TabPane tab="My Projects" key="2">
            <div className={s.contentTab}>
              {loadingProject ? (
                <div className={s.contentTab__loading}>
                  <Spin />
                </div>
              ) : (
                <>
                  {listProject.length === 0
                    ? this.viewEmpty('Project')
                    : listProject.map((item) => this.renderItemProject(item))}
                </>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
