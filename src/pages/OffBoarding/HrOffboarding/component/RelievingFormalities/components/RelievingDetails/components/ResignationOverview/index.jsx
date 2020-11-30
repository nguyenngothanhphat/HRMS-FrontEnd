import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

class ResignationOverview extends PureComponent {
  render() {
    const {
      relievingDetails: { lastWorkingDate = '', reasonForLeaving = '' },
    } = this.props;
    return (
      <div className={styles.resignationOverview}>
        <Card
          className={styles.resignationOverview__card}
          title={formatMessage({ id: 'pages.relieving.resignation' })}
        >
          <p>{formatMessage({ id: 'pages.relieving.resignation.lastWorkingDay' })}</p>
          <p>
            {lastWorkingDate
              ? moment(lastWorkingDate).locale('en').format('DD.MM.YYYY')
              : 'No data'}
          </p>
          <p>{formatMessage({ id: 'pages.relieving.resignation.reason' })}</p>
          <p>{reasonForLeaving}</p>
        </Card>
      </div>
    );
  }
}

export default ResignationOverview;
