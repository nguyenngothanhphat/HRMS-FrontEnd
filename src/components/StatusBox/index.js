import React, { PureComponent } from 'react';
import { Tag, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

export default class StatusBox extends PureComponent {
  render() {
    const { onClick } = this.props;
    let { color, status, icon } = this.props;
    // if (
    //   !color &&
    //   [...DEACTIVE_REIMBURSEMENT_STATUS, ...CLOSED_REIMBURSEMENT_STATUS].indexOf(status) === -1
    // ) {
    //   status = 'PENDING';
    //   color = `${blue.primary}`;
    // } else if (status === 'COMPLETE') color = `${green.primary}`;
    // else if (status === 'REJECT') color = `${red[5]}`;
    switch (status) {
      case 'INQUIRY':
        color = '#9013FE';
        icon = 'info-circle';
        break;
      case 'REJECT':
        color = '#D0021B';
        icon = 'close-circle';
        break;
      case 'COMPLETE':
        color = '#417505';
        icon = 'check-circle';
        break;
      case 'DRAFT':
        color = '#9B9B9B';
        icon = 'play-circle';
        break;
      case 'PAID':
        color = '#417505';
        icon = 'dollar-circle';
        break;
      default: {
        status = 'REPORTED';
        color = '#4A90E2';
        icon = 'clock-circle';
      }
    }

    return (
      <Tag className={styles.tag} color={color} onClick={onClick}>
        <Icon type={icon} className={styles.logo} theme="filled" />
        <FormattedMessage id={`reimbursement.status.${status.toLowerCase()}`} />
      </Tag>
    );
  }
}
