import React, { PureComponent } from 'react';
import moment from 'moment';
import { DatePicker, Row, Col, Button } from 'antd';
import Editicon from '@/assets/editIcon.svg';
import { connect } from 'umi';
import warningNoteIcon from '@/assets/warning-icon.svg';
import ModalNoticeSuccess from '../ModalNoticeSuccess';
import styles from './index.less';

@connect(({ offboarding: { myRequest = {} } = {} }) => ({
  myRequest,
}))
class LastWorkingDay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      lastDay: '',
      edit: false,
    };
  }

  handleOpenSchedule = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  handleRemoveToServer = () => {
    const { handleRemoveToServer } = this.props;
    this.handleCandelSchedule();
    this.setState({}, () => handleRemoveToServer());
  };

  handleCandelSchedule = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = () => {
    const { lastDay } = this.state;
    const { code, dispatch } = this.props;
    dispatch({
      type: 'offboarding/reviewRequest',
      payload: {
        action: 'ACCEPTED',
        lastWorkingDate: lastDay,
        id: code,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.setState({
          visible: true,
          edit: true,
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      lastDay: '',
    });
  };
  openSubmit = () => {
    this.setState({
      edit: false,
    });
  };

  changeDate = (lastDay) => {
    // const event = new Date(date);
    // event.toDateString();
    this.setState({
      lastDay,
    });
  };

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  render() {
    const { visible, edit, lastDay } = this.state;
    const { list1On1 = [], lastWorkingDate } = this.props;
    console.log(edit);
    const check = list1On1.length > 0;
    const dateFormat = 'YYYY/MM/DD';
    // const { date } = this.props;
    return (
      <div className={styles.lastWorkDay}>
        <div className={styles.bettween}>
          <div className={styles.titleText}>Last working day</div>
          {lastWorkingDate && edit && (
            <div className={styles.edit} onClick={this.openSubmit}>
              <span className={styles.subText}>
                <span style={{ marginRight: '30px' }}>
                  <img src={Editicon} alt="" className={styles.icon} />
                  <span className={styles.editText}> Edit</span>
                </span>
                <span>{moment().format('DD.MM.YY | h:mm A')}</span>
              </span>
            </div>
          )}
        </div>
        <div className={styles.bettween}>
          <div className={styles.padding}>
            <DatePicker
              defaultValue={!lastWorkingDate ? null : moment(lastWorkingDate, dateFormat)}
              // defaultValue={moment(null, dateFormat)}
              format={dateFormat}
              className={styles.datePicker}
              onChange={this.changeDate}
              disabledDate={this.disabledDate}
              // disabled={!lastWorkingDate}
            />
          </div>
          <div className={styles.detalFrom}>
            A last working date (LWD) is generated as per a 90 days notice period according to our
            Standard Resignation Policy
          </div>
        </div>
        {!edit && (
          <div className={styles.flex}>
            <div className={styles.paddingRight}>
              <img src={warningNoteIcon} alt="warning-note-icon" />
              <span className={styles.notifications}>
                By default notifications will be sent to HR, the requestee and recursively loop to
                your department head.
              </span>
            </div>
            <div className={styles.paddingRight}>
              <Button className={styles.btnCancel} onClick={this.handleCancel} disabled={!check}>
                Cancel
              </Button>
            </div>
            <Button className={styles.btnSubmit} onClick={this.handleSubmit} disabled={!lastDay}>
              Submit
            </Button>
          </div>
        )}
        <ModalNoticeSuccess
          visible={visible}
          handleRemoveToServer={this.handleRemoveToServer}
          handleCancel={this.handleCandelSchedule}
          modalContent="Your acceptance of the request has been recorded and all parties will be notified"
        />
      </div>
    );
  }
}

export default LastWorkingDay;
