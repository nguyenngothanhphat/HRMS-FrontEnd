import React, { PureComponent } from 'react';
import { DatePicker, Row, Col, Button } from 'antd';
import Editicon from '@/assets/editIcon.svg';
import warningNoteIcon from '@/assets/warning-icon.svg';
import ModalNoticeSuccess from '../ModalNoticeSuccess';
import styles from './index.less';

class LastWorkingDay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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

  render() {
    const { visible } = this.state;
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hours = date.getHours();
    const amOrPm = date.getHours() < 12 ? 'AM' : 'PM';
    const today = `${yyyy}.${mm}.${dd}`;
    return (
      <div className={styles.lastWorkDay}>
        <div className={styles.bettween}>
          <div className={styles.titleText}>Last working day</div>
          <div>
            <span className={styles.subText}>
              <span style={{ marginRight: '30px' }}>
                <img src={Editicon} alt="" className={styles.icon} />
                <span style={{ fontWeight: 'normal' }}> Edit</span>
              </span>
              {today} |
              <span style={{ fontWeight: 'normal' }}>
                {hours} {amOrPm}
              </span>
            </span>
          </div>
        </div>
        <Row className={styles.flex}>
          <Col span={8}>
            <DatePicker className={styles.datePicker} />
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
          <Button className={styles.btnCancel}>Cancel</Button>
          <Button className={styles.btnSubmit} onClick={this.handleOpenSchedule}>
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
