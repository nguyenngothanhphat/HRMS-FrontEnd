import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import s from './index.less';

export default class AccountSetup extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.blockUserLogin}>Block user login</div>
        <Link to="/account-setup/get-started">
          <Button className={s.btnOutline}>Get Started</Button>
        </Link>
      </div>
    );
  }
}
