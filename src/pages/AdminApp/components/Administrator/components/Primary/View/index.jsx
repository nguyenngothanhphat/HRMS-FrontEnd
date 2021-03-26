import React, { Component } from 'react';
import { Row, Col, Collapse } from 'antd';
import icon from '@/assets/primary-administrator.svg';
import { DownOutlined } from '@ant-design/icons';

import styles from './index.less';

const listPermissions = [
  {
    id: 1,
    permission: 'User',
  },
  {
    id: 2,
    permission: 'Employees',
  },
  {
    id: 3,
    permission: 'Profile',
  },
  {
    id: 4,
    permission: 'Directory',
  },
  {
    id: 5,
    permission: 'Onboarding',
  },
  {
    id: 6,
    permission: 'Setting',
  },
];

class ViewPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { Panel } = Collapse;
    const expandIcon = ({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />;

    return (
      <div className={styles.primaryView}>
        <Row gutter={[0, 16]}>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div>Employee Name</div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.primaryView__right}>
              <div className={styles.name}>Renil Komitla</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div>Email</div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.primaryView__right}>
              <div className={styles.email}>renil@terralogic.com</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div>Position</div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.primaryView__right}>
              <img src={icon} alt="primary-administrator" />
              <div className={styles.email}>
                renil@terralogic.comRenil’s permission apply to everyone in the company
              </div>
            </div>
          </Col>
          <Col span={8} />
          <Col span={16}>
            <Collapse
              ghost
              expandIconPosition="right"
              className={styles.permissionCollapse}
              expandIcon={expandIcon}
            >
              <Panel header="Show permissions" className={styles.permissionPanel}>
                {listPermissions.map((item) => (
                  <p key={item.id}>{item.permission}</p>
                ))}
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewPrimary;
