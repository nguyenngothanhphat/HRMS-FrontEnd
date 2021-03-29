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

@connect(({ loading, adminSetting: { tempData: { newListPermission = [] } = {} } = {} }) => ({
  loading: loading.effects['adminSetting/fetchListPermission'],
  newListPermission,
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
      type: 'adminSetting/fetchListPermission',
      payload: {
        type: 'ADMIN',
      },
    });
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  renderDataPermission = () => {
    const { newListPermission = [] } = this.props;
    // const data = [...newListPermission];
    // const { _id = '', name = '', module = '' } = newListPermission;
    const abc = [
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
    ];

    const group = newListPermission.reduce((r, a) => {
      console.log('a', a);
      console.log('r', r);
      r[a.make] = [...(r[a.make] || []), a];
      return r;
    }, {});
    console.log('group', group);
  };

  render() {
    const {
      listAdministrator: { employeeName = '', email = '', position = '' } = {},
      loading,
    } = this.props;
    const { Panel } = Collapse;
    const expandIcon = ({ isActive }) => (
      <DownOutlined className={styles.expandIcon} rotate={isActive ? 180 : 0} />
    );

    this.renderDataPermission();
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
                <Tree
                  showLine
                  loadData={loading}
                  switcherIcon={<DownOutlined />}
                  onSelect={this.onSelect}
                  treeData={listPermissions}
                />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewPrimary;
