/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { PlusOutlined, UserOutlined, ProjectOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Avatar, Spin } from 'antd';
import { Link } from 'umi';
import moment from 'moment';
import s from './index.less';

const { TabPane } = Tabs;

export default class ManageTeamWork extends PureComponent {
  renderItemMyTeam = (item = {}) => {
    const {
      generalInfo: { avatar = '', firstName = '', userId = '' } = {},
      title: { name: title = '' } = {},
      _id = '',
    } = item;
    return (
      <Link to={`/employees/employee-profile/${userId}`}>
        <div className={s.containerItemMyTeam}>
          <Avatar size={42} src={avatar} icon={<UserOutlined />} />
          <div className={s.containerItemMyTeam__viewInfo}>
            <div className={s.containerItemMyTeam__viewInfo__name}>{firstName}</div>
            <div className={s.containerItemMyTeam__viewInfo__jobDetail}>{title}</div>
          </div>
        </div>
      </Link>
    );
  };

  renderItemProject = (item = {}) => {
    const { logo = '', name = '', beginDate = '', endDate = '' } = item;
    const start = moment(beginDate).format('MMM YYYY');
    const end = moment(endDate).format('MMM YYYY');
    return (
      <div className={s.containerItemMyTeam}>
        <Avatar size={42} src={logo} icon={<ProjectOutlined />} />
        <div className={s.containerItemMyTeam__viewInfo}>
          <div className={s.containerItemMyTeam__viewInfo__name}>{name}</div>
          <div className={s.containerItemMyTeam__viewInfo__jobDetail}>
            {start} - {end}
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
                        <Col span={8} key={item._id}>
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
                <Row gutter={[40, 10]}>
                  {listProject.length === 0
                    ? this.viewEmpty('Project')
                    : listProject.map((item) => (
                        <Col span={8} key={item._id}>
                          {this.renderItemProject(item)}
                        </Col>
                      ))}
                </Row>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
