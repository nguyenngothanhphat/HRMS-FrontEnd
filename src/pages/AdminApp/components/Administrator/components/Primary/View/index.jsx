import React, { Component } from 'react';
import { connect } from 'umi';
import { Row, Col, Collapse, Tree } from 'antd';
import icon from '@/assets/primary-administrator.svg';
import { DownOutlined } from '@ant-design/icons';

import styles from './index.less';

const listPermissions = [
  {
    title: 'User Management',
    key: 'userManagement',
    children: [
      {
        title: 'leaf',
        key: 'user1',
      },
      {
        title: 'leaf',
        key: 'user2',
      },
      {
        title: 'leaf',
        key: 'user3',
      },
    ],
  },
  {
    title: 'Employees Management',
    key: 'employeeManagement',
    children: [
      {
        title: 'leaf',
        key: 'employee1',
      },
      {
        title: 'leaf',
        key: 'employee2',
      },
      {
        title: 'leaf',
        key: 'employee3',
      },
    ],
  },
  {
    title: 'Profile',
    key: 'profile',
    children: [
      {
        title: 'leaf',
        key: 'profile1',
      },
      {
        title: 'leaf',
        key: 'profile2',
      },
      {
        title: 'leaf',
        key: 'profile3',
      },
    ],
  },
];

@connect(({ adminApp: { permissionList = [] } = {}, loading }) => ({
  permissionList,
  loadingFetchPermissionList: loading.effects['adminApp/fetchPermissionList'],
}))
class ViewPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getListPermissions();
  }

  getListPermissions = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminApp/fetchPermissionList',
      payload: {
        type: 'ADMIN',
      },
    });
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  renderListPermission = () => {
    const { permissionList = [], loading } = this.props;
    let formatList = permissionList.map((per) => per?.module);
    formatList = formatList.filter(
      (value) => value !== undefined && value !== '' && value !== null,
    );
    formatList = [...new Set(formatList)];
    const treeData = formatList.map((moduleName, index) => {
      let result = permissionList.map((per) => {
        const { _id = '', name = '', module = '' } = per;
        if (moduleName === module) {
          return {
            title: name,
            key: _id,
          };
        }
        return 0;
      });
      result = result.filter((val) => val !== 0);

      return {
        key: index,
        title: moduleName,
        children: result,
      };
    });

    return (
      <Tree
        showLine
        loadData={loading}
        switcherIcon={<DownOutlined />}
        onSelect={this.onSelect}
        treeData={treeData}
      />
    );
  };

  render() {
    const { listAdministrator: { employeeName = '', email = '', position = '' } = {} } = this.props;
    const { Panel } = Collapse;
    const expandIcon = ({ isActive }) => (
      <DownOutlined className={styles.expandIcon} rotate={isActive ? 180 : 0} />
    );

    return (
      <div className={styles.primaryView}>
        <Row gutter={[0, 16]}>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div>Employee Name</div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.primaryView__right}>
              <div className={styles.name}>{employeeName}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div>Email</div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.primaryView__right}>
              <div className={styles.email}>{email}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.primaryView__left}>
              <div>Position</div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.primaryView__right}>
              <img src={icon} alt="primary-administrator" />
              <div className={styles.position}>{position}</div>
            </div>
          </Col>
          <Col span={8} />
          <Col span={16}>
            <Collapse
              ghost
              expandIconPosition="right"
              className={styles.permissionCollapse}
              expandIcon={expandIcon}
            >
              <Panel header="Show permissions" className={styles.permissionPanel}>
                {this.renderListPermission()}
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewPrimary;
