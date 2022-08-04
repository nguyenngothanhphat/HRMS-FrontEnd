import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />
);

export default HeaderDropdown;
