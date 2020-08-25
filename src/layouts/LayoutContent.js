import React from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { Link } from 'umi';
import styles from './LayoutContent.less';

const LayoutContent = ({ tabs = [], activeKey }) => {
  let content;
  const menu = tabs.map(({ name, key, link, content: tabContent, alt }) => {
    let childItemMenu = <span>{name}</span>;
    if (key !== activeKey) {
      childItemMenu = (
        <Tooltip placement="top" title={alt}>
          <Link to={link}>{name}</Link>
        </Tooltip>
      );
    } else content = tabContent;
    return (
      <Menu.Item key={key} className={styles.title}>
        {childItemMenu}
      </Menu.Item>
    );
  });
  return (
    <Layout className={styles.root} hasSider={false}>
      <Layout.Header className={styles.header}>
        <Menu className={styles.menu} mode="horizontal" selectedKeys={[activeKey]}>
          {menu}
        </Menu>
      </Layout.Header>
      <Layout.Content>{content}</Layout.Content>
    </Layout>
  );
};

export default LayoutContent;
