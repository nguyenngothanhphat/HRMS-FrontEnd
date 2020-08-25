import React, { PureComponent } from 'react';
import SiderMenu from './SiderMenu';
import { getFlatMenuKeys } from './SiderMenuUtils';
import styles from './index.less';

export default class SiderMenuWrapper extends PureComponent {
  render() {
    const { menuData } = this.props;
    const flatMenuKeys = getFlatMenuKeys(menuData);
    return (
      <div className={styles.containerMenu2} id="container">
        <SiderMenu {...this.props} isDraw width="100%" flatMenuKeys={flatMenuKeys} />
      </div>
    );
  }
}
