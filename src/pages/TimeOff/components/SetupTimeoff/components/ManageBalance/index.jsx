import React, { Component } from 'react';
import FileUploadIcon from '@/assets/dropImage.svg';
import icon from '@/assets/svgIcon.svg';
import { DatePicker, Button, Row, Col } from 'antd';
import styles from './index.less';

class ManageBalance extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.balance}>
        <div className={styles.balanceFrom}>
          <div className={styles.content}>Manage existing & future Timeoff employee balances</div>
          <div className={styles.strangt} />
          <div className={styles.flex}>
            <div className={styles.from}>
              <div className={styles.switchFrom}>
                <div className={styles.title}>Switch</div>
                <Row className={styles.flexFrom}>
                  <Col span={14} className={styles.subTitle}>
                    Keep current employee timeoff balances, but move them to new policies
                  </Col>
                  <Col span={10}>
                    <img src={icon} alt="" style={{ padding: '5px' }} />
                    <span>Download spreadsheet</span>
                  </Col>
                </Row>
                <div className={styles.fromDrop}>
                  <div style={{ marginTop: '36px' }}>
                    <img src={FileUploadIcon} alt="" />
                    <p>Drap and drop the file here</p>
                    <p>or</p>
                    <Button className={styles.chooseFile}>Choose file</Button>
                  </div>
                </div>
                <div className={styles.textPolicy}>
                  As per any assigned new policies, their accrual will begin on
                </div>
                <DatePicker className={styles.datePicker} />
              </div>
            </div>
            <div className={styles.from}>
              <div className={styles.switchFrom}>
                <div className={styles.title}>Import data</div>
                <Row className={styles.flexFrom}>
                  <Col span={14} className={styles.subTitle}>
                    Import new timeoff balances for employees.
                  </Col>
                  <Col span={10}>
                    <img src={icon} alt="" style={{ padding: '5px' }} />
                    <span>Download spreadsheet</span>
                  </Col>
                </Row>
                <div className={styles.fromDrop}>
                  <div style={{ marginTop: '36px' }}>
                    <img src={FileUploadIcon} alt="" />
                    <p>Drap and drop the file here</p>
                    <p>or</p>
                    <Button className={styles.chooseFile}>Choose file</Button>
                  </div>
                </div>
                <div className={styles.textPolicy}>
                  {' '}
                  As per any assigned new policies, their accrual will begin on
                </div>
                <DatePicker className={styles.datePicker} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageBalance;
