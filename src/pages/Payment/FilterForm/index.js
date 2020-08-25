import React from 'react';
import { Form, DatePicker, Input, Select, Row, Col, Button } from 'antd';
import _ from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import moment, { isMoment } from 'moment';
import { isObject } from 'util';
import styles from './index.less';

const FilterFormComponent = props => {
  const {
    form,
    closeFilterForm,
    dispatch,
    yearFilter,
    setIsFiltering,
    employeeList,
    location,
    loading,
  } = props;
  const { getFieldDecorator } = form;
  const onReset = () => {
    form.resetFields();
    setIsFiltering(false);
    dispatch({ type: 'reimbursement/fetchPaymentHistory', payload: { location } }).then(() =>
      closeFilterForm()
    );
  };
  const disabledDate = current => {
    const start = moment(`${yearFilter}-01-01`, 'YYYY-MM-DD');
    return current < start;
  };
  const getCreatorId = value => {
    const SelectData = value.toString().split(',');
    const mapping = SelectData.map(selectItem => {
      const data = selectItem.split('　[');
      const fullName = data[0];
      const email = data[1].replace(']', '');
      const item = _.filter(employeeList, { fullName, email })[0];
      return item.id;
    });
    return mapping;
  };
  const onFilter = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        let payload = { location };
        const keys = Object.keys(values);
        let isEmpty = true;
        keys.forEach(key => {
          const val = values[key];
          switch (key) {
            case 'date':
              if (isObject(val)) {
                let { $gte, $lte } = val;
                if ($gte !== undefined && isMoment($gte)) {
                  $gte = $gte.startOf('day').format();
                  isEmpty = false;
                }
                if ($lte !== undefined && isMoment($lte)) {
                  $lte = $lte
                    .startOf('day')
                    .add(1, 'days')
                    .format();
                  isEmpty = false;
                }
                if ($gte !== undefined || $lte !== undefined) {
                  payload = {
                    ...payload,
                    [key]: {
                      ...($gte && { $gte }),
                      ...($lte && { $lte }),
                    },
                  };
                }
              }
              break;
            case 'reimbursable':
            case 'amount':
              if (isObject(val)) {
                let { $gte, $lte } = val;
                if ($gte !== undefined && parseFloat($gte) > 0) {
                  $gte = parseFloat($gte);
                  isEmpty = false;
                }
                if ($lte !== undefined && parseFloat($lte) > 0) {
                  $lte = parseFloat($lte);
                  isEmpty = false;
                }
                if (
                  ($gte !== undefined && parseFloat($gte) > 0) ||
                  ($lte !== undefined && parseFloat($lte) > 0)
                ) {
                  payload = {
                    ...payload,
                    [key]: {
                      ...($gte && { $gte }),
                      ...($lte && { $lte }),
                    },
                  };
                }
              }
              break;
            case 'user':
              if (isObject(val)) {
                let { $in } = val;
                if ($in !== undefined) {
                  $in = getCreatorId($in);
                  payload = {
                    ...payload,
                    [key]: {
                      ...($in && { $in }),
                    },
                  };
                  isEmpty = false;
                }
              }
              break;
            default:
              break;
          }
        });
        if (isEmpty) {
          closeFilterForm();
          setIsFiltering(false);
        } else {
          dispatch({ type: 'reimbursement/fetchPaymentHistory', payload: { ...payload } }).then(
            () => closeFilterForm()
          );
          setIsFiltering(true);
        }
      }
    });
  };
  return (
    <div className={styles.filterFormWrapper}>
      <Col span={24}>
        <Form>
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>{formatMessage({ id: 'payment.dateOfPayment' })}</span>
            </Col>
            <Col span={10}>
              <Form.Item>
                {getFieldDecorator('date[$gte]', {})(
                  <DatePicker
                    disabledDate={disabledDate}
                    placeholder={formatMessage({ id: 'rp.filterForm.From' })}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10} style={{ marginLeft: '50px' }}>
              <Form.Item>
                {getFieldDecorator('date[$lte]', {})(
                  <DatePicker
                    disabledDate={disabledDate}
                    placeholder={formatMessage({ id: 'rp.filterForm.To' })}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>{formatMessage({ id: 'payment.totalAmount' })}</span>
            </Col>
            <Col span={10}>
              <Form.Item>
                {getFieldDecorator('amount[$gte]', {
                  getValueFromEvent: e => {
                    const convertedValue = Number(e.currentTarget.value);
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(convertedValue)) {
                      return 0;
                    }
                    return convertedValue;
                  },
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: formatMessage({ id: 'rp.filterForm.validatenumber' }),
                    },
                  ],
                  initialValue: 0,
                })(<Input placeholder={formatMessage({ id: 'rp.filterForm.From' })} />)}
              </Form.Item>
            </Col>
            <Col span={10} style={{ marginLeft: '50px' }}>
              <Form.Item>
                {getFieldDecorator('amount[$lte]', {
                  getValueFromEvent: e => {
                    const convertedValue = Number(e.currentTarget.value);
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(convertedValue)) {
                      return 0;
                    }
                    return convertedValue;
                  },
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: formatMessage({ id: 'rp.filterForm.validatenumber' }),
                    },
                  ],
                  initialValue: 0,
                })(<Input placeholder={formatMessage({ id: 'rp.filterForm.To' })} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>{formatMessage({ id: 'payment.reimbursable' })}</span>
            </Col>
            <Col span={10}>
              <Form.Item>
                {getFieldDecorator('reimbursable[$gte]', {
                  getValueFromEvent: e => {
                    const convertedValue = Number(e.currentTarget.value);
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(convertedValue)) {
                      return 0;
                    }
                    return convertedValue;
                  },
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: formatMessage({ id: 'rp.filterForm.validatenumber' }),
                    },
                  ],
                  initialValue: 0,
                })(<Input placeholder={formatMessage({ id: 'rp.filterForm.From' })} />)}
              </Form.Item>
            </Col>
            <Col span={10} style={{ marginLeft: '50px' }}>
              <Form.Item>
                {getFieldDecorator('reimbursable[$lte]', {
                  getValueFromEvent: e => {
                    const convertedValue = Number(e.currentTarget.value);
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(convertedValue)) {
                      return 0;
                    }
                    return convertedValue;
                  },
                  rules: [
                    {
                      required: true,
                      type: 'number',
                      message: formatMessage({ id: 'rp.filterForm.validatenumber' }),
                    },
                  ],
                  initialValue: 0,
                })(<Input placeholder={formatMessage({ id: 'rp.filterForm.To' })} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>
                {formatMessage({ id: 'rp.filterForm.Employee' })}
              </span>
            </Col>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('user[$in]', {})(
                  <Select
                    mode="multiple"
                    placeholder={formatMessage({ id: 'rp.filterForm.SelectEmployee' })}
                    allowClear
                    optionLabelProp="label"
                  >
                    {employeeList.map(item => {
                      // eslint-disable-next-line no-irregular-whitespace
                      const itemLabel = `${item.fullName}　[${item.email}]`;
                      return (
                        <Select.Option key={item.id} value={itemLabel} label={item.fullName}>
                          {itemLabel}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row gutter={12} className={styles.wrapGroupBtnAction}>
              <Col>
                <Button
                  loading={loading}
                  onClick={onFilter}
                  className={`${styles.btnApply} ${styles.btn}`}
                >
                  {formatMessage({ id: 'rp.filterForm.apply' }).toUpperCase()}
                </Button>
              </Col>
              <Col>
                <Button
                  loading={loading}
                  onClick={onReset}
                  className={`${styles.btnReset} ${styles.btn}`}
                >
                  {formatMessage({ id: 'rp.filterForm.reset' }).toUpperCase()}
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
    </div>
  );
};

const FilterForm = Form.create({ name: 'report_filter_form' })(FilterFormComponent);
export default FilterForm;
