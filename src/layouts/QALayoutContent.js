import React, { PureComponent } from 'react';
import { Row, Col, Layout, Menu, Icon, Typography } from 'antd';
import { Link } from 'umi';
import styles from './QALayoutContent.less';

const { Title } = Typography;

class LayoutContent extends PureComponent {
  state = {
    collapsed: false,
    showIcon: false,
  };

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  onBreakpoint = breakpoint => {
    if (breakpoint) {
      this.setState({
        collapsed: true,
        showIcon: true,
      });
    } else {
      this.setState({
        collapsed: false,
        showIcon: false,
      });
    }
  };

  render() {
    const { collapsed, showIcon } = this.state;
    const { tabs = [], activeKey, itemContent, activeSubMenukey, headerName } = this.props;
    let content = itemContent;
    const span = showIcon ? 22 : 24;
    const menu = tabs.map(({ isMenu, name, key, itemMenu }) => {
      return !isMenu ? (
        <Menu.SubMenu key={key} title={name}>
          {itemMenu.map(i => {
            let childItemMenu = <span>{i.name}</span>;
            if (i.key !== activeKey) {
              childItemMenu = <Link to={i.link}>{i.name}</Link>;
            } else content = itemContent;
            return (
              <Menu.Item key={i.key} className={styles.title}>
                {childItemMenu}
              </Menu.Item>
            );
          })}
        </Menu.SubMenu>
      ) : (
        itemMenu.map(i => {
          let childItemMenu = <span>{i.name}</span>;
          if (i.key !== activeKey) {
            childItemMenu = <Link to={i.link}>{i.name}</Link>;
          } else content = itemContent;
          return (
            <Menu.Item key={i.key} className={styles.title}>
              {childItemMenu}
            </Menu.Item>
          );
        })
      );
    });
    const logo = '/assets/img/new-logo.png';
    return (
      <Layout className={styles.root}>
        <Layout.Sider
          width={270}
          className={styles.sider}
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
          breakpoint="md"
          onBreakpoint={broken => this.onBreakpoint(broken)}
        >
          <div className={styles.containerLogo} id="logo">
            <Link to="/">
              <div className={styles.logo}>
                <img className={styles.image} src={logo} alt="logo" />
                <span className={styles.title}>Expenso</span>
              </div>
            </Link>
          </div>
          <Menu
            className={styles.menu}
            mode="inline"
            // theme="dark"
            selectedKeys={[activeKey]}
            defaultOpenKeys={[activeSubMenukey]}
          >
            {menu}
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header style={{ background: '#fff', padding: '10px' }}>
            <Row>
              {showIcon && (
                <Col span={2}>
                  <Icon
                    className="trigger"
                    style={{ fontSize: '20px' }}
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                </Col>
              )}
              <Col span={span} style={{ textAlign: 'center' }}>
                <Title level={3} style={{ marginTop: '10px' }}>
                  {headerName}
                </Title>
              </Col>
            </Row>
          </Layout.Header>
          <Layout.Content style={{ padding: '20px', background: '#fff' }}>{content}</Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default LayoutContent;
