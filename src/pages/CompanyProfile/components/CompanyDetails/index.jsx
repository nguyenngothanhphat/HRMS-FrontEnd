import React, { PureComponent } from 'react';
import s from './index.less';

export default class UserManagement extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <p className={s.title}>Component Company details</p>
        </div>
      </div>
    );
  }
}
