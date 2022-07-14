import { Button } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';

export default class ApplyRequest extends PureComponent {
  render() {
    const {
      title = '',
      // describe = '',
      type = 2,
      buttonText = 'Button',
      onClick = {},
      onBehalfOf = () => {},
      viewRequestOnBehalfOf = false,
    } = this.props;
    return (
      <div
        className={
          type === 1 ? styles.ApplyRequest__hasBackground : styles.ApplyRequest__noBackground
        }
      >
        <div className={styles.abovePart}>
          <span className={styles.title}>{title}</span>
          <div className={type === 1 ? styles.describe1 : styles.describe}>
            <p>
              {buttonText === 'Request Time Off'
                ? 'Apply for leaves with/without pay, work from home or client office.'
                : 'Request for a compensation leave if you have worked for extra days/hours.'}
            </p>
          </div>
        </div>
        <div className={styles.button}>
          <Button className="" onClick={onClick}>
            {buttonText}
          </Button>
          {viewRequestOnBehalfOf && (
            <div className={styles.btnBehalfOf}>
              <Button onClick={onBehalfOf}> Request On Behalf Of</Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
