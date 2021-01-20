import React, { PureComponent } from 'react';
import { history } from 'umi';
import AlertIcon from '@/assets/alertIcon.svg';
// import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

class RightContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderIcon = (url) => {
    return <img className={styles.avatar} src={url} alt="avatar" />;
  };

  viewEmployeeProfile = (_id) => {
    history.push({
      pathname: `/directory/employee-profile/${_id}`,
    });
  };

  render() {
    const {
      approvalManager: { _id = '', generalInfo: { firstName = '', lastName = '' } = {} } = {},
      // status = '',
    } = this.props;
    return (
      <div className={styles.RightContent}>
        <div className={styles.header}>
          <span className={styles.title}>Note</span>
          <span className={styles.description}>
            <p className={styles.text1}>Withdrawal of applications/requests</p>
            <p className={styles.text2}>
              You can withdraw this timeoff application till one day prior to the date applied for.
              The withdraw option will not be available after that.
            </p>
          </span>
        </div>
        {/* {status !== 'DRAFTS' && status !== 'IN-PROGRESS' && ( */}
        <div className={styles.underReview}>
          <div className={styles.cautionIcon}>
            <img src={AlertIcon} alt="alert" />
          </div>
          <div className={styles.description}>
            <span className={styles.text1}>Your request is under review by </span>
            <span onClick={() => this.viewEmployeeProfile(_id)} className={styles.reportingManager}>
              {firstName} {lastName}
            </span>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

export default RightContent;
