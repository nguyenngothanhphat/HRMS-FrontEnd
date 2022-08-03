import { Avatar, Calendar, Spin, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import mockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const TeamLeaveCalendar = (props) => {
  const {
    selectedMonth = '',
    teamLeaveRequestList = [],
    dispatch,
    listTimeOffType = [],
    loadingFetch = false,
  } = props;
  const startOfMonth = moment(selectedMonth).startOf('month').format('MM/DD/YYYY');
  const endOfMonth = moment(selectedMonth).endOf('month').format('MM/DD/YYYY');
  useEffect(() => {
    // refresh data by month here
    if (!isEmpty(listTimeOffType)) {
      dispatch({
        type: 'dashboard/fetchTeamLeaveRequests',
        payload: {
          status: [TIMEOFF_STATUS.ACCEPTED],
          fromDate: startOfMonth,
          toDate: endOfMonth,
          type: listTimeOffType,
          page: 1,
          limit: 100,
          search: '',
        },
      });
    }
  }, [selectedMonth, listTimeOffType]);

  // FUNCTIONS
  const checkDate = (date, listDate) => {
    return (
      listDate.filter(
        (val) => moment(val.date).format('MM/DD/YYYY') === moment(date).format('MM/DD/YYYY'),
      ) || []
    );
  };
  const getLeaveRequestOfDate = (date) => {
    // return leaveRequest.find((l) => l.date === moment(date).format('MM/DD/YYYY'));
    const filterDateLeave = teamLeaveRequestList.map((obj) => {
      return {
        employeeInfo: obj.employee,
        duration: checkDate(date, obj.leaveDates),
      };
    });
    // return filterDateLeave.filter((obj) => obj.duration.timeOfDay !== undefined)
    return filterDateLeave.filter((obj) => obj.duration.length > 0);
  };

  const getDateDuration = (member) => {
    const duration = member?.duration[0]?.timeOfDay;
    switch (duration) {
      case 'WHOLE-DAY':
        return 'full day';
      case 'MORNING':
      case 'AFTERNOON':
        return `4hrs`;

      default:
        return '';
    }
  };

  // to prevent clicking on date of prev/next month to change month
  const disabledDate = (currentDate) => {
    return moment(currentDate).month() !== moment(selectedMonth).month();
  };

  // RENDER
  const renderTooltipTitle = (list) => {
    return (
      <div>
        {list.map((member) => (
          <span style={{ display: 'block' }}>
            {/* {member.name} ({getDateDuration(member.duration)}) */}
            {member.employeeInfo.generalInfo.firstName} {member.employeeInfo.generalInfo.lastName}{' '}
            {member ? `(${getDateDuration(member)})` : ''}
          </span>
        ))}
        {/* <span style={{ display: 'block' }}>
          {list.employeeInfo.generalInfo.firstName} ({list ? list.duration.timeOfDay : ''})
        </span> */}
      </div>
    );
  };

  const dateCellRender = (value) => {
    const find = getLeaveRequestOfDate(value);
    if (!find) return null;
    return (
      <Tooltip
        title={renderTooltipTitle(find)}
        placement="rightTop"
        getPopupContainer={(trigger) => {
          return trigger;
        }}
      >
        <div className={styles.projectMembers}>
          <Avatar.Group maxCount={4}>
            {find.map((member) => {
              return (
                <Avatar size="large" src={member.employeeInfo.generalInfo.avatar || mockAvatar} />
              );
            })}
            {/* <Avatar size='large' src={find.employeeInfo.generalInfo.avatar} /> */}
          </Avatar.Group>
        </div>
      </Tooltip>
    );
  };

  return (
    <Spin spinning={loadingFetch}>
      <Calendar
        className={styles.TeamLeaveCalendar}
        dateCellRender={dateCellRender}
        value={selectedMonth}
        disabledDate={disabledDate}
      />
    </Spin>
  );
};

export default connect(({ dashboard: { teamLeaveRequestList = [] } = {}, loading }) => ({
  teamLeaveRequestList,
  loadingFetch: loading.effects['dashboard/fetchTeamLeaveRequests'],
}))(TeamLeaveCalendar);
