import React, { Component } from 'react';
import { Row, Col, Collapse } from 'antd';
import icon from '@/assets/primary-administrator.svg';
import editIcon from '@/assets/edit-administrator.svg';
import deleteIcon from '@/assets/delete-administrator.svg';
import { DownOutlined } from '@ant-design/icons';

import styles from './index.less';

const listPermissions = [
  {
    id: 1,
    permission: 'User',
  },
  {
    id: 2,
    permission: 'Employees',
  },
  {
    id: 3,
    permission: 'Profile',
  },
  {
    id: 4,
    permission: 'Directory',
  },
  {
    id: 5,
    permission: 'Onboarding',
  },
  {
    id: 6,
    permission: 'Setting',
  },
];

class ViewAdministrator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { listAdminstrator = [] } = this.props;

    const { Panel } = Collapse;
    const expandIcon = ({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />;
    return (
      <>
        {listAdminstrator.map((adminstrator, index) => {
          const { listRole = [], employeeName = '', email = '', position = '' } = adminstrator;

          return (
            <div
              className={styles.addAdminstrator}
              key={`${index + 1}`}
              style={index > 0 ? { paddingTop: '30px' } : null}
            >
              <Row gutter={[0, 16]}>
                <Col span={8} />
                <Col span={16}>
                  <div className={styles.addAdminstrator__header}>
                    <>
                      {listRole.map((item) => (
                        <div className={styles.listRole} key={item.id}>
                          <div className={styles.role}>{item.role}</div>
                        </div>
                      ))}
                    </>
                    <div className={styles.actions}>
                      <div className={styles.actions__edit}>
                        <img src={editIcon} alt="edit-administrator" />
                        <span>Edit</span>
                      </div>
                      <div className={styles.actions__delete}>
                        <img src={deleteIcon} alt="delete-administrator" />
                        <span>Delete</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.addAdminstrator__left}>
                    <div>Employee Name</div>
                  </div>
                </Col>
                <Col span={16}>
                  <div className={styles.addAdminstrator__right}>
                    <div className={styles.name}>{employeeName}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.addAdminstrator__left}>
                    <div>Email</div>
                  </div>
                </Col>
                <Col span={16}>
                  <div className={styles.addAdminstrator__right}>
                    <div className={styles.email}>{email}</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.addAdminstrator__left}>
                    <div>Position</div>
                  </div>
                </Col>
                <Col span={16}>
                  <div className={styles.addAdminstrator__right}>
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
                      {listPermissions.map((item) => (
                        <p key={item.id}>{item.permission}</p>
                      ))}
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
            </div>
          );
        })}
      </>
    );
  }
}

export default ViewAdministrator;
