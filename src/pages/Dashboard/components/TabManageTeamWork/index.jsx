import React, { PureComponent } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Avatar, Spin } from 'antd';
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

  render() {
    const { listMyTeam = [], loadingMyTeam = false } = this.props;
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
                  {listMyTeam.map((item) => (
                    <Col span={12} key={item._id}>
                      {this.renderItemMyTeam(item)}
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </TabPane>
          <TabPane tab="My Projects" key="2">
            <div className={s.contentTab}>Content of Tab My Projects</div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
