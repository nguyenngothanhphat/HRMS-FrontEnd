import React from 'react';
import { connect } from 'umi';
import { Row, Col, Tooltip, Avatar } from 'antd';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';

const Information = (props) => {
  const {
    data: { projectName = '', projectSpentInHours = 0, projectSpentInDay = 0, resource = [] } = {},
  } = props;

  const renderTooltipTitle = (list) => {
    return (
      <div>
        {list.map((member) => (
          <span style={{ display: 'block' }}>{member.employee?.legalName}</span>
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
      value: <span className={styles.boldText}>{projectSpentInDay}</span>,
    },
    {
      name: 'Resources',
      value: (
        <Tooltip
          title={renderTooltipTitle(resource)}
          placement="rightTop"
          getPopupContainer={(trigger) => {
            return trigger;
          }}
        >
          <div className={styles.taskMembers}>
            <Avatar.Group maxCount={4}>
              {resource.map((member = {}) => {
                const { employee: { avatar = '' } = {} } = member;
                return <Avatar size="small" src={avatar || MockAvatar} />;
              })}
            </Avatar.Group>
          </div>
        </Tooltip>
      ),
    },
    {
      name: 'Project Type',
      value: '',
    },
    {
      name: 'Total Hours',
      value: <span className={styles.boldText}>{projectSpentInHours} Hours</span>,
    },
    {
      name: 'Payment Due Date',
      value: (
        <div className={styles.dueDate}>
          <img className={styles.calendarIcon} src={CalendarIcon} alt="" />
          <span />
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
