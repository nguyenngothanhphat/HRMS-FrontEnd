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
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      lastDay: '',
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
    const { visible } = this.state;
    const { list1On1 = [], lastWorkingDate } = this.props;
    const check = list1On1.length > 0;
    const dateFormat = 'YYYY/MM/DD';
    // const { date } = this.props;
    return (
      <div className={styles.lastWorkDay}>
        <div className={styles.bettween}>
          <div className={styles.titleText}>Last working day</div>
          {lastWorkingDate && (
            <div>
              <span className={styles.subText}>
                <span style={{ marginRight: '30px' }}>
                  <img
                    src={Editicon}
                    alt=""
                    className={styles.icon}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'normal' }}> Edit</span>
                </span>
              </span>
            </div>
          )}
        </div>
        <Row className={styles.flex}>
          <Col span={8}>
            <DatePicker
              defaultValue={!lastWorkingDate ? null : moment(lastWorkingDate, dateFormat)}
              // defaultValue={moment(null, dateFormat)}
              format={dateFormat}
              className={styles.datePicker}
              onChange={this.changeDate}
              disabledDate={this.disabledDate}
            />
          </Col>
          <Col span={1} />
          <Col span={15} className={styles.detalFrom}>
            A last working date (LWD) is generated as per a 90 days notice period according to our
            Standard Resignation Policy
          </Col>
        </Row>
        <div className={styles.bettween}>
          <div>
            <img src={warningNoteIcon} alt="warning-note-icon" />
            <span className={styles.notifications}>
              By default notifications will be sent to HR, the requestee and recursively loop to
              your department head.
            </span>
          </div>
          <Button className={styles.btnCancel} onClick={this.handleCancel} disabled={!check}>
            Cancel
          </Button>
          <Button className={styles.btnSubmit} onClick={this.handleSubmit} disabled={!check}>
            Submit
          </Button>
        </div>
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
