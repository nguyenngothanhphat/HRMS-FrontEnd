import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col } from 'antd';
import warningNoteIcon from '@/assets/warning-icon.svg';
import styles from './index.less';

const { TextArea } = Input;

class LeftMenu extends Component {
  onChange = () => {};

  render() {
    const options = [
      { value: 'gold', data: 'muti' },
      { value: 'lime', data: 'ac' },
      { value: 'green', data: 'bd' },
    ];

    return (
      <Row className={styles.content}>
        <Col className={styles.bodyContent}>
          <div className={styles.projectContent}>
            <div className={styles.titleText}>Project</div>
            <Select className={styles.selectProject}>
              {options.map((item) => (
                <Select.Option value={item.data}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{item.value}</div>
                    <div>{item.data}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.duration}>
            <div lassName={styles.titleText}>Duration</div>
            <div className={styles.datetimeFlex}>
              <DatePicker className={styles.timePicker} />
              <DatePicker className={styles.timePicker} />
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

export default LeftMenu;
