import { Card, DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

const ResignationRequestDetail = (props) => {
  const { item = {} } = props;
  const { createdAt = '', reason = '', LWD = '' } = item;

  return (
    <Card title="Resignation request detail" className={styles.ResignationRequestDetail}>
      <div className={styles.content}>
        <div className={styles.dateOfRequest}>
          <span className={styles.title}>Date of Request</span>
          <span className={styles.content}>
            {createdAt && moment(createdAt).format('MM/DD/YYYY')}
          </span>
        </div>

        <div className={styles.reason}>
          <span className={styles.title}>Reason for leaving us?</span>
          <p className={styles.reasonContent}>{reason}</p>
        </div>

        <div className={styles.lastWorkingDay}>
          <span className={styles.title}>Tentative Last Working Date (System generated)</span>
          <div className={styles.datePicker}>
            <DatePicker
              defaultValue={LWD ? moment(LWD) : null}
              format="MM/DD/YYYY"
              disabled
              placeholder="Tentative LWD"
            />
            <div className={styles.notice}>
              <span className={styles.noticeContent}>
                The LWD is generated as per a 90 days period according to our{' '}
                <span className={styles.link}>Standard Offboarding Policy</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResignationRequestDetail;
