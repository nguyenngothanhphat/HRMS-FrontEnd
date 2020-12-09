import React, { PureComponent } from 'react';
import s from './index.less';

export default class index extends PureComponent {
  render() {
    const { status = '' } = this.props;
    const type = {
      'IN-PROGRESS': {
        color: '#2C6DF9',
        text: 'In-progress',
      },
      ACCEPTED: {
        color: '#006600',
        text: 'Accepted',
      },
      REJECTED: {
        color: '#ff0000',
        text: 'Rejected',
      },
      'ON-HOLD': {
        color: '#6600cc',
        text: 'On-hold',
      },
      DRAFT: {
        color: '#A9A9A9',
        text: 'Draft',
      },
      WITHDRAW: {
        color: '#ffa100',
        text: 'Withdraw',
      },
    };

    return (
      status && (
        <div className={s.root}>
          Status:
          <span className={s.dot} style={{ color: type[status].color }}>
            &#8226;
          </span>
          <span>{type[status].text}</span>
        </div>
      )
    );
  }
}
