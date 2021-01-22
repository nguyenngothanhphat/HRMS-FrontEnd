/* eslint-disable react/jsx-curly-newline */
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Row, Col, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

const { Option } = Select;

const listDummy = [1, 2, 3, 4, 5, 6, 7];

@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class AccountSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: undefined,
      location: undefined,
    };
  }

  onChangeSelect = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  render() {
    const {
      currentUser: { generalInfo: { workEmail = '', avatar = '' } = {}, company = {} } = {},
    } = this.props;
    const { position = '', location = '' } = this.state;
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
            </div>
            <div className={s.blockUserLogin__action}>
              <SettingOutlined className={s.blockUserLogin__action__icon} />
              <LogoutOutlined
                className={s.blockUserLogin__action__icon}
                style={{ marginLeft: '24px' }}
              />
            </div>
          </div>
          <Row className={s.blockQuestion}>
            <Col span={11}>
              <p className={s.blockQuestion__title}>What’s your position in company</p>
              <Select
                placeholder="Select Position"
                showArrow
                showSearch
                onChange={(value) => this.onChangeSelect(value, 'position')}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={position}
              >
                {listDummy.map((item) => (
                  <Option key={item}>{item.name}</Option>
                ))}
              </Select>
            </Col>
            <Col span={11} offset={2}>
              <p className={s.blockQuestion__title}>Work location</p>
              <Select
                placeholder="Select Location"
                showArrow
                showSearch
                onChange={(value) => this.onChangeSelect(value, 'location')}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={location}
              >
                {listDummy.map((item) => (
                  <Option key={item}>{item.name}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <ItemCompany company={company} />
        </div>
      </div>
    );
  }
}

export default AccountSetup;
