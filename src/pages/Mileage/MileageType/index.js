import React, { useState, Fragment, useEffect } from 'react';
import numeral from 'numeral';
import { Col, Row, DatePicker, Select, Icon, Input, Form, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'MMM DD, YYYY';
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

const MileageType = props => {
  const {
    value: {
      date,
      listMileageTypeRate = [],
      vehicleOriginCurrency = 'USD',
      distanceUnitOrigin,
      listCurrency = [],
      myCurrency,
      exChangeRateInit = 0,
      getFieldDecorator,
      setFieldsValue,
      dispatch,
      vehicleType,
      setVehicleType,
      exchangeRate,
      setExchangeRate,
      vehicleTypeKey,
      form,
      vehicleRate,
      validationVehicleType,
      setValidationVehicleType,
      renderLabel,
    } = {},
  } = props;
  const { Option } = Select;
  const [fetchExRate, setFetchExRate] = useState(false);
  const [originalCurrency, setOriginalCurrency] = useState('');
  const [validationDateOfSpend, setValidationDateOfSpend] = useState(false);
  useEffect(() => {
    setVehicleType({
      key: vehicleTypeKey,
      money: vehicleRate,
      currency: vehicleOriginCurrency,
      distanceUnit: distanceUnitOrigin,
    });
    setOriginalCurrency(vehicleOriginCurrency);
  }, [vehicleTypeKey, vehicleRate, vehicleOriginCurrency, distanceUnitOrigin]);
  useEffect(() => {
    setExchangeRate(exChangeRateInit);
  }, [exChangeRateInit]);

  const getInitTotalNumberEx = () => {
    return parseFloat(vehicleRate) * parseFloat(exChangeRateInit);
  };
  const setExChangeValueForInput = val => {
    const checkFieldExist = setInterval(() => {
      if (undefined !== form.getFieldValue('exChangeRate')) {
        setFieldsValue({ exChangeRate: val || 0 });
        clearInterval(checkFieldExist);
      }
    }, 500);
  };
  const setMoneyInput = val => {
    const checkFieldExist = setInterval(() => {
      if (undefined !== form.getFieldValue('money')) {
        setFieldsValue({ money: val || 0 });
        clearInterval(checkFieldExist);
      }
    }, 500);
  };

  const setDistanceUnitInput = val => {
    const checkFieldExist = setInterval(() => {
      if (undefined !== form.getFieldValue('distanceUnit')) {
        setFieldsValue({ distanceUnit: val || 0 });
        clearInterval(checkFieldExist);
      }
    }, 500);
  };

  const setCurrencyInput = val => {
    const checkFieldExist = setInterval(() => {
      if (undefined !== form.getFieldValue('currency')) {
        setFieldsValue({ currency: val || 0 });
        clearInterval(checkFieldExist);
      }
    }, 500);
  };
  const checkVehicleType = (rule, item, callback) => {
    let msg;
    const filter = [
      () => ({
        check: !item,
        message: 'Type must be provide',
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(item);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      setValidationVehicleType(false);
    } else {
      setValidationVehicleType(true);
    }
    callback(msg);
  };
  const checkDateOfSpend = (rule, item, callback) => {
    let msg;
    const filter = [
      () => ({
        check: !item,
        message: 'Date of Spend must be provided',
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(item);
      msg = message;
      return check;
    });
    if (!result) {
      msg = undefined;
      setValidationDateOfSpend(false);
    } else {
      setValidationDateOfSpend(true);
    }
    callback(msg);
  };
  const setTotalNumberExForInput = (val1, val2) => {
    const checkFieldExist = setInterval(() => {
      if (undefined !== form.getFieldValue('totalNumberEx')) {
        setFieldsValue({
          totalNumberEx: numeral(parseFloat(val1) * parseFloat(val2)).format('0,0[.]00') || 0,
        });
        clearInterval(checkFieldExist);
      }
    }, 500);
  };
  const handleDateChange = value => {
    if (value && vehicleType.key && vehicleType.currency !== myCurrency) {
      setFetchExRate(true);
      dispatch({
        type: 'exchangeRate/fetchRateByDate',
        payload: {
          date: value.format('YYYY-MM-DD'),
          fr: vehicleType.currency,
          to: myCurrency,
        },
      }).then(val => {
        setExchangeRate(val);
        setExChangeValueForInput(val);
        setTotalNumberExForInput(val, vehicleType.money);
        setFetchExRate(false);
      });
    }
  };
  const handleVehicleChange = value => {
    const tmp = listMileageTypeRate.filter(item => item.key === value);
    setVehicleType(...tmp);
    setCurrencyInput(tmp[0].currency);
    setMoneyInput(tmp[0].money);
    setDistanceUnitInput(tmp[0].distanceUnit);
    setTotalNumberExForInput(exchangeRate, tmp[0].money);
    setOriginalCurrency(tmp[0].currency);
    if (myCurrency !== tmp[0].currency) {
      setFetchExRate(true);
      dispatch({
        type: 'exchangeRate/fetchRateByDate',
        payload: {
          date: moment(form.getFieldValue('dateofspend'), dateFormat).format('YYYY-MM-DD'),
          fr: tmp[0].currency,
          to: myCurrency,
        },
      }).then(val => {
        setExchangeRate(val);
        setExChangeValueForInput(val);
        setTotalNumberExForInput(val, tmp[0].money);
        setFetchExRate(false);
      });
    }
  };
  const handleChangeMoney = e => {
    const { value } = e.currentTarget;
    setTotalNumberExForInput(exchangeRate, value);
    setVehicleType({
      ...vehicleType,
      money: value,
    });
  };
  const handleChangeOriginal = value => {
    setVehicleType({
      ...vehicleType,
      currency: value,
    });
    setOriginalCurrency(value);
    if (value !== myCurrency) {
      setFetchExRate(true);
      dispatch({
        type: 'exchangeRate/fetchRateByDate',
        payload: {
          date: moment(form.getFieldValue('dateofspend'), dateFormat).format('YYYY-MM-DD'),
          fr: value,
          to: myCurrency,
        },
      }).then(val => {
        setExchangeRate(val);
        setExChangeValueForInput(val);
        setTotalNumberExForInput(val, vehicleType.money);
        setFetchExRate(false);
      });
    }
  };

  const handleChangeDistanceUnit = value => {
    setVehicleType({
      ...vehicleType,
      distanceUnit: value,
    });
  };
  const distanceList = ['km', 'mile'];
  return (
    <div className={styles.root}>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={renderLabel(
              formatMessage({ id: 'mileage.dateOfSpend' }),
              validationDateOfSpend,
              true
            )}
          >
            {getFieldDecorator('dateofspend', {
              initialValue: date,
              rules: [
                {
                  validator: (rule, value, callback) => checkDateOfSpend(rule, value, callback),
                },
              ],
            })(
              <DatePicker
                className={styles.inputPicker}
                style={{ width: '100%' }}
                onChange={handleDateChange}
                suffixIcon={<Icon type="down" />}
                format={dateFormat}
              />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Row type="flex" gutter={8} justify="space-between">
            {vehicleType.key && (
              <Col span={4} className={styles.avatar}>
                <img
                  src={
                    vehicles[vehicleType.key.toUpperCase()]
                      ? vehicles[vehicleType.key.toUpperCase()].src
                      : ''
                  }
                  alt={
                    vehicles[vehicleType.key.toUpperCase()]
                      ? vehicles[vehicleType.key.toUpperCase()].alt
                      : ''
                  }
                />
              </Col>
            )}
            <Col span={vehicleType.key ? 20 : 24}>
              <Form.Item label={renderLabel('Type', validationVehicleType, true)}>
                {getFieldDecorator('vehicletypeinput', {
                  initialValue: vehicleTypeKey || '',
                  rules: [
                    {
                      validator: (rule, value, callback) => checkVehicleType(rule, value, callback),
                    },
                  ],
                })(
                  <Select
                    placeholder={formatMessage({ id: 'mileage.selectAVehice' })}
                    optionFilterProp="children"
                    onChange={handleVehicleChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listMileageTypeRate.map(mileageItem => (
                      <Option key={mileageItem.key} value={mileageItem.key}>
                        {mileageItem.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      {vehicleType.key && (
        <div className={styles.amountInput}>
          <Row type="flex" gutter={8}>
            <Col span={4}>
              <span className={styles.mileageLabel}>{formatMessage({ id: 'mileage.rate' })}</span>
              <Form.Item>
                {getFieldDecorator('currency', {
                  initialValue: vehicleOriginCurrency,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select
                    showSearch
                    className={styles.select}
                    onChange={v => handleChangeOriginal(v)}
                    placeholder={formatMessage({ id: 'common.currency' })}
                    style={{ width: '100%' }}
                  >
                    {listCurrency.map(item => (
                      <Option key={item._id}>{item._id}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={3}>
              <span className={styles.mileageLabel} style={{ visibility: 'hidden' }}>
                {formatMessage({ id: 'mileage.exRate' })}
                <span className={styles.asterisk}>* </span>
              </span>
              <Form.Item>
                {getFieldDecorator('money', { initialValue: vehicleRate })(
                  <Input
                    className={styles.input}
                    placeholder={formatMessage({ id: 'common.enter-price' })}
                    onChange={handleChangeMoney}
                  />
                )}
              </Form.Item>
            </Col>
            {originalCurrency !== myCurrency && (
              <Fragment>
                <Col span={1} className={styles.iconCalculator}>
                  <span className={styles.iconSpan}>X</span>
                </Col>
                <Col span={4}>
                  <span className={styles.mileageLabel}>
                    {formatMessage({ id: 'mileage.exRate' })}
                    <span className={styles.asterisk}>* </span>
                  </span>
                  <Form.Item>
                    {fetchExRate ? (
                      <Spin
                        size="small"
                        style={{
                          display: 'flex',
                          width: '50px',
                          marginLeft: '50px',
                          marginTop: '10px',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {getFieldDecorator('exChangeRate', { initialValue: exChangeRateInit })(
                          <Input
                            className={styles.input}
                            placeholder={formatMessage({ id: 'common.enter-price' })}
                            readOnly
                          />
                        )}
                      </React.Fragment>
                    )}
                  </Form.Item>
                </Col>
                <Col span={1} className={styles.iconCalculator}>
                  <span className={styles.iconSpan}>=</span>
                </Col>
                <Col span={2} className={styles.currency}>
                  <span className={styles.title} style={{ visibility: 'hidden' }}>
                    hidden
                  </span>
                  <span>{`${myCurrency}`}</span>
                </Col>
                <Col span={4}>
                  <span className={styles.title} style={{ visibility: 'hidden' }}>
                    hidden
                  </span>
                  <Form.Item>
                    {fetchExRate ? (
                      <Spin
                        size="small"
                        style={{
                          display: 'flex',
                          width: '50px',
                          marginLeft: '50px',
                          marginTop: '10px',
                        }}
                      />
                    ) : (
                      <React.Fragment>
                        {getFieldDecorator('totalNumberEx', {
                          initialValue: numeral(getInitTotalNumberEx()).format('0,0[.]00'),
                        })(<Input readOnly />)}{' '}
                      </React.Fragment>
                    )}
                  </Form.Item>
                </Col>
              </Fragment>
            )}
            <Col className={styles.iconCalculator} span={1}>
              <span className={styles.iconSlash}>/</span>
            </Col>
            <Col span={4}>
              <span className={styles.title} style={{ visibility: 'hidden' }}>
                hidden
              </span>
              <Form.Item>
                {getFieldDecorator('distanceUnit', {
                  initialValue: distanceUnitOrigin,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select
                    showSearch
                    className={styles.distanceUnit}
                    onChange={v => handleChangeDistanceUnit(v)}
                    placeholder={formatMessage({ id: 'common.currency' })}
                  >
                    {distanceList.map(code => (
                      <Option key={code} style={{ textTransform: 'capitalize' }}>
                        {code}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default MileageType;
