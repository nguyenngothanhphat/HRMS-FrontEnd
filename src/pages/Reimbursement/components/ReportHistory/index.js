import React, { PureComponent } from 'react';
import { Timeline, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { red, gold, green, cyan, blue, grey } from '@ant-design/colors';
import styles from './index.less';

@connect(({ reportHistory: { activities }, loading }) => ({
  activities,
  loading: loading.models.reportHistory,
  fetching: loading.effects['reportHistory/fetchItem'],
}))
class ReportHistory extends PureComponent {
  getReportAction = action => {
    const statusLabels = {
      approved: {
        color: green.primary,
        icon: 'check',
      },
      rejected: {
        color: red[5],
        icon: 'close',
      },
      commented: {
        color: gold.primary,
        icon: 'question',
      },
      updated: {
        color: blue.primary,
        icon: 'info',
      },
      assigned: {
        color: cyan.primary,
        icon: 'edit',
      },
      deleted: {
        color: grey.primary,
        icon: 'delete',
      },
      draft: {
        color: grey[3],
        icon: 'snippets',
      },
      created: {
        color: blue.primary,
        icon: 'plus',
      },
      submitted: {
        color: blue.primary,
        icon: 'to-top',
      },
    };
    const { color, icon } = statusLabels[action] || {};
    return { status: formatMessage({ id: `reimbursement.action.${action}` }), color, icon };
  };

  render() {
    const { activities } = this.props;

    return (
      <Timeline>
        {activities.map((activity, i) => {
          const {
            action = '',
            createdAt = '',
            performer: { email = '', fullName = '' } = {},
          } = activity;
          const { color, icon, status } = this.getReportAction(action);
          return (
            <Timeline.Item
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              dot={<Icon type={icon} style={{ fontSize: '16px', color }} />}
            >
              <span>{moment(createdAt).calendar()}</span>
              <p className={styles.margin0}>
                {`${fullName.trim() || email}`}
                {<span style={{ color }}>{` ${status} `}</span>}
                {formatMessage({ id: 'reimbursement.this-report' })}
              </p>
            </Timeline.Item>
          );
        })}
      </Timeline>
    );
  }
}

export default ReportHistory;
