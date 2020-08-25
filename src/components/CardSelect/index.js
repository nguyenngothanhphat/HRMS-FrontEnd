import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

@connect(({ creditCard: { listCard }, loading }) => ({
  listCard,
  loading: loading.models.creditCard,
}))
class CardSelect extends Component {
  static getDerivedStateFromProps({ value, listCard }) {
    return { value, list: listCard };
  }

  constructor(props) {
    super(props);
    const { listCard, value } = props;
    this.state = {
      list: listCard,
      value,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'creditCard/fetchForEmployee' });
  }

  handleChange = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
    else this.setState({ value });
  };

  render() {
    const { placeholder, className, disabled } = this.props;
    const { value, list = [] } = this.state;
    const { key, label } = value || {};
    return (
      <Select
        {...key && label && { value, defaultValue: { key } }}
        labelInValue
        allowClear
        className={className}
        placeholder={placeholder}
        filterOption={false}
        onChange={v => this.handleChange(v)}
        style={{ width: '100%' }}
        disabled={disabled}
      >
        {list.map(({ _id, name: optionName }) => (
          <Select.Option key={_id}>{optionName}</Select.Option>
        ))}
      </Select>
    );
  }
}

export default CardSelect;
