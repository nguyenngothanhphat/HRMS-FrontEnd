import React from 'react';
import { Form, DatePicker, Input, Select, Row, Col, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment, { isMoment } from 'moment';
import { isObject } from 'util';
import styles from './index.less';

const listStatus = ['PENDING', 'COMPLETE', 'INQUIRY', 'REJECT', 'DRAFT'];
const FilterFormComponent = props => {
  const { form, closeFilterForm, dispatch, yearFilter, setIsFiltering } = props;
  const { Option } = Select;
  const { getFieldDecorator } = form;
  const onReset = () => {
    form.resetFields();
    setIsFiltering(false);
    dispatch({ type: 'reimbursement/fetchRecentReport' }).then(() => closeFilterForm());
  };
  const disabledDate = current => {
    const start = moment(`${yearFilter}-01-01`, 'YYYY-MM-DD');
    return current < start;
  };
  const onFilter = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        let payload = {};
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
            case 'status':
              if (val !== undefined) {
                payload.status = [val];
                isEmpty = false;
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
          dispatch({ type: 'reimbursement/filterRecentReport', ...payload }).then(() =>
            closeFilterForm()
          );
          setIsFiltering(true);
        }
      }
    });
  };
  const converStatusText = status => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'REPORTED';
      case 'COMPLETE':
        return 'APPROVED';
      default:
        return status;
    }
  };
  return (
    <div className={styles.filterFormWrapper}>
      <Col span={24}>
        <Form>
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>
                {formatMessage({ id: 'rp.filterForm.dateOfSubmission' })}
              </span>
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
              <span className={styles.label}>
                {formatMessage({ id: 'rp.filterForm.AmountLabel' })}
              </span>
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
              <span className={styles.label}>{formatMessage({ id: 'rp.filterForm.Status' })}</span>
            </Col>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('status', {})(
                  <Select
                    placeholder={formatMessage({ id: 'rp.filterForm.SelectStatus' })}
                    allowClear
                  >
                    {listStatus.map(item => (
                      <Option key={item} value={item}>
                        {converStatusText(item)}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row gutter={12} className={styles.wrapGroupBtnAction}>
              <Col>
                <Button onClick={onFilter} className={`${styles.btnApply} ${styles.btn}`}>
                  {formatMessage({ id: 'rp.filterForm.apply' }).toUpperCase()}
                </Button>
              </Col>
              <Col>
                <Button onClick={onReset} className={`${styles.btnReset} ${styles.btn}`}>
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
