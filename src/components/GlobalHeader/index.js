import React, { PureComponent } from 'react';
import Link from 'umi/link';
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
        <Link to="/" className={styles.containerLeft}>
          <img className={styles.logoStyles} src={logo} alt="logo" />
          <span className={styles.companyName}>Expenso</span>
        </Link>

        {/* <BreadcrumbView className={styles.breadcrumb} linkElement={Link} {...restProps} /> */}
        <RightContent {...this.props} />
      </div>
    );
  }
}

export default GlobalHeader;
