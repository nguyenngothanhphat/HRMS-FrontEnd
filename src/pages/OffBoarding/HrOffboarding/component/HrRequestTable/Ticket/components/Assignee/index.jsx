import Avatar from 'antd/lib/avatar/avatar';
import React, { PureComponent } from 'react';
import styles from './index.less';

const AssigneeDetail = ({ avatar = '', name = '', jobTitle = '', priority = 'Primary' }) => {
  return (
    <div className={styles.assignee__item}>
      <div className={styles.assignee__item__info}>
        <Avatar size={36} src={avatar} />
        <div
          style={{
            marginLeft: '15px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div className={styles.assignee__item__info__name}>{name}</div>
          <div className={styles.assignee__item__info__job}>{jobTitle}</div>
        </div>
      </div>
      <div className={styles.assign__item__priority}>{priority}</div>
    </div>
  );
};

export default class Assignee extends PureComponent {
  render() {
    return (
      <div className={styles.assignee}>
        <div className={styles.assignee__header}>This request is assigned to:</div>
        <div className={styles.assignee__content}>
          <div className={styles.assignee__title}>Manager approval</div>
          <AssigneeDetail
            jobTitle="UX Lead"
            name="Aditya venkatesan"
            avatar="https://via.placeholder.com/150"
            priority="Primary"
          />
          <AssigneeDetail
            jobTitle="UX Lead"
            name="Aditya venkatesan"
            avatar="https://via.placeholder.com/150"
            priority="Secondary"
          />
        </div>
        <div className={styles.assignee__content}>
          <div className={styles.assignee__title}>HR approval</div>
          <AssigneeDetail
            jobTitle="UX Lead"
            name="Aditya venkatesan"
            avatar="https://via.placeholder.com/150"
            priority="Primary"
          />
        </div>
        <div className={styles.assignee__content}>
          <div>
            In case of your unavailability, you may assign this request to someone from the superior
            officers.
          </div>
          <button type="button" className={styles.assignee__content__buttonRequest}>
            Delegate this request
          </button>
        </div>
      </div>
    );
  }
}
