import React, { Component } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty } from 'lodash';

import lines from '@/assets/lines.svg';
import bigLines from '@/assets/bigLines.svg';
import EmployeeNode from './components/EmployeeNode';

import styles from './index.less';
import CollapseNode from '../CollapseNode';

@connect(
  ({
    employee: { dataOrgChart = {}, listEmployeeAll = [] } = {},
    user: { currentUser: { employee: { _id: idCurrentUser = '' } = {} } = {} } = {},
    loading,
  }) => ({
    dataOrgChart,
    idCurrentUser,
    loading: loading.effects['employee/fetchDataOrgChart'],
    loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
    listEmployeeAll,
  }),
)
class OrganizationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      itemSelected: '',
    };
    this.userRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutSide);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutSide);
  }

  handleClickOutSide = (event) => {
    const { target } = event;
    if (!this.userRef.current.contains(target)) {
      this.setState({ itemSelected: '' });
    }
  };

  handleCollapse = () => {
    const { isCollapsed = false } = this.state;
    this.setState({ isCollapsed: !isCollapsed });
  };

  clickCardInfo = (userData) => {
    const { handleClickNode = () => {} } = this.props;
    handleClickNode(userData);
    this.setState({ itemSelected: userData._id });
  };

  renderCardInfo = (userData) => {
    const {
      generalInfo: {
        avatar = '',
        firstName: userFirstName = '',
        middleName: userMiddleName = '',
        lastName: userLastName = '',
      } = {} || {},
      department: { name: deptName = '' } = {} || {},
      title: { name: jobTitleName = '' } = {} || {},
      location: {
        headQuarterAddress: { country: { name: countryName = '' } = {} || {} } = {} || {},
      } = {} || {},
    } = userData;
    const legalName = `${userFirstName} ${userMiddleName} ${userLastName}`;
    return (
      <div className={styles.node__card} onClick={() => this.clickCardInfo(userData)}>
        <Avatar className={styles.avatar} src={avatar} size={42} icon={<UserOutlined />} />
        <div className={styles.node__card__info}>
          <div className={styles.legalName}>{legalName}</div>
          <div className={styles.deptName}>{`${jobTitleName}, ${deptName}`}</div>
          <div className={styles.countryName}>{countryName}</div>
        </div>
      </div>
    );
  };

  renderParentNode = () => {
    const { dataOrgChart } = this.props;
    const { manager = {}, manager: { _id: idManager = '' } = {} } = dataOrgChart;
    return (
      <>
        {isEmpty(manager) ? null : (
          <div id={idManager || ''} className={`${styles.parentNode} ${styles.node}`}>
            parent
          </div>
        )}
      </>
    );
  };

  renderUserNode = () => {
    const { dataOrgChart, idCurrentUser = '' } = this.props;
    const { isCollapsed = false, itemSelected = '' } = this.state;

    const {
      user: { _id: idUser = '' } = {},
      user = {},
      employees: listEmployees = [],
    } = dataOrgChart;

    const isActive = itemSelected === idUser;
    const className = isActive ? styles.selectNode : styles.node;

    return (
      <div
        id={idUser}
        className={`${styles.userNode} ${styles.node} ${className}`}
        ref={this.userRef}
      >
        {this.renderCardInfo(user)}
        <div className={styles.userNode__bottom}>
          <div
            onClick={this.handleCollapse}
            className={
              isCollapsed
                ? styles.userNode__bottom_reporteesExpand
                : styles.userNode__bottom_reporteesCollapse
            }
          >
            {isCollapsed
              ? `- ${listEmployees.length} reportees`
              : `+ ${listEmployees.length} reportees`}
          </div>
          {idUser === idCurrentUser ? <div className={styles.userNode__bottom_you}>You</div> : null}
        </div>
      </div>
    );
  };

  renderChildrenList = () => {
    const { dataOrgChart } = this.props;
    const { isCollapsed = false, itemSelected = '' } = this.state;
    const { employees: listEmployees = [] } = dataOrgChart;

    if (listEmployees.length === 0) return null;
    return (
      <CollapseNode isCollapsed={isCollapsed}>
        <div className={styles.nodesTree}>
          <div className={styles.lineNode}>
            <div style={{ margin: '0 auto', width: 'fit-content' }}>
              <img alt="lines" src={listEmployees.length > 2 ? bigLines : lines} />
            </div>
          </div>
          <div className={styles.childrenList}>
            {listEmployees.length > 0 ? (
              <>
                {listEmployees.map((employee) => {
                  return (
                    <EmployeeNode
                      key={employee._id}
                      itemSelected={itemSelected}
                      employee={employee}
                      renderCardInfo={this.renderCardInfo}
                    />
                  );
                })}
              </>
            ) : null}
          </div>
        </div>
      </CollapseNode>
    );
  };

  render() {
    return (
      <div className={styles.orgChartRoot}>
        <div className={styles.charts}>
          {this.renderParentNode() /* Manager */}
          {this.renderUserNode() /* Current User */}
          {this.renderChildrenList() /* List Employees */}
        </div>
      </div>
    );
  }
}

export default OrganizationChart;
