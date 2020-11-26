import React, { PureComponent } from 'react';
import moment from 'moment';
import { DatePicker, Row, Col, Button } from 'antd';
import Editicon from '@/assets/editIcon.svg';
import { connect } from 'umi';
import warningNoteIcon from '@/assets/warning-icon.svg';
import ModalNoticeSuccess from '../ModalNoticeSuccess';
import styles from './index.less';

@connect()
class LastWorkingDay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      lastday: '',
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
    const { lastday } = this.state;
    const { code, dispatch } = this.props;
    const time = lastday;

    dispatch({
      type: 'offboarding/reviewRequest',
      payload: {
        action: 'ACCEPTED',
        lastWorkingDate: time,
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
      lastday: '',
    });
  };

  changeDate = (date) => {
    const event = new Date(date);
    event.toDateString();
    this.setState({
      lastday: event,
    });
  };

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  render() {
    const { visible } = this.state;
    const { lastWorkingDate, list1On1 } = this.props;
    const check = list1On1.length >= 1;
    console.log(check);
    const day = '2020-11-28T10:06:20.476Z';

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
            {list1On1.length === 0 ? (
              <DatePicker format="DD-MM-YYYY" disabled className={styles.datePicker} />
            ) : (
              <DatePicker
                defaultValue={moment(day, 'DD-MM-YYYY')}
                format="DD-MM-YYYY"
                className={styles.datePicker}
                onChange={this.changeDate}
                disabledDate={this.disabledDate}
              />
            )}
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
          <Button className={styles.btnCancel} onClick={this.handleCancel}>
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
