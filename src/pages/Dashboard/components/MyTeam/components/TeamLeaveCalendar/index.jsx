import { Avatar, Calendar, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
// import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import moment from 'moment';
// import SampleAvatar1 from '@/assets/dashboard/sampleAvatar1.png';
// import SampleAvatar2 from '@/assets/dashboard/sampleAvatar2.png';
// import SampleAvatar3 from '@/assets/dashboard/sampleAvatar3.png';
// import SampleAvatar4 from '@/assets/dashboard/sampleAvatar4.png';
import mockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import styles from './index.less';

// const leaveRequest = [
//   {
//     date: '01/10/2022',
//     list: [
//       {
//         name: 'Tuan',
//         avatar: SampleAvatar1,
//         duration: 8,
//       },
//       {
//         name: 'Lewis',
//         avatar: SampleAvatar2,
//         duration: 4,
//       },
//       {
//         name: 'Nathan',
//         avatar: SampleAvatar4,
//         duration: 8,
//       },
//       {
//         name: 'Nathan',
//         avatar: SampleAvatar4,
//         duration: 8,
//       },
//       {
//         name: 'Nathan',
//         avatar: SampleAvatar4,
//         duration: 8,
//       },
//     ],
//   },
//   {
//     date: '01/11/2022',
//     list: [
//       {
//         name: 'Tuan',
//         avatar: SampleAvatar3,
//         duration: 8,
//       },
//       {
//         name: 'Lewis',
//         avatar: SampleAvatar2,
//         duration: 4,
//       },
//     ],
//   },
//   {
//     date: '01/15/2021',
//     list: [
//       {
//         name: 'Tuan',
//         avatar: SampleAvatar3,
//         duration: 8,
//       },
//     ],
//   },
// ];

const TeamLeaveCalendar = (props) => {
  const { selectedMonth = '', teamLeaveRequestList = [], dispatch, listTimeOffType = [] } = props;
  const startOfMonth = moment(selectedMonth).startOf('month').format('MM/DD/YYYY');
  const endOfMonth = moment(selectedMonth).endOf('month').format('MM/DD/YYYY');
  useEffect(() => {
    // refresh data by month here
    dispatch({
      type: 'dashboard/fetchTeamLeaveRequests',
      payload: {
        status: 'ACCEPTED',
        fromDate: startOfMonth,
        toDate: endOfMonth,
        type: listTimeOffType,
        page: 1,
        limit: 100,
        search: '',
      },
    });
  }, [selectedMonth]);

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
    <Calendar
      className={styles.TeamLeaveCalendar}
      dateCellRender={dateCellRender}
      value={selectedMonth}
      disabledDate={disabledDate}
    />
  );
};

export default connect(({ dashboard: { teamLeaveRequestList = [] } = {} }) => ({
  teamLeaveRequestList,
}))(TeamLeaveCalendar);
