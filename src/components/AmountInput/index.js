import React, { Fragment } from 'react';
import classNames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Select, InputNumber, Row, Col } from 'antd';
import { connect } from 'dva';
import { roundNumber } from '@/utils/utils';
import { Debounce } from 'lodash-decorators/debounce';
import styles from './index.less';

const { Group: InputGroup } = Input;
const { Option } = Select;

@connect(({ exchangeRate }) => ({
  exchangeRate,
}))
class AmountInput extends React.PureComponent {
  _mounted = false;

  constructor(props) {
    super(props);
    const {
      value: { number, currency, originalNumber, rate = 1, original },
    } = this.props;
    this.state = {
      number,
      currency,
      originalNumber: originalNumber || number,
      rate,
      original: original || currency,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const {
      value: { rate },
      exchangeRate: {
        rate: { val: newRate = rate },
      },
      onChange,
    } = nextProps;
    if (nextProps.id === 'amount') {
      if (rate !== newRate) {
        if (typeof onChange === 'function')
          onChange({
            ...state,
            rate: newRate,
          });
      }
    }
    if ('value' in nextProps) {
      const { number, currency, originalNumber, original } = nextProps.value;
      return {
        ...(number ? { number } : {}),
        ...(currency ? { currency } : {}),
        ...(originalNumber ? { originalNumber } : {}),
        ...(rate ? { rate } : {}),
        ...(original ? { original } : {}),
      };
    }
    return null;
  }

  componentDidMount() {
    const {
      currency: currencyCode,
      exchangeRate: { currency: systemCurrencyCode },
      dispatch,
    } = this.props;
    this._mounted = true;

    dispatch({ type: 'currency/fetchItem', payload: currencyCode || systemCurrencyCode }).then(
      objectCurrency => {
        if (this._mounted) this.setState({ objectCurrency });
      }
    );
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  triggerChange = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
  };

  @Debounce(600)
  async handleChangeOriginal(original) {
    const {
      dispatch,
      exchangeRate: { currency },
      selectedDate,
    } = this.props;
    const { originalNumber } = this.state;
    const currentDate = await new Date();
    await dispatch({
      type: 'exchangeRate/fetchRate',
      payload: { original, date: selectedDate ? selectedDate.toString() : currentDate.toString() },
    }).then(rate => {
      this.triggerChange({
        ...this.state,
        original,
        rate,
        ...(originalNumber ? { originalNumber, number: originalNumber * rate, currency } : {}),
      });
    });
  }

  handleChangeNumber(number) {
    this.triggerChange({ ...this.state, number, originalNumber: number });
  }

  @Debounce(600)
  handleChangeOriginalNumber(originalNumber) {
    const {
      value: { rate },
      value,
    } = this.props;
    this.triggerChange({
      ...this.state,
      ...value,
      originalNumber,
      number: originalNumber * rate,
    });
  }

  render() {
    const {
      exchangeRate: { reference, currency },
    } = this.props;
    const {
      originalNumber,
      rate,
      original,
      number,
      objectCurrency: { symbol } = { symbol: '' },
    } = this.state;
    const currencyList = [...reference];
    if (currency) currencyList.push(currency);

    return (
      <InputGroup className={styles.root} compact>
        <Row type="flex" gutter={16}>
          <Col md={original !== currency ? 4 : 8}>
            <Select
              className={styles.select}
              value={original}
              onChange={v => this.handleChangeOriginal(v)}
              placeholder={formatMessage({ id: 'common.currency' })}
            >
              {currencyList.map(code => (
                <Option key={code}>{code}</Option>
              ))}
            </Select>
          </Col>
          {original !== currency && (
            <Fragment>
              <Col md={5}>
                <InputNumber
                  onChange={v => this.handleChangeOriginalNumber(v)}
                  value={originalNumber}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                  className={styles.input}
                  placeholder={formatMessage({ id: 'common.enter-price' })}
                  disabled={!original}
                />
              </Col>
              <Col md={6}>
                <InputNumber
                  value={rate}
                  className={`${styles.input} ${styles.disabled} ${styles.rate}`}
                  parser={value => value.replace(/\s?|(,*)|x|=/g, '')}
                  formatter={value => `x ${value} =`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  disabled
                />
              </Col>
            </Fragment>
          )}
          <Col md={original !== currency ? 9 : 16}>
            <InputNumber
              onChange={v => this.handleChangeNumber(v)}
              value={!original || original !== currency ? roundNumber(number, 2) : number}
              formatter={value => `${symbol} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => `${value}`.replace(/[^.\d]\s?|(,*)/g, '')}
              className={classNames(styles.input, styles.total, {
                [styles.disabled]: !original || original !== currency,
              })}
              placeholder={formatMessage({ id: 'common.total' })}
              disabled={!original || original !== currency}
            />
          </Col>
        </Row>
      </InputGroup>
    );
  }
}

export default AmountInput;
