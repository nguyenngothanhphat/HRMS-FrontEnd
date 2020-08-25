import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

class TitleReport extends PureComponent {
  onChange = e => {
    const { getReportName = () => {} } = this.props;
    getReportName(e.target.value);
  };

  render() {
    const { reportName = '', reportTitle = '' } = this.props;
    return (
      <div className={styles.employee_report_name_edit}>
        <div className={styles.employee_report_name_input}>
          {formatMessage({ id: 'employee.new.page.name.input' })}
        </div>
        <Input
          required
          className={styles.employee_report_input_value}
          value={reportName}
          defaultValue={reportTitle}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default TitleReport;
