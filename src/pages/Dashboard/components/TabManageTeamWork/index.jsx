import React, { PureComponent } from 'react';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Avatar } from 'antd';
import s from './index.less';

const { TabPane } = Tabs;

const dummyListMyTeam = [
  { avatar: '', name: 'Sharan Adla AAAAA AAAAA', jobDetail: 'UX Lead AAAAA AAAAA' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
  { avatar: '', name: 'Sharan Adla', jobDetail: 'UX Lead' },
];

export default class ManageTeamWork extends PureComponent {
  renderItemMyTeam = ({ name, avatar, jobDetail }) => {
    return (
      <div className={s.containerItemMyTeam}>
        <Avatar size={42} src={avatar} icon={<UserOutlined />} />
        <div className={s.containerItemMyTeam__viewInfo}>
          <div className={s.containerItemMyTeam__viewInfo__name}>{name}</div>
          <div className={s.containerItemMyTeam__viewInfo__jobDetail}>{jobDetail}</div>
        </div>
      </div>
    );
  };

  render() {
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
              <Row gutter={[40, 10]}>
                {dummyListMyTeam.map((item, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Col span={12} key={index}>
                    {this.renderItemMyTeam(item)}
                  </Col>
                ))}
              </Row>
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
