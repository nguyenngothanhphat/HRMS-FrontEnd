import React, { Component } from 'react';
import { Row, Col, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import icon from '@/assets/primary-administrator.svg';

import styles from './index.less';

class ViewPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const menu = (
      <Menu>
        <Menu.Item key='0'>
          1st menu item
        </Menu.Item>
        <Menu.Item key='1'>
          2nd menu item
        </Menu.Item>
        <Menu.Item key='3'>3rd menu item</Menu.Item>
      </Menu>
    );
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
              <img src={icon} alt='primary-administrator' />
              <div className={styles.email}>
                renil@terralogic.comRenil’s permission apply to everyone in the company
              </div>
            </div>
          </Col>
          <Col span={8} />
          <Col span={16}>
            <Dropdown overlay={menu} trigger={['click']}>
              <a className={styles.permissionsDropdown} onClick={e => e.preventDefault()}>
                Show Permissions <DownOutlined className={styles.permissionsDropdown__icon} />
              </a>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewPrimary;
