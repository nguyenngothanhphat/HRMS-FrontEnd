import React, { Component } from 'react';
import { Spin } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { getCurrentTimeOfTimezone, getTimezoneViaCity } from '@/utils/times';
import { connect } from 'umi';
import moment from 'moment';

import OrganizationChart from './components/OrganizationChart';
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
    loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
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
      // idChart: '',
      chartDetails: {},
      timezoneList: [],
      currentTime: moment(),
    };
    this.myRef = React.createRef();
    this.userRef = React.createRef([]);
    this.userRef.current = [];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { tenantId, company },
    });

    this.fetchAllListUser();
    this.fetchTimezone();
  }

  componentDidUpdate(prevProps) {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchAllListUser();
      this.fetchTimezone();
    }
  }

  fetchAllListUser = () => {
    const { listLocationsByCompany = [], companiesOfUser = [], dispatch } = this.props;

    const convertLocation = listLocationsByCompany.map((item) => {
      const { headQuarterAddress: { country: { _id = '' } = {}, state = '' } = {} } = item;
      return {
        country: _id,
        state: [state],
      };
    });
    dispatch({
      type: 'employee/fetchAllListUser',
      payload: { company: companiesOfUser, location: convertLocation },
    });
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

  // handleClickUserCard = async (nodeData) => {
  //   const { dataOrgChart = {} } = this.props;
  //   const { timezoneList, currentTime } = this.state;
  //   let check = false;

  //   const { user: { location } = {}, id: userId = '' } = nodeData;
  //   const arrRef = this.userRef.current;

  //   const newData = this.deepSearchCurrentUser(dataOrgChart.children, userId, 'user', 'children');
  //   const { children = [] } = newData || {};

  //   const findTimezone =
  //     timezoneList.find((timezone) => timezone.locationId === location._id) || {};
  //   const timeData = getCurrentTimeOfTimezone(currentTime, findTimezone.timezone);
  //   const addTimeData = { user: { ...nodeData.user, localTime: timeData } };

  //   // when click on this node will control the org chart move to the center of the screen.
  //   children.forEach((item) => {
  //     if (item.user._id === userId) {
  //       check = true;
  //     }
  //   });
  //   if (check) {
  //     this.handleFocusUserCard(arrRef, userId);
  //   }

  //   this.setState({ chartDetails: addTimeData });
  // };
  handleClickNode = async (nodeData) => {
    const { timezoneList, currentTime } = this.state;

    const { location = {} } = nodeData;

    const findTimezone =
      timezoneList.find((timezone) => timezone.locationId === location._id) || {};
    const timeData = getCurrentTimeOfTimezone(currentTime, findTimezone.timezone);
    const addTimeData = { ...nodeData, localTime: timeData };

    this.setState({ chartDetails: addTimeData });
  };

  closeDetailEmployee = () => {
    this.setState({ chartDetails: {} });
  };

  // addToRefs = (el, id) => {
  //   if (el && !this.userRef.current.includes(el)) {
  //     this.userRef.current.push({
  //       ref: el,
  //       id,
  //     });
  //   }

  //   return el;
  // };

  // handleFocusUserCard = (arrRef, userId) => {
  //   let arrTemp = arrRef?.map((item) => (item.id === userId ? item.ref : null));
  //   arrTemp = arrTemp.filter((item) => item !== null);
  //   arrTemp = [...new Set(arrTemp)];

  //   arrTemp[0].scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'center',
  //   });
  // };

  // renderNode = ({ nodeData }) => {
  //   const { idChart } = this.state;
  //   const { myEmployeeId = '' } = this.props;
  //   const { user = {}, children = [] } = nodeData;
  //   const {
  //     _id = '',
  //     generalInfo: { avatar = '', firstName = '' } = {},
  //     department: { name = '' } = {},
  //     location: { name: nameLocation = '' } = {},
  //     // title: { name: title = '' } = {},
  //   } = user;
  //   const check = _id === myEmployeeId;

  //   return (
  //     <div
  //       className={styles.chartNode}
  //       style={check ? { border: '1px solid #00C598' } : {}}
  //       ref={(el) => this.addToRefs(el, _id)}
  //     >
  //       <div className={styles.chartAvt}>
  //         <Avatar src={avatar} size={64} icon={<UserOutlined />} />
  //       </div>
  //       <div className={styles.chartDetails}>
  //         <p className={styles.chartNode__textName}>{firstName}</p>
  //         {/* <div className={styles.chartNode__textInfo}>{title}</div> */}
  //         <div className={styles.chartNode__textInfo}>{name}</div>
  //         <div className={styles.chartNode__textInfo}>{nameLocation}</div>
  //       </div>
  //       <div className={styles.chartNode__subInfo} onClick={this.handleOnClick}>
  //         {children.length > 0 ? (
  //           <div
  //             id={_id}
  //             className={
  //               idChart === _id
  //                 ? styles.chartNode__subInfo__amountCollap
  //                 : styles.chartNode__subInfo__amount
  //             }
  //           >
  //             {`+${children.length} reportees`}
  //           </div>
  //         ) : (
  //           ''
  //         )}

  //         {check && (
  //           <div ref={this.myRef} className={styles.chartNode__subInfo__you}>
  //             You
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

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

    const convertFinal = { ...convertData[0] };
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
    const {
      loading,
      // dataOrgChart,
      listEmployeeAll,
      loadingFetchListAll,
      companiesOfUser = [],
    } = this.props;
    const { chartDetails } = this.state;
    return (
      <div className={styles.container}>
        {loading ? (
          <div className={styles.viewLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.orgChart}>
            <OrganizationChart handleClickNode={this.handleClickNode} />
            <div className={styles.orgChart__detailEmplChart}>
              <DetailEmployeeChart
                chartDetails={chartDetails}
                handleSelectSearch={this.handleSelect}
                listEmployeeAll={listEmployeeAll}
                loadingFetchListAll={loadingFetchListAll}
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
