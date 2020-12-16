import React, { PureComponent } from 'react';
import { Tag } from 'antd';
import { Link } from 'umi';
import s from './index.less';

export default class Links extends PureComponent {
  renderLink = (item) => {
    const { name = '', href = '', isNew = false } = item;
    return (
      <div style={{ display: 'flex' }}>
        <Link to={href} className={s.link}>
          {name}
        </Link>
        {isNew && <div className={s.new}>New</div>}
      </div>
    );
  };

  render() {
    const { title = '', showButton = false, listData = [] } = this.props;
    return (
      <div className={s.root}>
        <div className={s.viewTop}>
          <div className={s.title}>{title}</div>
          {showButton && <div className={s.btnViewAll}>View all</div>}
        </div>
        {listData.map((item) => this.renderLink(item))}
      </div>
    );
  }
}
