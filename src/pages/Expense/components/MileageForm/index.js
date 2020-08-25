import React, { PureComponent } from 'react';
import { Form, Row, Col, Card, Button, Input, Empty, Icon, Checkbox, notification } from 'antd';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import MileageInput from '@/components/MileageInput';
import GoogleMap from '@/components/GoogleMap';
import PriceInput from '@/components/PriceInput';
import { roundNumber } from '@/utils/utils';
import SearchLocation from '../SearchLocation';
import styles from './index.less';

const FormItem = Form.Item;
@Form.create()
@connect(({ bill: { mileageRate } }) => ({
  mileageRate,
}))
class MileageForm extends PureComponent {
  state = {
    map: {},
  };

  static getDerivedStateFromProps(nextProps) {
    if ('item' in nextProps) {
      const { item } = nextProps;
      const { mileage = {} } = item || {};
      const { from, to, stop = [] } = mileage;
      return {
        ...(from || to
          ? { map: { origin: from, destination: to, waypoints: stop }, date: item.date }
          : {}),
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this._mounted = true;
    dispatch({ type: 'bill/fetchMileageRate' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bill/save', payload: { item: {} } });
  }

  handleTypeOnChange = async ({ type }) => {
    const { dispatch, item, mileageRate } = this.props;
    if (type.length > 0) {
      const { rate } = mileageRate[type.toLowerCase()];
      const { mileage = {} } = item;
      const { distance = 0 } = mileage;
      await dispatch({
        type: 'bill/save',
        payload: {
          item: {
            ...item,
            mileage: { ...mileage, rate, type, distance: distance || 0 },
            ...(distance > 0 ? { amount: roundNumber(distance * rate, 4) } : { amount: 0 }),
          },
        },
      });
    }
  };

  handleInfoOnChange = value => {
    const { dispatch, item } = this.props;
    const { mileage = {} } = item;
    const { distance = 0 } = mileage;
    const { originalNumber = 0, type = '', number, original, distanceUnit = 'km' } = value;
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...item,
          originCurrency: original,
          mileage: {
            ...mileage,
            rate: originalNumber || number,
            type,
            distance: distance || 0,
            distanceUnit,
          },
          ...(distance > 0
            ? { amount: roundNumber(distance * (originalNumber || number), 4) }
            : { amount: 0 }),
        },
      },
    });
  };

