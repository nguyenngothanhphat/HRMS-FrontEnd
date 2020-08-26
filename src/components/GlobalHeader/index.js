import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, logo, children, ...restProps } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.containerLeft}>
          <Icon
            className={styles.btnTrigger}
            // type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
            type="menu"
          />

          <span className={styles.companyName}>App Name</span>
        </div>
        <RightContent {...this.props} />
      </div>
    );
  }
}

export default GlobalHeader;
