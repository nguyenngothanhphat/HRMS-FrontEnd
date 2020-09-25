import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';

import menuIcon from './assets/menuIcon.svg';
import deleteIcon from './assets/deleteIcon.svg';
import downloadIcon from './assets/downloadIcon.svg';

import styles from './index.less';

class Template extends PureComponent {
  _renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a
            className={styles.menuItem}
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.alipay.com/"
          >
            <img src={downloadIcon} alt="menu" /> Download
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            className={styles.menuItem}
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.taobao.com/"
          >
            <img src={deleteIcon} alt="menu" /> Delete
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { template } = this.props;
    return (
      <div className={styles.Template}>
        <img
          className={styles.thumbnail}
          src={Object.values(template.templateThumbnail)}
          alt="thumbnails"
        />
        <div className={styles.template_info}>
          <p>{template.templateName}</p>
          <Dropdown
            className={styles.icon}
            trigger={['click']}
            overlay={this._renderMenu()}
            placement="topRight"
          >
            <img src={menuIcon} alt="menu" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default Template;
