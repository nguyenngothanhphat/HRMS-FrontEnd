import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { NavLink } from 'umi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import ClosingComments from './components/ClosingComments';
import styles from './index.less';

class ActionDetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenSetMeeting: false,
    };
  }

  setMeeting1on1 = () => {
    this.setState({
      isOpenSetMeeting: true,
    });
  };

  renderScheduleMeeting = () => {
    return (
      <div className={styles.actionDetailTicket__schedule}>
        <div className={styles.schedule__content}>
          <span className={styles.actionDetailTicket__title}>1-on-1 meeting</span>
          <div className={styles.actionDetailTicket__dateTime}>
            <span>
              Scheduled on : 22.05.20 &nbsp; | &nbsp; <span>12PM</span>
            </span>
            <span className={styles.icon__external__link}>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </span>
            <span className={styles.icon__remove} onClick={this.removeScheduleMeeting}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
        </div>
        <div className={styles.schedule__link}>
          <NavLink to="">
            <u>Start meeting now !</u>
          </NavLink>
        </div>
      </div>
    );
  };

  renderBtnSetMeeting = () => {
    return (
      <div className={styles.actionDetailTicket__btn}>
        <Button className={styles.btn__setMeeting} onClick={this.setMeeting1on1}>
          Set 1-on-1 with Venkat
        </Button>
      </div>
    );
  };

  removeScheduleMeeting = () => {
    this.setState({
      isOpenSetMeeting: false,
    });
  };

  render() {
    const { isOpenSetMeeting } = this.state;
    return (
      <div className={styles.actionDetailTicket}>
        {isOpenSetMeeting ? this.renderScheduleMeeting() : this.renderBtnSetMeeting()}
        <ClosingComments />
      </div>
    );
  }
}

export default ActionDetailTicket;
