import React, { Component } from 'react';
import { Row, Col, Collapse, Tree, Popconfirm } from 'antd';
import { connect } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import icon from '@/assets/primary-administrator.svg';
import editIcon from '@/assets/edit-administrator.svg';
import deleteIcon from '@/assets/deleteIcon-Administator.svg';
import arrowIcon from '@/assets/arrowDownCollapseIcon.svg';

import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['adminApp/removeAdmin'],
}))
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
    const { dispatch } = this.props;
    const { list = [] } = this.state;
    const getUserInfo = list ? list[index] : [];
    const getIdUser = getUserInfo.usermap ? getUserInfo.usermap._id : '';
    if (index > -1) {
      list.splice(index, 1);
      dispatch({
        type: 'adminApp/removeAdmin',
        payload: {
          id: getIdUser
        }
      })
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

    let treeData = formatList.map((moduleName, index) => {
      let result = permissionList.map((per) => {
        const { _id = '', name = '', module = '' } = per;
        if (moduleName === module && idList.includes(_id)) {
          return {
            title: name,
            key: _id,
          };
        }
        return 0;
      });
      result = result.filter((val) => val !== 0);
      if (result.length > 0) {
        return {
          key: index,
          title: moduleName,
          children: result,
        };
      }
      return 0;
    });
    treeData = treeData.filter((val) => val !== 0);

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
      <div className={styles.icon}>
        <img
          src={arrowIcon}
          alt="arrow"
          className={isActive ? styles.upsideDownArrow : styles.normalArrow}
        />
      </div>
    );

    return (
      <>
        {list.map((adminstrator, index) => {
          const {
            permissionAdmin = [],
            usermap: {
              firstName = '',
              email = '',
              position = `${firstName}’s permission apply to everyone in the company`,
            } = {},
          } = adminstrator;
          const moduleList = this.renderListModule(permissionAdmin, permissionList);
          return (
            <div className={styles.addAdminstrator} key={`${index + 1}`}>
              <Row gutter={[0, 16]}>
                <Row className={styles.addAdminstrator__row}>
                  <Col span={8}>
                    <div className={styles.addAdminstrator__right}>
                      <div className={styles.name}>{firstName}</div>
                    </div>
                  </Col>
                  <Col span={1} />
                  <Col span={13}>
                    <div className={styles.addAdminstrator__header}>
                      <div className={styles.listRole}>
                        {moduleList.map((module) => (
                          <div className={styles.role} key={module}>
                            {module}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col span={2}>
                    <div className={styles.btnActions}>
                      <div
                        className={styles.btnActions__edit}
                        onClick={() => handleEditAdmin(true, index)}
                      >
                        <img src={editIcon} alt="edit-administrator" />
                        {/* <span>Edit</span> */}
                      </div>
                      <Popconfirm
                        title="Are you sure to delete this administrator?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => this.handleDelete(index)}
                      >
                        <div className={styles.btnActions__delete}>
                          <img src={deleteIcon} alt="delete-administrator" />
                          {/* <span>Delete</span> */}
                        </div>
                      </Popconfirm>
                      ,
                    </div>
                  </Col>
                </Row>
                <Row className={styles.addAdminstrator__row}>
                  <Col span={8}>
                    <div className={styles.addAdminstrator__admin}>
                      <div className={styles.email}>{email}</div>
                    </div>
                  </Col>
                  <Col span={1} />
                  <Col span={13}>
                    <div className={styles.addAdminstrator__admin}>
                      <img src={icon} alt="primary-administrator" />
                      <div className={styles.position}>{position}</div>
                    </div>
                  </Col>
                  <Col span={2} />
                </Row>
                <Row className={styles.addAdminstrator__row}>
                  <Col span={8} />
                  <Col span={1} />
                  <Col span={13}>
                    <Collapse
                      ghost
                      expandIconPosition="right"
                      className={styles.permissionCollapse}
                      expandIcon={expandIcon}
                    >
                      <Panel header="Show permissions" className={styles.permissionPanel}>
                        {this.renderListPermission(permissionAdmin)}
                      </Panel>
                    </Collapse>
                  </Col>
                  <Col span={2} />
                </Row>
                {/* <Col span={8} />
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
                      {this.renderListPermission(permissionAdmin)}
                    </Panel>
                  </Collapse>
                </Col> */}
              </Row>
              <div className={styles.divider} />
            </div>
          );
        })}
      </>
    );
  }
}

export default ViewAdministrator;
