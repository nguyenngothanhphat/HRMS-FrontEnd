import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import { Form, Button } from 'antd';
import Option from '../Option';

import styles from './index.less';

@connect(
  ({
    employeeSetting: {
      isAbleToSubmit = false,
      currentTemplate: { title = '' } = {},
      newTemplateData: { settings = [], fullname = '', signature = '' },
    },
  }) => ({
    isAbleToSubmit,
    settings,
    fullname,
    signature,
    title,
  }),
)
class EmploymentDetails extends PureComponent {
  componentDidMount() {}

  checkSubmit = () => {
    const { dispatch, settings, fullname, title } = this.props;
    const newSetting = settings.filter((item) => item !== null && item !== undefined);
    const check = newSetting.map((data) => data.value !== '').every((data) => data === true);
    if (check === true && title !== '' && fullname !== '') {
      dispatch({
        type: 'employeeSetting/save',
        payload: {
          isAbleToSubmit: true,
        },
      });
    } else {
      dispatch({
        type: 'employeeSetting/save',
        payload: {
          isAbleToSubmit: false,
        },
      });
    }
  };

  onNext = () => {
    const { onNext = {} } = this.props;
    this.checkSubmit();
    onNext();
  };

  _renderRadio = () => {
    const { settingsList } = this.props;
    return settingsList.map((option) => {
      return <Option settingsList={settingsList} option={option} />;
    });
  };

  onFinish = (values) => {
    // console.log('Success:', values);
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
