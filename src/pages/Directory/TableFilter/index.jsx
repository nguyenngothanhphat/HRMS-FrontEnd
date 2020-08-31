import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { Menu, Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

class TableFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render() {
    const { Header, Footer, Sider, Content } = Layout;
    return (
      <Layout className={styles.TabFilter}>
        <Sider
          width="410px"
          trigger={null}
          collapsed={this.state.collapsed}
          style={this.state.collapsed ? { display: 'none' } : { display: 'block' }}
        >
          <div className={styles.topFilter}>
            <div>Filters</div>
            <div className={styles.resetHide}>
              <p>Reset</p>
              <span>Hide</span>
            </div>
          </div>
          <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item className="testli" key="1">
              nav 1
            </Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

TableFilter.propTypes = {};

export default TableFilter;
