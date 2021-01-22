import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import ItemCompany from './components/ItemCompany';

import s from './index.less';

@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class AccountSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // q: '',
    };
  }

  // onChangeSearch = ({ target: { value } }) => {
  //   this.setState({
  //     q: value,
  //   });
  // };

  render() {
    // const { q = '' } = this.state;
    const {
      currentUser: { generalInfo: { workEmail = '', avatar = '' } = {}, company = {} } = {},
    } = this.props;
    return (
      <div className={s.root}>
        <div style={{ width: '629px' }}>
          <div className={s.blockUserLogin}>
            <div className={s.blockUserLogin__avt}>
              <Avatar size={56} icon={<UserOutlined />} src={avatar} />
            </div>
            <div className={s.blockUserLogin__info}>
              <p>
                You are logged in as{' '}
                <span className={s.blockUserLogin__info__email}>{workEmail}</span>
              </p>
              <p style={{ marginTop: '8px' }}>You have administrative privileges.</p>
              <p className={s.blockUserLogin__info__action}>Log in with another account</p>
            </div>
            <div className={s.blockUserLogin__action}>
              <SettingOutlined className={s.blockUserLogin__action__icon} />
              <LogoutOutlined
                className={s.blockUserLogin__action__icon}
                style={{ marginLeft: '24px' }}
              />
            </div>
          </div>
          <div className={s.text}>Please select a company profile to proceed</div>
          {/* <Input
            placeholder="Search for company"
            suffix={<SearchOutlined style={{ color: '#707177' }} />}
            onChange={this.onChangeSearch}
            value={q}
          /> */}

          <ItemCompany company={company} />
          {/* <Button className={s.btnAddNew}>Add a new company profile</Button> */}
        </div>
      </div>
    );
  }
}

export default AccountSetup;
