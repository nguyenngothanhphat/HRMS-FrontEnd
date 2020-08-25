import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Badge, Icon } from 'antd';
import Link from 'umi/link';
import { isUrl } from '@/utils/utils';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import styles from './BaseMenu.less';

const { SubMenu } = Menu;

const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return (
      <img
        src={icon}
        alt="icon"
        style={{ width: '35px', marginLeft: '-7px' }}
        className={styles.icon}
      />
    );
  }

  if (typeof icon === 'string') {
    return <Icon type={icon} style={{ fontSize: '18px' }} />;
  }
  return icon;
};

export default class BottomMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if ((menusData && menusData.length === 0) || !menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu && item.isBottomMenu)
      .map(item => this.getSubMenuOrItem(item, parent))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    if (flatMenuKeys.length === 0) return [];
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span className={styles.txtMenu}>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  handleOnclick = isDraw => {
    const { onCollapse, handleMenuOnclick } = this.props;
    onCollapse(!isDraw);
    handleMenuOnclick(true);
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name, counter } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <span>
          <Link to={itemPath} target={target}>
            {icon}
            <span>{name}</span>
          </Link>
        </span>
      );
    }
    const { location, isDraw } = this.props;
    return (
      <span>
        <Link
          to={isDraw && itemPath}
          target={target}
          replace={itemPath === location.pathname}
          onClick={() => this.handleOnclick(isDraw)}
        >
          {icon}
          <span className={styles.txtMenu}>{name} </span>
          {counter !== 0 && (
            <div style={{ float: 'right', paddingRight: '30px' }}>
              <Badge style={{ background: '#EA7025' }} count={counter} />
            </div>
          )}
        </Link>
      </span>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
