import React, { Component } from 'react';
import { Form, Radio, Input } from 'antd';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeSetting: {
      currentTemplate: { title = '', htmlContent = '', thumbnail = '' } = {},
      newTemplateData: { settings = [], fullname = '', signature = '' },
    },
  }) => ({
    loadingAddCustomTemplate: loading.effects['employeeSetting/addCustomTemplate'],
    settings,
    fullname,
    thumbnail,
    signature,
    title,
    htmlContent,
  }),
)
class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      isEmpty: '',
    };
  }

  componentDidMount = () => {
    const { dispatch, settingsList } = this.props;
    dispatch({
      type: 'employeeSetting/saveEmployeeSetting',
      payload: {
        settings: settingsList,
      },
    });
  };

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

  onChangeRadio = (key, value, description, e) => {
    const { dispatch, settings, settingsList } = this.props;
    const { checked } = this.state;
    const array = [...settings];
    const index = settingsList.findIndex((item) => item.key === key);
    let tempValue = '';

    if (checked === false) {
      tempValue = settingsList[index].value;
    } else {
      tempValue = value;
    }

    const setting = {
      key,
      description,
      value: tempValue,
      isEdited: !checked,
    };

    array[index] = setting;

    dispatch({
      type: 'employeeSetting/saveTemplate',
      payload: {
        settings: array,
      },
    });

    this.setState({
      checked: e.target.value,
    });
  };

  onChangeInput = (option, e) => {
    const { dispatch, settings, settingsList } = this.props;
    const { target } = e;
    const { name, value } = target;
    const setting = {
      key: option.key,
      description: option.description,
      value,
      isEdited: true,
    };
    const array = [...settings];
    const index = settingsList.findIndex((item) => item.key === name);

    array[index] = setting;

    this.checkSubmit();

    dispatch({
      type: 'employeeSetting/saveEmployeeSetting',
      payload: {
        settings: array,
      },
    });
    if (value === '') {
      this.setState({
        isEmpty: true,
      });
    } else {
      this.setState({
        isEmpty: false,
      });
    }
  };

  render() {
    const { option } = this.props;
    const { checked, isEmpty } = this.state;
    return (
      <div className={styles.Option}>
        <Form.Item
          className={styles.option}
          key={option.key}
          name={option.key}
          label={option.description}
        >
          <Radio.Group
            onChange={(e) => this.onChangeRadio(option.key, option.value, option.description, e)}
            defaultValue={checked}
          >
            <Radio value={false}>{formatMessage({ id: 'component.employmentDetails.yes' })}</Radio>
            <Radio value>{formatMessage({ id: 'component.employmentDetails.no' })}</Radio>
            <Form.Item
              // name={`input${option.key}`}
              noStyle
              // rules={[{ required: checked, message: 'Input is required' }]}
            >
              <Input
                name={option.key}
                disabled={!checked}
                defaultValue={option.value}
                onChange={(e) => this.onChangeInput(option, e)}
              />
            </Form.Item>
          </Radio.Group>
        </Form.Item>
        {checked === true && isEmpty === true ? (
          <p className={styles.alert}>Input is required!</p>
        ) : null}
      </div>
    );
  }
}

export default Option;
