import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import s from './index.less';

export default class GetStarted extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <Link to="/account-setup/get-started/company-profile/12345678">
            <Button className={s.btnOutline}>Start</Button>
          </Link>
        </div>
      </div>
    );
  }
}
