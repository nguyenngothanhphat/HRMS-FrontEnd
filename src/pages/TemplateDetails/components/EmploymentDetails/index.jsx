import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import { Form, Button } from 'antd';
import Option from '../Option';

import styles from './index.less';

class EmploymentDetails extends PureComponent {
  onNext = () => {
    const { onNext = {} } = this.props;
    onNext();
  };

  _renderRadio = () => {
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
        <Button onClick={this.onNext} type="primary">
          {formatMessage({ id: 'component.editForm.next' })}
        </Button>
      </div>
    );
  }
}

export default EmploymentDetails;
