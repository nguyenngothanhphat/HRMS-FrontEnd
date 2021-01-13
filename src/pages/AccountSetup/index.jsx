import { LogoutOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import React, { Component } from 'react';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

class AccountSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
    };
  }

  onChangeSearch = ({ target: { value } }) => {
    this.setState({
      q: value,
    });
  };

  render() {
    const { q = '' } = this.state;
    const dummyListCompany = [
      { id: '1', name: 'Terralogic Pvt. Limited', location: 'Vietnam' },
      { id: '2', name: 'Terralogic Pvt. Limited', location: 'San Jose', status: 'done' },
    ];
    return (
      <div className={s.root}>
        <div style={{ width: '629px' }}>
          <div className={s.blockUserLogin}>
            <div className={s.blockUserLogin__avt}>
              <img
                src="http://api-stghrms.paxanimi.ai/api/attachments/5faa295b6e1cea81aaf49730/Shi%20Liuxian.jpg"
                alt="avatar"
                className={s.blockUserLogin__avt__img}
              />
            </div>
            <div className={s.blockUserLogin__info}>
              <p>
                You are logged in as{' '}
                <span className={s.blockUserLogin__info__email}>hrmanager@terralogic.com</span>
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
          <Input
            placeholder="Search for company"
            suffix={<SearchOutlined style={{ color: '#707177' }} />}
            onChange={this.onChangeSearch}
            value={q}
          />
          {dummyListCompany.map((company) => (
            <ItemCompany key={company.id} company={company} />
          ))}
          <Button className={s.btnAddNew}>Add a new company profile</Button>
        </div>
      </div>
    );
  }
}

export default AccountSetup;
