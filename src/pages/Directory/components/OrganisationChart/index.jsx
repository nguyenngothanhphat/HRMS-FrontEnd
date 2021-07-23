import React, { Component } from 'react';
import { Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import { connect } from 'umi';
import moment from 'moment';
import OrganizationChart from '@dabeng/react-orgchart';
import DetailEmployeeChart from './components/EmployeeCard';
import styles from './index.less';

@connect(
  ({
    employee: { dataOrgChart = {}, listEmployeeAll = [] } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    user: {
      currentUser: { employee: { _id: myEmployeeId = '' } = {} } = {},
      companiesOfUser = [],
    } = {},
  }) => ({
    dataOrgChart,
    loading: loading.effects['employee/fetchDataOrgChart'],
    myEmployeeId,
    companiesOfUser,
    listLocationsByCompany,
    listEmployeeAll,
  }),
)
class OrganisationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idChart: '',
      chartDetails: {},
      timezoneList: [],
      currentTime: moment(),
    };
    this.myRef = React.createRef();
    this.userRef = React.createRef();
  }

  componentDidMount() {
    const { dispatch, companiesOfUser = [], listLocationsByCompany = [] } = this.props;
    const convertLocation = listLocationsByCompany.map((item) => {
      const { headQuarterAddress: { country: { _id = '' } = {}, state = '' } = {} } = item;
      return {
        country: _id,
        state: [state],
      };
    });
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { tenantId, company },
    }).then((response) => {
      const { statusCode, data = {} } = response;
      if (statusCode === 200) {
        this.getCurrentUser(data);
      }
    });
    dispatch({
      type: 'employee/fetchAllListUser',
      payload: { company: companiesOfUser, location: convertLocation },
    });
    this.fetchTimezone();
  }

  componentDidUpdate(prevProps) {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimezone();
    }
  }

  deepSearchCurrentUser = (data, myEmployeeId, key, sub) => {
    const newTempObj = {};
    const getCurrentUserItem = data.find((node) => {
      if (node[key]._id === myEmployeeId) {
        newTempObj.found = node;
        return newTempObj.found;
      }
      if (node[sub].length > 0) {
        // if cannot find the id, then continue to search the array sub-children (node[sub])
        return this.deepSearchCurrentUser(node[sub], myEmployeeId, key, sub);
      }
      return null;
    });
    return getCurrentUserItem;
  };

  getCurrentUser = (data) => {
    const { myEmployeeId = '' } = this.props;
    let check = false;

    if (data) {
      const newData = this.deepSearchCurrentUser(data.children, myEmployeeId, 'user', 'children');
      const { children = [] } = newData;
      children.forEach((item) => {
        if (item.user._id === myEmployeeId) {
          check = true;
        }
      });
      if (check) {
        this.myRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  };

  handleOnClick = (e) => {
    const getId = e.target.id;
    this.setState({ idChart: getId });
    const arrowDown = e.target.parentElement.parentElement.parentElement.lastElementChild;
    arrowDown.click();
  };

  getDetailUser = async (nodeData) => {
    const { user: { location } = {} } = nodeData;
    const { timezoneList, currentTime } = this.state;
    const findTimezone =
      timezoneList.find((timezone) => timezone.locationId === location._id) || {};
    const timeData = getCurrentTimeOfTimezone(currentTime, findTimezone.timezone);
    const addTimeData = { user: { ...nodeData.user, localTime: timeData } };

    // when click on this node will control the org chart move to the center of the screen.
    this.userRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    this.setState({ chartDetails: addTimeData });
  };

  closeDetailEmployee = () => {
    this.setState({ chartDetails: {} });
  };

  renderNode = ({ nodeData }) => {
    const { idChart } = this.state;
    const { myEmployeeId = '' } = this.props;
    const { user = {}, children = [] } = nodeData;
    const {
      _id = '',
      generalInfo: { avatar = '', firstName = '' } = {},
      department: { name = '' } = {},
      location: { name: nameLocation = '' } = {},
      // title: { name: title = '' } = {},
    } = user;
    const check = _id === myEmployeeId;

    return (
      <div
        className={styles.chartNode}
        style={check ? { border: '1px solid #00C598' } : {}}
        ref={this.userRef}
      >
        <div className={styles.chartAvt}>
          <Avatar src={avatar} size={64} icon={<UserOutlined />} />
        </div>
        <div className={styles.chartDetails}>
          <p className={styles.chartNode__textName}>{firstName}</p>
          {/* <div className={styles.chartNode__textInfo}>{title}</div> */}
          <div className={styles.chartNode__textInfo}>{name}</div>
          <div className={styles.chartNode__textInfo}>{nameLocation}</div>
        </div>
        <div className={styles.chartNode__subInfo} onClick={this.handleOnClick}>
          {children.length > 0 ? (
            <div
              id={_id}
              className={
                idChart === _id
                  ? styles.chartNode__subInfo__amountCollap
                  : styles.chartNode__subInfo__amount
              }
            >
              {`+${children.length} reportees`}
            </div>
          ) : (
            ''
          )}

          {check && (
            <div ref={this.myRef} className={styles.chartNode__subInfo__you}>
              You
            </div>
          )}
        </div>
      </div>
    );
  };

  handleSelect = (value) => {
    const { listEmployeeAll } = this.props;
    const { timezoneList, currentTime } = this.state;
    const getData = listEmployeeAll.filter((item) => item._id === value);
    const convertData = getData.map((item) => {
      const { _id, generalInfo, department, location } = item;
      const findTimezone =
        timezoneList.find((timezone) => timezone.locationId === location._id) || {};
      const timeData = getCurrentTimeOfTimezone(currentTime, findTimezone.timezone);
      return {
        _id,
        generalInfo,
        department,
        location,
        localTime: timeData,
      };
    });

    const convertFinal = { user: convertData[0] };
    this.setState({ chartDetails: convertFinal });
  };

  fetchTimezone = () => {
    const { listLocationsByCompany = [] } = this.props;
    const timezoneList = [];
    listLocationsByCompany.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    this.setState({
      timezoneList,
    });
  };

  render() {
    const { loading, dataOrgChart, listEmployeeAll, companiesOfUser = [] } = this.props;
    const { chartDetails } = this.state;
    return (
      <div className={styles.container}>
        {loading ? (
          <div className={styles.viewLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.orgChart}>
            <OrganizationChart
              datasource={dataOrgChart}
              NodeTemplate={this.renderNode}
              onClickNode={(node) => this.getDetailUser(node)}
              chartClass={styles.myChart}
              containerClass={styles.chartContainer}
              collapsible
              pan
              zoom
              zoominLimit={1}
              zoomoutLimit={0.2}
            />
            <div className={styles.orgChart__detailEmplChart}>
              <DetailEmployeeChart
                chartDetails={chartDetails}
                handleSelectSearch={this.handleSelect}
                listEmployeeAll={listEmployeeAll}
                closeDetailEmployee={this.closeDetailEmployee}
                companiesOfUser={companiesOfUser}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default OrganisationChart;
