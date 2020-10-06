import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import { Form, Radio } from 'antd';

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
    return radioList.map((radio) => {
      return (
        <Form.Item name={radio.name} label={radio.label}>
          <Radio.Group>
            <Radio value>{formatMessage({ id: 'component.employmentDetails.yes' })}</Radio>
            <Radio value={false}>{formatMessage({ id: 'component.employmentDetails.no' })}</Radio>
          </Radio.Group>
        </Form.Item>
      );
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
