import React, { Component } from 'react';
import { Form, Radio, Input } from 'antd';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

@connect(({ employeeSetting: { newTemplateData: { settings = {} } = {} } }) => ({
  settings,
}))
class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
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

    dispatch({
      type: 'employeeSetting/saveEmployeeSetting',
      payload: {
        settings: array,
      },
    });
  };

  render() {
    const { option } = this.props;
    const { checked } = this.state;
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
            <Input
              name={option.key}
              disabled={!checked}
              defaultValue={option.value}
              onChange={(e) => this.onChangeInput(option, e)}
            />
          </Radio.Group>
        </Form.Item>
      </div>
    );
  }
}

export default Option;
