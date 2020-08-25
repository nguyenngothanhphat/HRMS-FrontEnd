import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Select, InputNumber, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { Option } = Select;

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
      distanceUnit: 'km',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      value: { number, currency, distanceUnit },
    } = nextProps;
    if ('value' in nextProps) {
      return {
        ...(currency ? { currency } : {}),
        ...(number ? { number } : {}),
        ...(distanceUnit ? { distanceUnit } : {}),
      };
    }
    return null;
  }

  triggerChange = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
  };

  async handleChangeCurrency(currency) {
    this.triggerChange({
      ...this.state,
      currency,
    });
  }

  async handleChangeDistanceUnit(distanceUnit) {
    this.triggerChange({
      ...this.state,
      distanceUnit,
    });
  }

  handleChangeRate(number) {
    this.triggerChange({
      ...this.state,
      number,
    });
  }

  render() {
    const {
      exchangeRate: { reference, currency },
    } = this.props;
    const { currency: mileageCurrency, number, distanceUnit } = this.state;
    const currencyList = [...reference];
    if (currency) currencyList.push(currency);

    const distanceList = ['km', 'mile'];

    return (
      <Row className={styles.root} gutter={12}>
        <Col span={5}>
          <Select
            className={styles.select}
            value={mileageCurrency}
            onChange={v => this.handleChangeCurrency(v)}
            placeholder={formatMessage({ id: 'common.currency' })}
          >
            {currencyList.map(code => (
              <Option key={code}>{code}</Option>
            ))}
          </Select>
        </Col>
        <Col className={styles.styleText} span={2}>
          per
        </Col>
        <Col span={5}>
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
        <Col span={12}>
          <InputNumber
            onChange={v => this.handleChangeRate(v)}
            value={number}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
            className={styles.input}
            placeholder={formatMessage({ id: 'common.enter-price' })}
          />
        </Col>
      </Row>
    );
  }
}

export default MileageInput;
