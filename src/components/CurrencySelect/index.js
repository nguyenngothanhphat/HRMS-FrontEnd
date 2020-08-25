import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Select, Tooltip, Spin, Empty, Icon } from 'antd';
import { Debounce } from 'lodash-decorators/debounce';
import Currency from '../Currency';

@connect(({ currency: { currencies: { filter } } }) => ({
  filter,
}))
class CurrencySelect extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps || 'filter' in nextProps) {
      const { filter } = nextProps;
      return { currency: nextProps.value, list: filter || [] };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value: currency } = props;

    this.state = {
      currency,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'currency/getSupportCurrencies' });
  }

  handleChange(value) {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
  }

  @Debounce(600)
  handleSearch(keyword) {
    const { dispatch } = this.props;
    dispatch({ type: 'currency/getSupportCurrencies', payload: keyword }).then(() =>
      this.setState({ searching: false })
    );
  }

  render() {
    const { placeholder } = this.props;
    const { searching, currency, list = [] } = this.state;
    const options = list.map(item => (
      <Select.Option key={item._id}>
        <Currency currency={item} />
      </Select.Option>
    ));
    let notFoundContent = (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={formatMessage({ id: 'currency.search.not-match' })}
      />
    );
    if (searching) {
      notFoundContent = (
        <div style={{ textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      );
    } else if (!currency && searching === undefined) {
      notFoundContent = (
        <div>
          <Icon type="search" /> <FormattedMessage id="currency.search.help" />
        </div>
      );
    }
    return (
      <Tooltip
        placement="top"
        title={formatMessage({ id: 'currency.search.help' })}
        trigger="hover"
      >
        <Select
          showSearch
          allowClear
          notFoundContent={notFoundContent}
          placeholder={placeholder}
          onSearch={val => {
            this.setState({ searching: true }, this.handleSearch(val));
          }}
          onChange={v => this.handleChange(v)}
          value={currency}
          filterOption={false}
        >
          {options}
        </Select>
      </Tooltip>
    );
  }
}

export default CurrencySelect;
