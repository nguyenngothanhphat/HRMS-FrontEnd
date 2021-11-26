import React from 'react';
import { connect } from 'umi';
import { Row, Col, Tooltip, Avatar } from 'antd';
import SampleAvatar1 from '@/assets/dashboard/sampleAvatar1.png';
import SampleAvatar2 from '@/assets/dashboard/sampleAvatar2.png';
import SampleAvatar3 from '@/assets/dashboard/sampleAvatar3.png';
import styles from './index.less';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';

const members = [
  {
    name: 'Lewis',
    avatar: SampleAvatar1,
  },
  {
    name: 'Trung',
    avatar: SampleAvatar2,
  },
  {
    name: 'Anh',
    avatar: SampleAvatar3,
  },
];

const Information = (props) => {
  const { projectName = 'Cisco' } = props;

  const renderTooltipTitle = (list) => {
    return (
      <div>
        {list.map((member) => (
          <span style={{ display: 'block' }}>{member.name}</span>
        ))}
      </div>
    );
  };

  const items = [
    {
      name: 'Project Name',
      value: (
        <div className={styles.renderProject}>
          <div className={styles.avatar}>
            <div className={styles.icon}>
              <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
            </div>
          </div>
          <div className={styles.right}>
            <span className={styles.name}>{projectName}</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Total Days',
      value: <span className={styles.boldText}>20</span>,
    },
    {
      name: 'Resources',
      value: (
        <Tooltip
          title={renderTooltipTitle(members)}
          placement="rightTop"
          getPopupContainer={(trigger) => {
            return trigger;
          }}
        >
          <div className={styles.taskMembers}>
            <Avatar.Group maxCount={4}>
              {members.map((member) => {
                return <Avatar size="small" src={member.avatar} />;
              })}
            </Avatar.Group>
          </div>
        </Tooltip>
      ),
    },
    {
      name: 'Project Type',
      value: 'Proof of Concept',
    },
    {
      name: 'Total Hours',
      value: <span className={styles.boldText}>600 Hours</span>,
    },
    {
      name: 'Payment Due Date',
      value: (
        <div className={styles.dueDate}>
          <img className={styles.calendarIcon} src={CalendarIcon} alt="" />
          <span>14 July 2021</span>
        </div>
      ),
    },
  ];
  return (
    <div className={styles.Information}>
      <Row gutter={[0, 12]}>
        {items.map((i) => {
          return (
            <Col span={8} className={styles.eachItem}>
              <span className={styles.label}>{i.name}:</span>
              <span className={styles.value}>{i.value}</span>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

// export default DateSwitcher;
export default connect(() => ({}))(Information);
