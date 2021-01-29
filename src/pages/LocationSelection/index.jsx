/* eslint-disable react/jsx-curly-newline */
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import avtDefault from '@/assets/avtDefault.jpg';
import { Avatar } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import ItemCompany from './ItemCompany';
import s from './index.less';

// const { Option } = Select;

// const dummyPosition = ['Owner', 'CEO', 'ADMIN-CSA', 'HR-GLOBAL', 'HR-MANAGER'];

@connect(
  ({
    user: { currentUser = {} } = {},
    locationSelection: { listLocationsByCompany = [] } = {},
  }) => ({
    currentUser,
    listLocationsByCompany,
  }),
)
class LocationSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const {
      dispatch,
      currentUser: { company: { _id = '' } = {} },
    } = this.props;
    dispatch({
      type: 'locationSelection/fetchLocationsByCompany',
      payload: {
        company: _id,
      },
    });
  };

  onChangeSelect = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const {
      currentUser: { generalInfo: { avatar = '' } = {}, company = {}, email = '' } = {},
      listLocationsByCompany = [],
    } = this.props;
    return (
      <div className={s.root}>
        <div style={{ width: '629px' }}>
          <div className={s.blockUserLogin}>
            <div className={s.blockUserLogin__avt}>
              <Avatar size={56} icon={<UserOutlined />} src={avatar || avtDefault} />
            </div>
            <div className={s.blockUserLogin__info}>
              <p>
                You are logged in as <span className={s.blockUserLogin__info__email}>{email}</span>
              </p>
              <p style={{ marginTop: '8px' }}>You have administrative privileges.</p>
            </div>
            <div className={s.blockUserLogin__action}>
              <SettingOutlined className={s.blockUserLogin__action__icon} />
              <LogoutOutlined
                onClick={this.handleLogout}
                className={s.blockUserLogin__action__icon}
                style={{ marginLeft: '24px' }}
              />
            </div>
          </div>
          {listLocationsByCompany.map((value) => {
            const { name = '' } = value;
            return <ItemCompany company={company} location={name} />;
          })}
        </div>
      </div>
    );
  }
}

export default LocationSelection;
