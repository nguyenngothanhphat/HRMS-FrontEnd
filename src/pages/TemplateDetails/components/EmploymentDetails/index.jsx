import React, { PureComponent } from 'react';
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
            <Radio value>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>
      );
    });
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
