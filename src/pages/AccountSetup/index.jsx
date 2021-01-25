/* eslint-disable react/jsx-curly-newline */
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Row, Col, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import ItemCompany from './components/ItemCompany';
import s from './index.less';

const { Option } = Select;

const dummyPosition = ['Owner', 'CEO', 'ADMIN-CSA', 'HR-GLOBAL', 'HR-MANAGER'];

@connect(
  ({ user: { currentUser = {} } = {}, companiesManagement: { locationsList = [] } = {} }) => ({
    currentUser,
    locationsList,
  }),
)
class AccountSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: undefined,
      location: undefined,
    };
  }

  componentDidMount() {
    const { dispatch, currentUser: { company: { _id: id = '' } = {} } = {} } = this.props;
    dispatch({
      type: 'companiesManagement/fetchLocationsList',
      payload: { company: id },
    });
    // dispatch({
    //   type: 'departmentManagement/fetchListDepartmentByCompany',
    //   payload: { company: id },
    // });
  }

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
      locationsList = [],
    } = this.props;
    const { position, location } = this.state;
    return (
      <div className={s.root}>
        <div style={{ width: '629px' }}>
          <div className={s.blockUserLogin}>
            <div className={s.blockUserLogin__avt}>
              <Avatar size={56} icon={<UserOutlined />} src={avatar} />
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
                {dummyPosition.map((item) => (
                  <Option key={item}>{item}</Option>
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
                {locationsList.map((item) => (
                  <Option key={item._id}>{item.name}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <ItemCompany company={company} payload={{ position, location }} />
        </div>
      </div>
    );
  }
}

export default AccountSetup;
