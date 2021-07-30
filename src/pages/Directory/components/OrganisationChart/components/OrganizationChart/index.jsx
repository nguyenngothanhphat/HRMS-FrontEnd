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
import ManagerNode from './components/ManagerNode';
import UserNode from './components/UserNode';

@connect(({ employee: { dataOrgChart = {}, listEmployeeAll = [] } = {}, loading }) => ({
  dataOrgChart,
  loading: loading.effects['employee/fetchDataOrgChart'],
  loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
  listEmployeeAll,
}))
class OrganizationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      isCollapsedChild: true,
      itemSelected: '',
    };
    this.userRef = React.createRef();

    this.employeeRef = React.createRef([]); // list employees => to store employee refs.
    this.employeeRef.current = [];

    this.refTemp = React.createRef([]); // temp => to handle/set condition.
    this.refTemp.current = [];
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
    // auto focus on the node when select user
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

  handleScrollView = (userData, name) => {
    const { _id: userId = '' } = userData;
    const arrEmployeeRef = this.employeeRef.current;
    let userRef = [];

    switch (name) {
      case 'user':
        this.userRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
        break;
      case 'manager':
        console.log(name);
        break;
      default:
        userRef = arrEmployeeRef?.map((item) => (item.id === userId ? item.ref : null));
        userRef = userRef.filter((item) => item !== null);
        userRef = [...new Set(userRef)];

        if (userRef.length > 0) {
          userRef[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }
        break;
    }
  };

  clickCardInfo = (userData, name) => {
    const { handleClickNode = () => {} } = this.props;
    handleClickNode(userData);
    this.setState({ itemSelected: userData._id });
    this.handleScrollView(userData, name);
  };

  renderCardInfo = (userData, name) => {
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
      <div className={styles.node__card} onClick={() => this.clickCardInfo(userData, name)}>
        <Avatar className={styles.avatar} src={avatar} size={42} icon={<UserOutlined />} />
        <div className={styles.node__card__info}>
          <div className={styles.legalName}>{legalName}</div>
          <div className={styles.deptName}>{`${jobTitleName}, ${deptName}`}</div>
          <div className={styles.countryName}>{countryName}</div>
        </div>
      </div>
    );
  };

  renderManagerNode = () => {
    const { dataOrgChart: { manager = {} } = {} } = this.props;
    const { isCollapsed, itemSelected = '' } = this.state;
    const propsState = { itemSelected, isCollapsed };

    return (
      <>
        {isEmpty(manager) ? null : (
          <ManagerNode
            renderCardInfo={this.renderCardInfo}
            handleCollapse={this.handleCollapse}
            propsState={propsState}
            manager={manager}
          />
        )}
      </>
    );
  };

  renderUserNode = () => {
    const { dataOrgChart } = this.props;
    const { isCollapsedChild = false, itemSelected = '' } = this.state;

    const propsState = { itemSelected, isCollapsedChild };

    if (isEmpty(dataOrgChart)) return null;

    return (
      <UserNode
        renderCardInfo={this.renderCardInfo}
        handleCollapse={this.handleCollapse}
        propsState={propsState}
        dataOrgChart={dataOrgChart}
        userRef={this.userRef}
      />
    );
  };

  handleGetLine = (length) => {
    if (length === 1) return line;
    if (length > 2) return bigLines;
    return lines;
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
              <img alt="lines" src={this.handleGetLine(listEmployees.length)} />
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
                  employeeRef={this.employeeRef.current}
                  refTemp={this.refTemp.current}
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
          {this.renderManagerNode()}

          <Collapse isOpened={isCollapsed} hasNestedCollapse>
            {isEmpty(manager) ? null : (
              <div style={{ margin: '0 auto', width: 'fit-content' }}>
                <img alt="line" src={line} />
              </div>
            )}
            {this.renderUserNode()}
            {this.renderChildrenList()}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default OrganizationChart;
