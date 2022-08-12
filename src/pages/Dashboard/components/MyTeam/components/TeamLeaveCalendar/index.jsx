import { Avatar, Calendar, Spin, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { TIMEOFF_STATUS } from '@/constants/timeOff';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import mockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import styles from './index.less';

const TeamLeaveCalendar = (props) => {
  const {
    selectedMonth = '',
    teamLeaveRequestList = [],
    dispatch,
    listTimeOffType = [],
    loadingFetch = false,
  } = props;
  const startOfMonth = moment(selectedMonth).startOf('month').format(DATE_FORMAT_MDY);
  const endOfMonth = moment(selectedMonth).endOf('month').format(DATE_FORMAT_MDY);
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
        (val) => moment(val.date).format(DATE_FORMAT_MDY) === moment(date).format(DATE_FORMAT_MDY),
      ) || []
    );
  };
  const getLeaveRequestOfDate = (date) => {
    // return leaveRequest.find((l) => l.date === moment(date).format(DATE_FORMAT_MDY));
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
        {list.map((member, i) => (
          <span style={{ display: 'block' }} key={`${i + 1}`}>
            {member.employeeInfo.generalInfo.firstName} {member.employeeInfo.generalInfo.lastName}{' '}
            {member ? `(${getDateDuration(member)})` : ''}
          </span>
        ))}
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
            {find.map((member, i) => {
              return (
                <Avatar
                  size="large"
                  src={
                    <img
                      src={member.employeeInfo?.generalInfo?.avatar || mockAvatar}
                      alt=""
                      onError={(e) => {
                        e.target.src = mockAvatar;
                      }}
                    />
                  }
                  style={{
                    backgroundColor: '#fff',
                  }}
                  key={`${i + 1}`}
                />
              );
            })}
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
