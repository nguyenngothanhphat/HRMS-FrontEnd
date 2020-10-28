import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import { Form, Radio, Input } from 'antd';
import Option from '../Option';

import styles from './index.less';

class EmploymentDetails extends PureComponent {
  _renderRadio = () => {
    const radioList = [
      {
        label: 'Employment type ',
        name: 'employmentType ',
      },
      {
        label: 'Include bonus section details',
        name: 'bonusSection',
      },
      {
        label: 'Include commission details',
        name: 'commission',
      },
      {
        label: 'Include option for stocks granted',
        name: 'stockGranted',
      },
      {
        label: 'Employment type ',
        name: 'employmentType2 ',
      },
    ];
    const { settings } = this.props;
    return settings.map((option) => {
      return <Option settingsList={settings} option={option} />;
    });
  };

  onFinish = (values) => {
    console.log('Success:', values);
  };

  render() {
    return (
      <div className={styles.EmploymentDetails}>
        {' '}
        <Form name="validate_other">{this._renderRadio}</Form>
      </div>
    );
  }
}

export default EmploymentDetails;
