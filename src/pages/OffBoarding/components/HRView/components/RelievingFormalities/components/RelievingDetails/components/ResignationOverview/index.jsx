import React, { PureComponent } from 'react';
import { Card, Checkbox } from 'antd';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

class ResignationOverview extends PureComponent {
  onCheckBox = (value) => {
    // console.log(value);
  };

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
          <p className={styles.text}>
            {formatMessage({ id: 'pages.relieving.resignation.lastWorkingDay' })}
            <span className={styles.resignationOverview__card__lwd}>
              {lastWorkingDate
                ? moment(lastWorkingDate).locale('en').format('MM.DD.YY')
                : 'No data'}
            </span>
          </p>
          <p className={styles.text}>
            {formatMessage({ id: 'pages.relieving.resignation.reason' })}
          </p>
          <p className={styles.textValue}>{reasonForLeaving}</p>
          <div>
            <Checkbox disabled checked onChange={this.onCheckBox}>
              Can be rehired
            </Checkbox>
          </div>
        </Card>
      </div>
    );
  }
}

export default ResignationOverview;
