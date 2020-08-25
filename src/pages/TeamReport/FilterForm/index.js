/* eslint-disable no-param-reassign */
import React from 'react';
import { Form, DatePicker, Input, Row, Col, Button, Select } from 'antd';
import _ from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { isMoment } from 'moment';
import { isObject } from 'util';
import styles from './index.less';

const listStatus = ['PENDING', 'COMPLETE', 'INQUIRY', 'REJECT', 'DRAFT'];
const FilterFormComponent = props => {
  const { form, applyFilter, filter, resetFilter, employeeList, listLocation } = props;
  const { getFieldDecorator } = form;
  let isStatusDisable = true;
  if (filter.currentMenuFilter !== 'pendingByUser') {
    isStatusDisable = false;
  }
  const onReset = () => {
    form.resetFields();
    resetFilter(filter);
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
        let payload = { ...filter };
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
                payload.status = val;
                isEmpty = false;
              }
              break;
            case 'location':
              if (val !== undefined) {
                payload.location = val;
                isEmpty = false;
              }
              break;
            case 'creators':
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
          resetFilter(payload);
        } else {
          applyFilter(payload);
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
              <span className={styles.label}>
                {formatMessage({ id: 'rp.filterForm.dateOfSubmission' })}
              </span>
            </Col>
            <Col span={10}>
              <Form.Item>
                {getFieldDecorator('date[$gte]', {})(
                  <DatePicker placeholder={formatMessage({ id: 'rp.filterForm.From' })} />
                )}
              </Form.Item>
            </Col>
            <Col span={10} style={{ marginLeft: '50px' }}>
              <Form.Item>
                {getFieldDecorator('date[$lte]', {})(
                  <DatePicker placeholder={formatMessage({ id: 'rp.filterForm.To' })} />
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
          {isStatusDisable ? null : (
            <Row>
              <Col span={24} className={styles.wrapLabel}>
                <span className={styles.label}>
                  {formatMessage({ id: 'rp.filterForm.Status' })}
                </span>
              </Col>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('status', {})(
                    <Select
                      mode="multiple"
                      placeholder={formatMessage({ id: 'rp.filterForm.SelectStatus' })}
                      allowClear
                      disabled={isStatusDisable}
                    >
                      {listStatus.map(item => (
                        <Select.Option key={item} value={item}>
                          {item === 'PENDING' ? 'REPORTED' : item}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>
                {formatMessage({ id: 'rp.filterForm.Employee' })}
              </span>
            </Col>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('creators[$in]', {})(
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
          <Row>
            <Col span={24} className={styles.wrapLabel}>
              <span className={styles.label}>
                {formatMessage({ id: 'rp.filterForm.Location' })}
              </span>
            </Col>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('location', {})(
                  <Select
                    showSearch
                    placeholder={formatMessage({ id: 'rp.filterForm.SelectLocation' })}
                    allowClear
                  >
                    {listLocation.map(item => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.country ? item.country.name : ''}
                      </Select.Option>
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
