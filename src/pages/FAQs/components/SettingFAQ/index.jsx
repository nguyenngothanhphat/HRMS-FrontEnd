import React, { PureComponent } from 'react';
import { Row, Col, Menu } from 'antd';
import FaqCategory from './components/FaqCategory';
import ListQuestionAnswer from './components/ListQuestionAnswer';
import { PageContainer } from '@/layouts/layout/src';

import styles from './index.less';

class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: 'category',
    };
  }

  handleChange = (key) => {
    this.setState({ content: key });
  };

  render() {
    const getContent = () => {
      const { content } = this.state;
      if (content === 'category') {
        return <FaqCategory />;
      }
      return <ListQuestionAnswer />;
    };

    return (
      <PageContainer>
        <Row className={styles.SettingFAQ}>
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
                      <Menu.Item key="category">FAQ Categories</Menu.Item>
                      <Menu.Item key="faqList">FAQ List</Menu.Item>
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
