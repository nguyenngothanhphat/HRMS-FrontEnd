import React, { PureComponent } from 'react';
import s from './index.less';

export default class WorkLocations extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <p className={s.title}>Work Locations</p>
        </div>
      </div>
    );
  }
}
