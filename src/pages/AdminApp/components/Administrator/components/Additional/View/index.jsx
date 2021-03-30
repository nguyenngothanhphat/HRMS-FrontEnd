import React, { Component } from 'react';
import { Row, Col, Collapse, Tree } from 'antd';
import icon from '@/assets/primary-administrator.svg';
import editIcon from '@/assets/edit-administrator.svg';
import deleteIcon from '@/assets/delete-administrator.svg';
import { CarryOutOutlined, DownOutlined } from '@ant-design/icons';

import styles from './index.less';

class ViewAdministrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    const { listAdministrator = [] } = this.props;
    this.setState({
      list: listAdministrator,
    });
  }

  handleDelete = (index) => {
    const { list = [] } = this.state;
    if (index > -1) {
      list.splice(index, 1);
    }
    this.setState({ list });
  };

  renderListPermission = (idList) => {
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
        showIcon={false}
        loadData={loading}
        treeData={treeData}
        onSelect={this.onSelect}
        showLine={{ showLeafIcon: false }}
      />
    );
  };

  renderListModule = (idList, permissionList) => {
    let result = [];
    idList.forEach((id) => {
      permissionList.map((per) => {
        if (id === per._id) {
          result.push(per?.module);
        }
        return 0;
      });
    });
    result = result.filter((module) => module !== 0);
    result = [...new Set(result)];
    return result;
  };

  render() {
    const { handleEditAdmin = () => {}, permissionList = [] } = this.props;
    const { list = [] } = this.state;

    const { Panel } = Collapse;
    const expandIcon = ({ isActive }) => (
      <DownOutlined className={styles.expandIcon} rotate={isActive ? 180 : 0} />
    );

    return (
      <>
        {list.map((adminstrator, index) => {
          const {
            permissionAdmin = [],
            usermap: { firstName = '', email = '', position = '' } = {},
          } = adminstrator;
          const moduleList = this.renderListModule(permissionAdmin, permissionList);
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
                    <div className={styles.listRole}>
                      {moduleList.map((module) => (
                        <div className={styles.role} key={module}>
                          {module}
                        </div>
                      ))}
                    </div>
                    <div className={styles.actions}>
                      <div
                        className={styles.actions__edit}
                        onClick={() => handleEditAdmin(true, index)}
                      >
                        <img src={editIcon} alt="edit-administrator" />
                        <span>Edit</span>
                      </div>
                      <div
                        className={styles.actions__delete}
                        onClick={() => this.handleDelete(index)}
                      >
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
                    <div className={styles.name}>{firstName}</div>
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
                      {/* {listPermissions.map((item) => (
                        <p key={item.id}>{item.permission}</p>
                      ))} */}
                      {this.renderListPermission(permissionAdmin)}
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
