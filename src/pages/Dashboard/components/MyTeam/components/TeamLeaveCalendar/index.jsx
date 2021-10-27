import { Avatar, Calendar, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'umi';
// import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import moment from 'moment';
import SampleAvatar1 from '@/assets/dashboard/sampleAvatar1.png';
import SampleAvatar2 from '@/assets/dashboard/sampleAvatar2.png';
import SampleAvatar3 from '@/assets/dashboard/sampleAvatar3.png';
import SampleAvatar4 from '@/assets/dashboard/sampleAvatar4.png';
import styles from './index.less';

const leaveRequest = [
  {
    date: '10/11/2021',
    list: [
      {
        name: 'Tuan',
        avatar: SampleAvatar1,
        duration: 8,
      },
      {
        name: 'Lewis',
        avatar: SampleAvatar2,
        duration: 4,
      },
      {
        name: 'Nathan',
        avatar: SampleAvatar4,
        duration: 8,
      },
      {
        name: 'Nathan',
        avatar: SampleAvatar4,
        duration: 8,
      },
      {
        name: 'Nathan',
        avatar: SampleAvatar4,
        duration: 8,
      },
    ],
  },
  {
    date: '10/05/2021',
    list: [
      {
        name: 'Tuan',
        avatar: SampleAvatar3,
        duration: 8,
      },
      {
        name: 'Lewis',
        avatar: SampleAvatar2,
        duration: 4,
      },
    ],
  },
  {
    date: '09/30/2021',
    list: [
      {
        name: 'Tuan',
        avatar: SampleAvatar3,
        duration: 8,
      },
    ],
  },
];

const TeamLeaveCalendar = (props) => {
  const { selectedMonth = '' } = props;

  // FUNCTIONS
  const getLeaveRequestOfDate = (date) => {
    return leaveRequest.find((l) => l.date === moment(date).format('MM/DD/YYYY'));
  };

  const getDateDuration = (duration) => {
    if (duration === 8) return 'full day';
    return `${duration}hrs`;
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
            {member.name} ({getDateDuration(member.duration)})
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
        title={renderTooltipTitle(find.list)}
        placement="rightTop"
        getPopupContainer={(trigger) => {
          return trigger;
        }}
      >
        <div className={styles.projectMembers}>
          <Avatar.Group maxCount={4}>
            {find.list.map((member) => {
              return <Avatar size="large" src={member.avatar} />;
            })}
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

export default connect(() => ({}))(TeamLeaveCalendar);
