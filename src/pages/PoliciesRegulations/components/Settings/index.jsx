import React, { Component } from 'react';
import { Row, Col, Menu } from 'antd';
import Regulations from './components/Regulations';
import Categories from './components/Categories';
import { PageContainer } from '@/layouts/layout/src';

import styles from './index.less';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  handleChange = (key) => {
    this.setState({ content: key });
  };

  render() {
    const getContent = () => {
      const { content } = this.state;
      if (content === 'regulations') {
        return <Regulations />;
      }
      return <Categories />;
    };

    return (
      <PageContainer>
        <Row className={styles.Settings}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>Settings</div>
            </div>
          </Col>
          <Col span={24} />
          <Col span={24}>
            <div className={styles.containerPolicies}>
              <Row>
                <Col span={5}>
                  <div className={styles.setttingsTabs}>
                    <Menu
                      defaultSelectedKeys={['category']}
                      onClick={(e) => this.handleChange(e.key)}
                    >
                      <Menu.Item key="category">Policies Categories</Menu.Item>
                      <Menu.Item key="regulations">Policies & Regulations</Menu.Item>
                    </Menu>
                  </div>
                </Col>

                <Col span={19}>{getContent()}</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}
export default Settings;
