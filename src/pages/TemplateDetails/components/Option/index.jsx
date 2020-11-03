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

  onChangeRadio = (key, value, description, e) => {
    const { dispatch, settings, settingsList } = this.props;
    const { checked } = this.state;
    let array = [...settings];
    console.log('array', array);
    const index = settingsList.findIndex((item) => item.key === key);

    if (checked !== false) {
      // const tempArray = array.filter((item) => item?.key !== key && item !== undefined);
      const tempArray = array.map((item) => {
        return item?.key === key ? null : item;
      });
      console.log(tempArray);
      array = [...tempArray];
    } else {
      const setting = {
        key,
        description,
        value,
      };
      array[index] = setting;
    }

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
