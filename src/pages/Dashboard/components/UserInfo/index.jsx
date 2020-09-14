/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import styles from './index.less';

class UserInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type1: true,
      type2: false,
    };
  }

  handleType1 = () => {
    this.setState({
      type1: true,
      type2: false,
    });
  };

  handleType2 = () => {
    this.setState({
      type1: false,
      type2: true,
    });
  };

  render() {
    const { type1, type2 } = this.state;
    return (
      <Row className={styles.UserInfo}>
        <Col sm={24} md={12} lg={12}>
          <p className={styles.titleDashBoard}>
            {formatMessage({ id: 'pages.dashboard.myDashboard' })}
          </p>
          <div className={styles.buttonTabName}>
            <Button type={type1 === true ? 'primary' : ''} onClick={this.handleType1}>
              {formatMessage({ id: 'pages.dashboard.adminTab' })}
            </Button>
            <Button type={type2 === true ? 'primary' : ''} onClick={this.handleType2}>
              {formatMessage({ id: 'pages.dashboard.personalTab' })}
            </Button>
          </div>
        </Col>
        <Col sm={24} md={12} lg={12}>
          <div className={styles.boxInfo}>
            <ul className={styles.boxTextRight}>
              <li className={styles.boxItem1}>Repoting Manger</li>
              <li>Thammu </li>
              <li>PSI-1009</li>
              <li className={styles.boxItem4}>
                <a href="">thammu@lollypop.design</a>
              </li>
            </ul>
            <div className={styles.iconBorder}>
              <Avatar icon={<UserOutlined />} />
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

UserInfo.propTypes = {};

export default UserInfo;
