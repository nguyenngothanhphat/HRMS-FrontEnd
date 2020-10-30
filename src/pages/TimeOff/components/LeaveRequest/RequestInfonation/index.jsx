import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col } from 'antd';
import warningNoteIcon from '@/assets/warning-icon.svg';
import styles from './index.less';

const { TextArea } = Input;

class RequestInfonation extends Component {
  onChange = () => {};

  render() {
    return (
      <Row className={styles.requestContent}>
        <Col className={styles.bodyContent}>
          <div className={styles.timeoffContent}>
            <div className={styles.titleText}>Timeoff Type</div>
            <Select className={styles.selectProject} />
          </div>
          <div>
            <div className={styles.titleText}>Project</div>
            <Select className={styles.selectProject} />
          </div>
          <div className={styles.duration}>
            <div lassName={styles.titleText}>Duration</div>
            <div className={styles.datetimeFlex}>
              <DatePicker className={styles.timePicker} />
              <DatePicker className={styles.timePicker} format="To  MM/DD" />
            </div>
          </div>
          <div className={styles.extraTime} />
          <div className={styles.Description}>
            <div className={styles.titleText}>Description</div>
            <TextArea className={styles.textArea} />
          </div>
          <div className={styles.titleText}>
            CC (only if you want to notify other than HR & your manager)
          </div>
          <Select className={styles.selectCC} />
          <div className={styles.btnFlex}>
            <Button className={styles.btnSave}>Save to draft</Button>
            <Button className={styles.btnSubmit}>Submit</Button>
          </div>
          <div style={{ padding: '10px' }}>
            <img src={warningNoteIcon} alt="warning-note-icon" />
            <span className={styles.notifications}>
              By default notifications will be sent to HR, the requestee and recursively loop to
              your department head.
            </span>
          </div>
        </Col>
      </Row>
    );
  }
}

export default RequestInfonation;
