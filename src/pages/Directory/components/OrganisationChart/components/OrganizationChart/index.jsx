import React, { Component } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { Collapse } from 'react-collapse';

import line from '@/assets/lineParent.svg';
import lines from '@/assets/lines.svg';
import bigLines from '@/assets/bigLines.svg';
import EmployeeNode from './components/EmployeeNode';

import styles from './index.less';
// import CollapseNode from '../CollapseNode';

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
      isCollapsedChild: true,
      itemSelected: '',
    };
    this.userRef = React.createRef();
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutSide);
  };

  componentDidUpdate = (prevProps) => {
    const { idSelect = '' } = this.props;
    if (prevProps.idSelect !== idSelect) {
      this.autoFocusNodeById(idSelect);
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutSide);
  };

  autoFocusNodeById = (id) => {
    this.setState({ itemSelected: id });
  };

  handleClickOutSide = (event) => {
    const { target } = event;
    if (!this.userRef.current.contains(target)) {
      this.setState({ itemSelected: '' });
    }
  };

  handleCollapse = (name) => {
    const { isCollapsed = false, isCollapsedChild = false } = this.state;

    if (name === 'parent') {
      this.setState({ isCollapsed: !isCollapsed });
    } else {
      this.setState({ isCollapsedChild: !isCollapsedChild });
    }
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
    const { isCollapsed, itemSelected = '' } = this.state;
    const { manager = {}, manager: { _id: idManager = '' } = {} } = dataOrgChart;
    const isActive = itemSelected === idManager;
    const className = isActive ? styles.selectNode : styles.node;
    return (
      <>
        {isEmpty(manager) ? null : (
          <>
            <div
              id={idManager || ''}
              className={`${styles.parentNode} ${styles.node} ${className}`}
            >
              {this.renderCardInfo(manager)}
              <div className={styles.node__bottom}>
                <div
                  onClick={() => this.handleCollapse('parent')}
                  className={
                    isCollapsed
                      ? styles.node__bottom_reporteesExpand
                      : styles.node__bottom_reporteesCollapse
                  }
                >
                  {isCollapsed ? `- 1 reportee` : `+ 1 reportee`}
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  renderUserNode = () => {
    const { dataOrgChart, idCurrentUser = '' } = this.props;
    const { isCollapsedChild = false, itemSelected = '' } = this.state;

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
        {listEmployees.length === 0 ? null : (
          <div className={styles.node__bottom}>
            <div
              onClick={() => this.handleCollapse('user')}
              className={
                isCollapsedChild
                  ? styles.node__bottom_reporteesExpand
                  : styles.node__bottom_reporteesCollapse
              }
            >
              {isCollapsedChild
                ? `- ${listEmployees.length} reportees`
                : `+ ${listEmployees.length} reportees`}
            </div>
            {idUser === idCurrentUser ? <div className={styles.node__bottom_you}>You</div> : null}
          </div>
        )}
      </div>
    );
  };

  renderChildrenList = () => {
    const { dataOrgChart } = this.props;
    const { isCollapsedChild = false, itemSelected = '' } = this.state;
    const { employees: listEmployees = [] } = dataOrgChart;

    if (listEmployees.length === 0) return null;
    return (
      <Collapse isOpened={isCollapsedChild}>
        <div className={styles.nodesTree}>
          <div className={styles.lineNode}>
            <div style={{ margin: '0 auto', width: 'fit-content' }}>
              <img alt="lines" src={listEmployees.length > 2 ? bigLines : lines} />
            </div>
          </div>
          <div className={styles.childrenList}>
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
          </div>
        </div>
      </Collapse>
    );
  };

  render() {
    const { dataOrgChart } = this.props;
    const { isCollapsed } = this.state;
    const { manager = {} } = dataOrgChart;

    return (
      <div className={styles.orgChartRoot}>
        <div className={styles.charts}>
          {this.renderParentNode() /* Manager */}
          <Collapse isOpened={isCollapsed} hasNestedCollapse>
            {isEmpty(manager) ? null : (
              <div style={{ margin: '0 auto', width: 'fit-content' }}>
                <img alt="line" src={line} />
              </div>
            )}
            {this.renderUserNode() /* Current User */}
            {this.renderChildrenList() /* List Employees */}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default OrganizationChart;
