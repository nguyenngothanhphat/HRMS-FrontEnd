import React from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
// import PageLoading from '../PageLoading';

@connect(({ loading, currency: { list } }) => ({
  fetching: loading.effects['currency/fetch'],
  list,
}))
class PriceInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { number = 0, currency = 'USD' } = props.value || {};
    this.state = {
      number: numeral(number).value() && 0,
      currency,
    };
  }

  handleNumberChange = value => {
    const number = numeral(value).value();
    if (!number) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { className, postfix, fetching, list = [] } = this.props;
    const { currency: code, number } = this.state;
    let symbol = code;
    if (list.length > 0) {
      const { symbol: sym } = list.find(cur => cur._id === code) || {};
      symbol = sym;
    }
    return (
      // <PageLoading loading={fetching} className={className} size="small">
      //   {`${symbol || ''} ${numeral(number).format('0,0[.]00')}`}
      //   {postfix}
      // </PageLoading>
      <>
        {fetching ? (
          <span className={className}>0</span>
        ) : (
          <span className={className}>
            {`${symbol || ''} ${numeral(number).format('0,0[.]00')}`}
            {postfix}
          </span>
        )}
      </>
    );
  }
}

export default PriceInput;
