import React, { Component } from 'react';
import { getCurrentTimeOfTimezoneOption, getTimezoneViaCity } from '@/utils/times';
import { connect } from 'umi';
import moment from 'moment';

import { isEmpty, isEqual } from 'lodash';
import { getCurrentTenant } from '@/utils/authority';
import OrganizationChart from './components/OrganizationChart';
import DetailEmployeeChart from './components/EmployeeBox';
import styles from './index.less';

@connect(
  ({
    employee: { dataOrgChart = {}, listEmployeeAll = [] } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    user: {
      currentUser: { employee: { _id: myEmployeeId = '' } = {}, employee = {} } = {},
      companiesOfUser = [],
    } = {},
  }) => ({
    dataOrgChart,
    loading: loading.effects['employee/fetchDataOrgChart'],
    loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
    myEmployeeId,
    companiesOfUser,
    listLocationsByCompany,
    listEmployeeAll,
    employee,
  }),
)
class OrganisationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSelect: '',
      chartDetails: {},
      timezoneList: [],
      currentTime: moment(),
      currentDate: new Date(),
      status: 0,
    };
    this.myRef = React.createRef();
    this.userRef = React.createRef([]);
    this.userRef.current = [];
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeProfile/fetchEmployeeTypes',
      payload: { tenantId: getCurrentTenant() },
    });

    this.fetchAllListUser().then((status) => {
      if (status === 200) {
        this.fetchDataOrgChart();
      }
    });

    this.fetchTimezone();

    // sync date
    this.syncDateTime = setInterval(() => this.syncDate(), 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { listLocationsByCompany = [], companiesOfUser = [] } = this.props;
    const { status, currentDate, currentTime } = this.state;
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany) ||
      JSON.stringify(prevProps.companiesOfUser) !== JSON.stringify(companiesOfUser)
    ) {
      this.fetchAllListUser();
      this.fetchTimezone();
    }

    if (prevState.status !== status) {
      this.fetchDataOrgChart();
    }

    if (
      JSON.stringify(prevState.currentDate.toLocaleTimeString()) !==
      JSON.stringify(currentDate.toLocaleTimeString())
    ) {
      // [1] syncDateTime() always updates base on currentDate changing => call syncCurrentTime()
      this.syncCurrentTime();
    }

    if (JSON.stringify(prevState.currentTime) !== JSON.stringify(currentTime)) {
      // [2] currentTime state changed, then update data
      this.initSyncDataInformation(currentTime);
    }
  }

  componentWillUnmount() {
    clearInterval(this.syncDateTime);
  }

  syncDate = () => {
    this.setState({
      currentDate: new Date(),
    });
  };

  syncCurrentTime = () => {
    this.setState({
      currentTime: moment(),
    });
  };

  initSyncDataInformation = (currentTime) => {
    const { chartDetails } = this.state;
    const getCurrentUserdata = this.getDataCurrentUser(currentTime);
    if (isEqual(chartDetails, getCurrentUserdata)) {
      this.setState({ chartDetails: getCurrentUserdata });
    } else {
      this.syncDataInformation(currentTime, chartDetails);
    }
  };

  syncDataInformation = (currentTime, chartDetails) => {
    const { timezoneList } = this.state;
    const { location = {} } = chartDetails;

    if (!isEmpty(location)) {
      const findTimezone =
        timezoneList.find((timezone) => timezone.locationId === location._id) || {};
      const timeData = getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone);

      const newChartDetails = { ...chartDetails, localTime: timeData };
      this.setState({ chartDetails: newChartDetails });
    }
  };

  fetchDataOrgChart = () => {
    const { dispatch, myEmployeeId = '' } = this.props;
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { employee: myEmployeeId },
    }).then((response) => {
      const { statusCode, data: dataOrgChart = {} } = response;
      if (statusCode === 200) this.getInitUserInformation(dataOrgChart);
    });
  };

  getDataCurrentUser = (currentTime) => {
    const { timezoneList } = this.state;
    const {
      employee: { _id = '', title = {}, department = {}, generalInfo = {}, location = {} } = {},
    } = this.props;

    const findTimezone =
      timezoneList.find((timezone) => timezone.locationId === location._id) || {};
    const timeData = getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone);

    return {
      _id,
      generalInfo,
      department,
      title,
      location,
      localTime: timeData,
    };
  };

  getInitUserInformation = (data) => {
    const { listEmployeeAll } = this.props;
    const { timezoneList, currentTime } = this.state;

    const { user: { _id: userId = '' } = {} } = data;
    const getData = listEmployeeAll.filter((item) => item._id === userId);

    if (getData.length === 0) {
      const { employee: { _id: currentUserId = '' } = {} } = this.props;
      const getCurrentUserdata = this.getDataCurrentUser(currentTime);

      this.setState({ idSelect: currentUserId });
      this.setState({ chartDetails: getCurrentUserdata });
    } else {
      const convertData = getData.map((item) => {
        const { _id, generalInfo, department, location, title } = item;
        const findTimezone =
          timezoneList.find((timezone) => timezone.locationId === location._id) || {};
        const timeData = getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone);
        return {
          _id,
          generalInfo,
          department,
          title,
          location,
          localTime: timeData,
        };
      });

      const convertFinal = { ...convertData[0] };
      this.setState({ idSelect: userId });
      this.setState({ chartDetails: convertFinal });
    }
  };

  fetchAllListUser = async (name = '') => {
    let _status = 0;
    const { listLocationsByCompany = [], companiesOfUser = [], dispatch } = this.props;

    const convertLocation = listLocationsByCompany.map((item) => {
      const { headQuarterAddress: { country: { _id = '' } = {}, state = '' } = {} } = item;
      return {
        country: _id,
        state: [state],
      };
    });

    await dispatch({
      type: 'employee/fetchAllListUser',
      payload: { company: companiesOfUser, location: convertLocation, limit: 10, page: 1, name },
    }).then((response) => {
      const { statusCode = 0 } = response;
      if (statusCode === 200) {
        _status = statusCode;
        this.setState({ status: statusCode });
      }
    });

    return _status;
  };

  // deepSearchCurrentUser = (data, myEmployeeId, key, sub) => {
  //   const newTempObj = {};
  //   const getCurrentUserItem = data.find((node) => {
  //     if (node[key]._id === myEmployeeId) {
  //       newTempObj.found = node;
  //       return newTempObj.found;
  //     }
  //     if (node[sub].length > 0) {
  //       // if cannot find the id, then continue to search the array sub-children (node[sub])
  //       return this.deepSearchCurrentUser(node[sub], myEmployeeId, key, sub);
  //     }
  //     return null;
  //   });
  //   return getCurrentUserItem;
  // };

  // getCurrentUser = (data) => {
  //   const { myEmployeeId = '' } = this.props;
  //   let check = false;

  //   if (data) {
  //     const newData = this.deepSearchCurrentUser(data.children, myEmployeeId, 'user', 'children');
  //     const { children = [] } = newData || {};
  //     children.forEach((item) => {
  //       if (item.user._id === myEmployeeId) {
  //         check = true;
  //       }
  //     });
  //     if (check) {
  //       this.myRef.current.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center',
  //         inline: 'center',
  //       });
  //     }
  //   }
  // };

  handleClickNode = async (nodeData) => {
    const { dispatch } = this.props;
    const { timezoneList } = this.state;
    const currentTime = moment();

    const { location = {}, _id = '' } = nodeData;
    if (!isEmpty(location)) {
      const findTimezone =
        timezoneList.find((timezone) => timezone.locationId === location._id) || {};
      const timeData = getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone);

      const addTimeData = { ...nodeData, localTime: timeData };

      dispatch({
        type: 'employee/fetchDataOrgChart',
        payload: { employee: _id },
      });

      this.setState({ chartDetails: addTimeData });
    }
  };

  closeDetailEmployee = () => {
    this.setState({ chartDetails: {} });
  };

  handleSelect = (value) => {
    // const { listEmployeeAll } = this.props;
    // const { timezoneList, currentTime } = this.state;
    // const getData = listEmployeeAll.filter((item) => item._id === value);
    // const convertData = getData.map((item) => {
    //   const { _id, generalInfo, department, location, title } = item;
    //   const findTimezone =
    //     timezoneList.find((timezone) => timezone.locationId === location._id) || {};
    //   const timeData = getCurrentTimeOfTimezoneOption(currentTime, findTimezone.timezone);
    //   return {
    //     _id,
    //     generalInfo,
    //     department,
    //     title,
    //     location,
    //     localTime: timeData,
    //   };
    // });
    // const convertFinal = { ...convertData[0] };
    // this.setState({ chartDetails: convertFinal });

    /** AFTER SEARCHING USER, THE CODE ABOVE IS TO SHOW SEARCH BOX INFORMATION  */

    this.setState({ idSelect: value });
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
    const { chartDetails, idSelect } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.orgChart}>
          <OrganizationChart idSelect={idSelect} handleClickNode={this.handleClickNode} />
          <div className={styles.orgChart__detailEmplChart}>
            <DetailEmployeeChart
              chartDetails={chartDetails}
              handleSelectSearch={this.handleSelect}
              fetchAllListUser={this.fetchAllListUser}
              closeDetailEmployee={this.closeDetailEmployee}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OrganisationChart;
