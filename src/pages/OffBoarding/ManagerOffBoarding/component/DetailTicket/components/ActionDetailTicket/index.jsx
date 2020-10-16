import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi';
import externalLinkIcon from '@/assets/external-link.svg';
import removeIcon from '@/assets/remove-off-boarding.svg';
import ClosingComments from './components/ClosingComments';
import ReasonPutOnHold from './components/ReasonPutOnHold';

import styles from './index.less';

class ActionDetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenSetMeeting: false,
      isOpenClosingComments: false,
      isDisplayBtnSetMeeting: true,
    };
  }

  setMeeting1on1 = () => {
    this.setState({
      isOpenSetMeeting: true,
      isDisplayBtnSetMeeting: false,
    });
  };

  startMeeting = () => {
    this.setState({
      isOpenClosingComments: true,
      isOpenSetMeeting: false,
    });
  };

  renderScheduleMeeting = () => {
    return (
      <div className={styles.actionDetailTicket__schedule}>
        <div className={styles.schedule__content}>
          <span className={styles.actionDetailTicket__title}>
            {formatMessage({ id: 'pages.offBoarding.1on1Meeting' })}
          </span>
          <div className={styles.actionDetailTicket__dateTime}>
            <span>
              {formatMessage({ id: 'pages.offBoarding.scheduledOn' })} : 22.05.20 &nbsp; | &nbsp;{' '}
              <span>12PM</span>
            </span>
            <span className={styles.icon__external__link}>
              <img src={externalLinkIcon} alt="external-link-icon" />
            </span>
            <span className={styles.icon__remove} onClick={this.removeScheduleMeeting}>
              <img src={removeIcon} alt="remove-icon" />
            </span>
          </div>
        </div>
        <div className={styles.schedule__link}>
          <span className={styles.schedule__link__text} onClick={this.startMeeting}>
            <u>Start meeting now !</u>
          </span>
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
      isDisplayBtnSetMeeting: true,
    });
  };

  render() {
    const { isOpenSetMeeting, isOpenClosingComments, isDisplayBtnSetMeeting } = this.state;
    const { handleDisplayNotifications, isOpenFormReason } = this.props;
    return (
      <div className={styles.actionDetailTicket}>
        {isDisplayBtnSetMeeting ? this.renderBtnSetMeeting() : ''}
        {isOpenSetMeeting && !isDisplayBtnSetMeeting ? this.renderScheduleMeeting() : ''}
        {isOpenClosingComments ? (
          <ClosingComments handleDisplayNotifications={handleDisplayNotifications} />
        ) : (
          ''
        )}
        {isOpenFormReason ? <ReasonPutOnHold /> : ''}
      </div>
    );
  }
}

export default ActionDetailTicket;