  hanldeSearchLocation = val => {
    const { dispatch, item } = this.props;
    const { mileage = {} } = item;
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...item,
          mileage: { ...mileage, ...val },
        },
      },
    });
  };

  handleGoogleMapChange = distance => {
    const { dispatch, item } = this.props;
    const { mileage = {} } = item;
    const { rate = 0 } = mileage;
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...item,
          mileage: { ...mileage, distance },
          amount: roundNumber(distance * rate, 4),
        },
      },
    });
  };

  checkInput = info => {
    if (!info) {
      return formatMessage({ id: 'bill.required.amount' });
    }
    if (!info.date) {
      return formatMessage({ id: 'bill.required.date' });
    }
    if (!info.type) {
      return formatMessage({ id: 'bill.required.mileage.type' });
    }
    if (typeof info.original !== 'string') {
      return formatMessage({ id: 'bill.required.originalCurrency' });
    }
    if (info.original !== info.currency && typeof info.rate !== 'number') {
      return formatMessage({ id: 'bill.invalid.exchangeRate' });
    }
    if (info.original !== info.currency && (!info.originalNumber || info.originalNumber < 0)) {
      return formatMessage({ id: 'bill.required.originalAmount' });
    }
    if (!info.number || info.number < 0) {
      return formatMessage({ id: 'bill.required.amount' });
    }
    if (info.original !== info.currency && info.originalNumber > 10000000000) {
      return formatMessage({ id: 'bill.max.originalAmount' }, { max: 10000000000 });
    }
    if (info.number > 100000000000) {
      return formatMessage({ id: 'bill.max.amount' }, { max: 10000000000 });
    }
    if (info.number > 100000000000) {
      return formatMessage({ id: 'bill.max.amount' }, { max: 10000000000 });
    }
    if (info.number < 0.0001) {
      return formatMessage({ id: 'bill.min.amount' });
    }
    return '';
  };

  handleSubmitForm = (saveAndNew = false) => {
    const {
      form,
      match: {
        params: { action, type: category },
      },
      item,
      dispatch,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const check = this.checkInput(values.info);
      if (check === '') {
        if (err) return;
        const {
          mileage,
          reimbursable,
          info,
          info: {
            currency,
            date,
            type,
            original: originCurrency,
            rate: exchangeRate,
            distanceUnit,
          },
          amount: { number },
        } = values;
        const { to = {} } = mileage;
        if (!to.address) {
          notification.error({ message: 'Missing destination!' });
          return;
        }
        const checkData = false;
        const originAmount = number;
        const formData = {
          ...item,
          method: action === 'add' ? 'submit' : 'update',
          category,
          ...(action === 'add'
            ? {
                method: 'submit',
              }
            : {
                method: 'update',
                expenseID: action,
              }),
          mileage: {
            ...mileage,
            rate: info.originalNumber || info.number,
            type,
            distanceUnit,
          },
          exchangeRate,
          currency,
          originCurrency,
          date,
          reimbursable,
          originAmount,
          amount: originAmount * exchangeRate,
        };
        delete formData.type;
        delete formData.group;
        dispatch({ type: 'bill/submit', payload: { formData, saveAndNew, checkData } });
      } else {
        notification.error({
          message: check,
        });
      }
    });
  };

  checkMileageLocation = (rule, value, callback) => {
    let msg;
    try {
      if (typeof value !== 'object' && !value)
        throw new Error(formatMessage({ id: 'bill.required.mileage.address' }));
    } catch (error) {
      const { message } = error;
      msg = message;
    }
    callback(msg);
  };

  remove = k => {
    const { dispatch, item, form } = this.props;
    const { mileage = {} } = item;
    const { stop = [] } = mileage;
    let { to = {} } = mileage;
    let newStop = [...stop];
    if (k === newStop.length - 1) {
      to = newStop[newStop.length - 1] || {};
      newStop.splice(newStop.length - 1, 1);
    } else {
      newStop = newStop.filter((_, index) => index !== k + 1) || [];
    }
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...item,
          mileage: { ...mileage, stop: newStop, to },
        },
      },
    });
    form.resetFields();
  };

  add = () => {
    const { dispatch, item } = this.props;
    const { mileage = {} } = item;
    let { stop = [] } = mileage;
    const { to = {} } = mileage;
    if (stop.length === 0) {
      stop = [to];
    } else if (stop.length > 0) {
      stop = [...stop, to];
    }
    dispatch({
      type: 'bill/save',
      payload: {
        item: {
          ...item,
          mileage: { ...mileage, to: {}, stop },
        },
      },
    });
  };

  render() {
    const {
      form,
      match: {
        params: { action },
      },
      item,
      saving,
      exchangeRate: { currency },
    } = this.props;

    const { date } = this.state;

    const {
      amount,
      mileage = { type: '' },
      reimbursable = false,
      originCurrency: original = currency,
      exchangeRate: rate = 1,
    } = item;
    const { distanceUnit = 'km' } = mileage;
    const { from, to = {}, type, distance, stop = [], rate: originalNumber } = mileage;
    const { map = {} } = this.state;
    const { getFieldDecorator } = form;
    const waypoints = [...stop, to];
    const formItems = waypoints.map((location, k) => {
      const { placeID } = location;
      const key = placeID || k;
      const propsSearch = {
        onChange: val => {
          const newStop = [...stop];
          newStop[k] = val;
          this.hanldeSearchLocation(k === waypoints.length - 1 ? { to: val } : { stop: newStop });
        },
        delIcon:
          k + 1 === 1 ? (
            undefined
          ) : (
            <Icon
              className={styles.iconDel}
              type="delete"
              theme="twoTone"
              twoToneColor="red"
              onClick={() => this.remove(k - 1)}
            />
          ),
      };
      let label = `${formatMessage({ id: 'bill.form.mileage.stop' })} ${k + 1}`;
      if (stop.length === 0) label = formatMessage({ id: 'common.to' });
      else if (waypoints.length === k + 1) label = formatMessage({ id: 'bill.form.mileage.end' });

      return (
        <Form.Item
          label={
            <span>
              <span className={styles.asterisk}>* </span>
              {label}
            </span>
          }
          required={false}
          key={key}
        >
          {getFieldDecorator(k + 1 === waypoints.length ? 'mileage.to' : `mileage.stop.${k}`, {
            initialValue: location,
            rules: [{ validator: this.checkMileageLocation }],
          })(<SearchLocation {...propsSearch} />)}
        </Form.Item>
      );
    });
    return (
      <div className={styles.content}>
        <Row gutter={12}>
          <Col sm={12} xs={24}>
            <Form>
              <Card>
                <FormItem>
                  {getFieldDecorator('info', {
                    initialValue: {
                      date: moment(date || Date.now()),
                      type,
                      currency,
                      number: rate * originalNumber,
                      originalNumber,
                      original,
                      rate,
                      distanceUnit,
                    },
                  })(<MileageInput onChange={this.handleInfoOnChange} />)}
                </FormItem>
                <FormItem
                  label={
                    <span>
                      <span className={styles.asterisk}>* </span>
                      {stop.length > 0
                        ? formatMessage({ id: 'bill.form.mileage.start' })
                        : formatMessage({ id: 'common.from' })}
                    </span>
                  }
                >
                  {getFieldDecorator('mileage.from', {
                    initialValue: from,
                    rules: [{ validator: this.checkMileageLocation }],
                  })(<SearchLocation onChange={val => this.hanldeSearchLocation({ from: val })} />)}
                </FormItem>
                {formItems}
                {waypoints.length > 8 && (
                  <p className={styles.warning}>
                    <FormattedMessage id="bill.max.mileage.locations" />
                  </p>
                )}
                <FormItem>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.add}
                    disabled={waypoints.length > 8}
                  >
                    <FormattedMessage id="bill.form.btn.add.stop" />
                  </Button>
                </FormItem>
                <Row gutter={24}>
                  <Col span={12}>
                    <FormItem
                      label={`${formatMessage({
                        id: 'bill.form.mileage.distance',
                      })}(${distanceUnit})`}
                    >
                      {getFieldDecorator('mileage.distance', {
                        initialValue: distance,
                      })(<Input className={styles.noBorder} readOnly />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label={formatMessage({ id: 'common.amount' })}>
                      {getFieldDecorator('amount', {
                        initialValue: { number: amount, currency: original },
                      })(<PriceInput />)}
                    </FormItem>
                  </Col>
                </Row>
                <Form.Item>
                  {getFieldDecorator('reimbursable', {
                    initialValue: reimbursable,
                    valuePropName: 'checked',
                  })(
                    <Checkbox>
                      {' '}
                      <FormattedMessage id="common.reimbursable" />
                    </Checkbox>
                  )}
                </Form.Item>
                <FormItem>
                  <Row gutter={12} type="flex" align="middle" justify="center">
                    {action === 'add' && (
                      <Col>
                        <Button
                          loading={saving}
                          onClick={() => this.handleSubmitForm(true)}
                          className={`${styles.btnAdd} ${styles.btnNew}`}
                        >
                          <FormattedMessage id="common.save-and-new" />
                        </Button>
                      </Col>
                    )}
                    <Col>
                      <Button
                        loading={saving}
                        type="primary"
                        onClick={() => this.handleSubmitForm()}
                        className={styles.btnAdd}
                      >
                        <FormattedMessage id="common.save">
                          {txt => txt.toUpperCase()}
                        </FormattedMessage>
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </Card>
            </Form>
          </Col>
          <Col sm={12} xs={24}>
            <Card style={{ minHeight: '400px' }}>
              {map.origin && map.destination && map.waypoints ? (
                <GoogleMap
                  style={{ minHeight: '400px' }}
                  {...map}
                  onChange={this.handleGoogleMapChange}
                  distanceUnit={distanceUnit}
                />
              ) : (
                <Empty />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MileageForm;
