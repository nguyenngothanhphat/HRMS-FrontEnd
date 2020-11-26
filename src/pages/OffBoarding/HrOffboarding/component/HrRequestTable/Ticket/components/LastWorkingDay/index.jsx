import React, { PureComponent } from 'react';
import moment from 'moment';
import { DatePicker, Button } from 'antd';
import Editicon from '@/assets/editIcon.svg';
import { connect } from 'umi';
import warningNoteIcon from '@/assets/warning-icon.svg';
import ModalNoticeSuccess from '../ModalNoticeSuccess';
import styles from './index.less';

@connect(({ loading, offboarding: { myRequest = {} } = {} }) => ({
  loading: loading.effects['offboarding/reviewRequest'],
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
    // const event = new Date(lastDay);
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
    const { list1On1 = [], lastWorkingDate, loading } = this.props;
    const check = list1On1.length > 0;
    const dateFormat = 'YYYY/MM/DD';
    let dateValue;
    if (lastDay) {
      dateValue = lastDay;
    } else if (lastWorkingDate) {
      dateValue = moment(lastWorkingDate).format('YYYY/MM/DD');
    } else {
      dateValue = null;
    }
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
              value={dateValue && moment(dateValue, dateFormat)}
              format={dateFormat}
              className={styles.datePicker}
              onChange={this.changeDate}
              disabledDate={this.disabledDate}
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
            <Button
              className={styles.btnSubmit}
              onClick={this.handleSubmit}
              loading={loading}
              disabled={!lastDay}
            >
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
