import React, { PureComponent } from 'react';
import s from './index.less';

export default class CompanySignatory extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <p className={s.title}>Company Signatory</p>
        </div>
      </div>
    );
  }
}
