import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

@connect(({ creditCard: { listCard }, loading, reimbursement }) => ({
  listCard,
  loading: loading.models.creditCard,
  reimbursement,
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
    dispatch({ type: 'creditCard/fetch' });
  }

  handleChange = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
    else this.setState({ value });
  };

  filterListCard = () => {
    const {
      reimbursement: { selectedList },
    } = this.props;
    const { list = [] } = this.state;
    const result = list.filter(item => selectedList.approval[0].user.email === item.assignEmail);
    return result;
  };

  render() {
    const {
      placeholder = formatMessage({ id: 'creditCard.select.placeholder' }),
      className,
      disabled,
    } = this.props;
    const { value = {} } = this.state;
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
        {this.filterListCard().map(({ _id, name: optionName }) => (
          <Select.Option key={_id}>{optionName}</Select.Option>
        ))}
      </Select>
    );
  }
}

export default CardSelect;
