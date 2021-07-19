import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import Avatar from 'antd/lib/avatar/avatar';
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
    const {
      myRequest: {
        manager: {
          generalInfo: { firstName = '', lastName = '', avatar = '' } = {},
          title: { name: managerTitleName = 'Unknown' } = {},
        } = {},
        assigneeHR = {},
      } = {},
      hrManager: {
        // _id: hrManagerId = '',
        employee: {
          generalInfo: {
            firstName: fnHRManager = '',
            lastName: lnHRManager = '',
            // workEmail ='',
            avatar: avatarHRManager = '',
          } = {},
          title: { name: titleHRManager = 'HR Manager' } = {},
        } = {},
      } = {},
    } = this.props;

    const {
      generalInfo: { firstName: fnHR = '', lastName: lnHR = '', avatar: avatarHR = '' } = {},
      title: { name: titleHR = 'HR' } = {},
    } = assigneeHR;

    return (
      <div className={styles.assignee}>
        <div className={styles.assignee__header}>This request is assigned to:</div>
        <div className={styles.assignee__content}>
          <div className={styles.assignee__title}>Manager approval</div>
          <AssigneeDetail
            jobTitle={managerTitleName}
            name={`${firstName} ${lastName}`}
            avatar={avatar}
            priority="Primary"
          />
        </div>
        <div className={styles.assignee__content}>
          <div className={styles.assignee__title}>HR approval</div>
          {!isEmpty(assigneeHR) ? (
            <AssigneeDetail
              jobTitle={titleHR}
              name={`${fnHR} ${lnHR}`}
              avatar={avatarHR}
              priority="Primary"
            />
          ) : (
            <AssigneeDetail
              jobTitle={titleHRManager}
              name={`${fnHRManager} ${lnHRManager}`}
              avatar={avatarHRManager}
              priority="Primary"
            />
          )}
        </div>
        {/* <div className={styles.assignee__content}>
          <div>
            In case of your unavailability, you may assign this request to someone from the superior
            officers.
          </div>
          <button type="button" className={styles.assignee__content__buttonRequest}>
            Delegate this request
          </button>
        </div> */}
      </div>
    );
  }
}
