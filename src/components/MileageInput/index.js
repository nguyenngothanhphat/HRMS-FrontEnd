import React, { Fragment } from 'react';
import classNames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Select, InputNumber, Row, Col, DatePicker } from 'antd';
import { connect } from 'dva';
import { Debounce } from 'lodash-decorators/debounce';
import styles from './index.less';
import { roundNumber } from '@/utils/utils';

const { Group: InputGroup } = Input;
const { Option } = Select;
const vehicles = {
  CAR: {
    src: '/image/bill-type/mileage-car.png',
    alt: 'car icon',
  },
  BIKE: {
    src: '/image/bill-type/mileage-bike.png',
    alt: 'bike icon',
  },
};

@connect(({ exchangeRate, bill: { mileageRate } }) => ({
  exchangeRate,
  mileageRate,
}))
class MileageInput extends React.PureComponent {
  _mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      currency: '',
      originalNumber: 0,
      rate: 0,
      original: '',
      date: '',
      type: '',
      distanceUnit: 'km',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      value: { rate, original, currency, originalNumber, number, date, type, distanceUnit },
      mileageRate,
    } = nextProps;
    if ('value' in nextProps) {
      return {
        ...(date ? { date } : {}),
        ...(type ? { type } : {}),
        ...(number ? { number } : {}),
        ...(currency ? { currency } : {}),
        ...(originalNumber ? { originalNumber } : { originalNumber: number }),
        ...(rate ? { rate } : {}),
        ...(original ? { original } : {}),
        ...(mileageRate ? { mileageRate } : {}),
        ...(distanceUnit ? { distanceUnit } : {}),
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

  handleDateChange = date => {
    const { dispatch } = this.props;
    const { original, originalNumber } = this.state;
    dispatch({
      type: 'exchangeRate/fetchRate',
      payload: {
        original,
        byPass: true,
        date: date ? date.toString() : '',
      },
    }).then(rate => {
      this.triggerChange({
        ...this.state,
        rate,
        date,
        ...(originalNumber ? { number: originalNumber * rate } : {}),
      });
    });
  };

  handleVehicleChange = value => {
    const { mileageRate } = this.state;
    const { dispatch } = this.props;
    const currentdate = new Date();
    dispatch({
      type: 'exchangeRate/fetchRate',
      payload: {
        original: mileageRate[value.toLowerCase()].currency,
        byPass: true,
        date: currentdate,
      },
    }).then(rate => {
      this.triggerChange({
        ...this.state,
        distanceUnit: mileageRate[value.toLowerCase()].distanceUnit,
        rate,
        original: mileageRate[value.toLowerCase()].currency,
        type: value,
        originalNumber: mileageRate[value.toLowerCase()].rate,
        number: mileageRate[value.toLowerCase()].rate * rate,
      });
    });
  };

  handleChangeDistanceUnit = distanceUnit => {
    this.triggerChange({
      ...this.state,
      distanceUnit,
    });
  };

  @Debounce(600)
  async handleChangeOriginal(original) {
    const { dispatch } = this.props;
    const { originalNumber, date } = this.state;
    await dispatch({
      type: 'exchangeRate/fetchRate',
      payload: { original, date: date ? date.toString() : '' },
    }).then(rate => {
      this.triggerChange({
        ...this.state,
        original,
        rate,
        ...(originalNumber ? { number: originalNumber * rate } : {}),
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
      value: { date },
    } = this.props;
    const {
      originalNumber,
      rate,
      original,
      number,
      objectCurrency: { symbol } = { symbol: '' },
      type,
      distanceUnit,
    } = this.state;
    const currencyList = [...reference];
    if (currency) currencyList.push(currency);

    const distanceList = ['km', 'mile'];

    return (
      <div>
        <Row className={styles.root} gutter={12}>
          <Col span={12}>
            <span className={styles.title}>
              <span className={styles.asterisk}>* </span>
              {formatMessage({ id: 'bill.form.mileage.date' })}
            </span>
            <DatePicker
              defaultValue={date}
              className={styles.inputPicker}
              style={{ width: '100%' }}
              onChange={this.handleDateChange}
            />
          </Col>
          <Col span={12}>
            <span className={styles.title}>
              <span className={styles.asterisk}>* </span>
              {formatMessage({ id: 'bill.form.mileage-form.type' })}
            </span>
            <Row type="flex" gutter={8} justify="space-between">
              {type.length > 0 && (
                <Col span={6}>
                  <img
                    className={styles.avatar}
                    src={vehicles[type].src}
                    alt={vehicles[type].alt}
                  />
                </Col>
              )}
              <Col span={type.length > 0 ? 18 : 24}>
                <Select
                  defaultValue={type}
                  showSearch
                  placeholder="Select a vehicle"
                  optionFilterProp="children"
                  onChange={this.handleVehicleChange}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="CAR">
                    {formatMessage({ id: 'bill.form.mileage-form.car' }).toUpperCase()}
                  </Option>
                  <Option value="BIKE">
                    {formatMessage({ id: 'bill.form.mileage-form.bike' }).toUpperCase()}
                  </Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        {type && (
          <div className={styles.amountInput}>
            <span className={styles.title}>
              {formatMessage({ id: 'bill.form.mileage.rate-per-km' })}
            </span>
            <InputGroup className={styles.root} compact>
              <Row type="flex" gutter={8}>
                <Col md={original !== currency ? 4 : 5}>
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
                <Col className={styles.styleText} span={1}>
                  /
                </Col>
                <Col md={original !== currency ? 4 : 5}>
                  <Select
                    className={styles.select}
                    value={distanceUnit}
                    onChange={v => this.handleChangeDistanceUnit(v)}
                    placeholder={formatMessage({ id: 'common.currency' })}
                  >
                    {distanceList.map(code => (
                      <Option key={code}>{code}</Option>
                    ))}
                  </Select>
                </Col>
                {original !== currency && (
                  <Fragment>
                    <Col md={4}>
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
                    <Col md={5}>
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
                <Col md={original !== currency ? 6 : 12}>
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
          </div>
        )}
      </div>
    );
  }
}

export default MileageInput;
