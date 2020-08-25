import React, { PureComponent } from 'react';
import { Breadcrumb, Icon } from 'antd';
import router from 'umi/router';

import styles from './index.less';

class ReportBreadcrumb extends PureComponent {
  render() {
    const {
      title = '',
      isViewReportInTeamReport = false,
      isViewReportInPayment = false,
    } = this.props;
    return (
      <Breadcrumb separator="">
        <Breadcrumb.Item>
          <Icon
            className={styles.employee_report_new_back}
            type="left"
            onClick={() => {
              if (isViewReportInTeamReport) {
                router.push('/teamreport');
              }
              if (isViewReportInPayment) {
                router.push('/payment');
              } else if (window) {
                window.history.go(-1);
              }
            }}
          />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span
            className={styles.employee_report_new_breadcrumb}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (isViewReportInTeamReport) {
                router.push('/teamreport');
              } else if (window) {
                window.history.go(-1);
              }
            }}
          >
            {title}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>
    );
  }
}

export default ReportBreadcrumb;
