import React, { Component } from 'react';
import { Form, Radio, Input } from 'antd';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

@connect(({ employeeSetting: { tempSettings = {} } }) => ({
  tempSettings,
}))
class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: true,
    };
  }

  onChangeRadio = (key, value, description, e) => {
    const { dispatch, tempSettings, settings } = this.props;
    const { checked } = this.state;
    const array = [...tempSettings];
    const index = settings.findIndex((item) => item.key === key);

    const setting = {
      key,
      description,
      value,
    };
    if (checked === false) {
      array.slice(index, 1);
    } else {
      array[index] = setting;
    }
    console.log(array);
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        tempSettings: array,
      },
    });

    this.setState({
      checked: e.target.value,
    });
  };

  onChangeInput = (option, e) => {
    const { dispatch, tempSettings, settings } = this.props;
    const { target } = e;
    const { name, value } = target;
    const setting = {
      key: option.key,
      description: option.description,
      value,
    };
    const array = [...tempSettings];

    const index = settings.findIndex((item) => item.key === name);
    array[index] = setting;
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        tempSettings: array,
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
            <Radio value>{formatMessage({ id: 'component.employmentDetails.yes' })}</Radio>
            <Radio value={false}>{formatMessage({ id: 'component.employmentDetails.no' })}</Radio>
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
