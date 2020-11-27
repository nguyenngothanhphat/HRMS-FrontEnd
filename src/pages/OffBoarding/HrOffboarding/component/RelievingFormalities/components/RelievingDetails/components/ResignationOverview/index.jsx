import React, { PureComponent } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import styles from './index.less';

class ResignationOverview extends PureComponent {
  render() {
    const {
      relievingDetails: { lastWorkingDate = '', reasonForLeaving = '' },
    } = this.props;
    return (
      <div className={styles.resignationOverview}>
        <Card className={styles.resignationOverview__card} title="Resignation Overview">
          <p>Last working day</p>
          <p>
            {lastWorkingDate
              ? moment(lastWorkingDate).locale('en').format('DD.MM.YYYY')
              : 'No data'}
          </p>
          <p>Reson for leaving us?</p>
          <p>{reasonForLeaving}</p>
        </Card>
      </div>
    );
  }
}

export default ResignationOverview;
