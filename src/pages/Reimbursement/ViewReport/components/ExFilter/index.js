/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { DatePicker, Form, Row, Col, Input, Select, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
// import moment from 'moment';
import { capitalizeFirstLetter } from '@/utils/utils';
import styles from './index.less';

const { Item: FormItem } = Form;
const { Group: InputGroup } = Input;
const { Option, OptGroup } = Select;
const dateFormat = 'MMM DD YYYY';

@connect(
  ({
    group: { listGroup },
    type: { list: listOfType },
    bill: { filter },
    project: { listProject },
    user,
    appSetting,
  }) => ({
    listGroup,
    listOfType,
    filter,
    listProject,
    user,
    appSetting,
  })
)
@Form.create()
class Filter extends Component {
  componentDidMount() {
    const {
      dispatch,
      user: { currentUser: { location: { _id: locationId = '' } = {} } = {} } = {},
    } = this.props;
    dispatch({ type: 'group/fetchGroup' });
    dispatch({ type: 'type/fetch', payload: { location: locationId } });
  }

  resetFilter = () => {
    const { form, closeFilter, onReset = () => {} } = this.props;
    onReset();
    closeFilter();
    form.resetFields();
  };

  processData = values => {
    const {
      date: [gteDate, lteDate] = [],
      amount: [gteAmount, lteAmount] = [],
      type = [],
      tag = [],
      project = [],
      paymentOption = [],
      reimbursable = false,
      billable = false,
    } = values;

    return {
      ...(gteDate || lteDate
        ? {
            updatedAt: {
              ...(gteDate
                ? {
                    $gte: gteDate
                      .zone('+00:00')
                      .startOf('day')
                      .toISOString(),
                  }
                : {}),
              ...(lteDate
                ? {
                    $lte: lteDate
                      .zone('+00:00')
                      .endOf('day')
                      .toISOString(),
                  }
                : {}),
            },
          }
        : {}),
      ...(gteAmount || lteAmount
        ? {
            amount: {
              ...(gteAmount ? { $gte: parseInt(gteAmount, 10) } : {}),
              ...(lteAmount ? { $lte: parseInt(lteAmount, 10) } : {}),
            },
          }
        : {}),
      ...(type.length > 0 ? { type: { $in: type } } : {}),
      ...(tag.length > 0 ? { tag: { $in: tag } } : {}),
      ...(project.length > 0 ? { project: { $in: project } } : {}),
      ...(paymentOption.length > 0 ? { paymentOption: { $in: paymentOption } } : {}),
      ...(reimbursable ? { reimbursable: { $eq: reimbursable } } : {}),
      ...(billable ? { billable: { $eq: billable } } : {}),
    };
  };

  handleSubmitForm = e => {
    const {
      form: { validateFieldsAndScroll },
      closeFilter,
      list,
      onFilter = () => {},
    } = this.props;
    e.preventDefault();
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { date: [gteDate, lteDate] = [], amount: [gteAmount, lteAmount] = [] } = values;
        const options = this.processData(values);
        if (Object.keys(options).length > 0) {
          const filteredList = list.filter(nItem => {
            const obj = {};
            const object = Object.keys(nItem);
            for (const i in options) {
              object.forEach(val => {
                if (val === i) {
                  if (i === 'amount') {
                    if (gteAmount && lteAmount) {
                      if (nItem[val] >= gteAmount && nItem[val] <= lteAmount) {
                        obj[val] = nItem[val];
                      }
                    } else if (!gteAmount) {
                      if (nItem[val] <= lteAmount) {
                        obj[val] = nItem[val];
                      }
                    } else if (!lteAmount) {
                      if (nItem[val] >= gteAmount) {
                        obj[val] = nItem[val];
                      }
                    }
                  }
                  if (i === 'billable' || i === 'reimbursable') {
                    if (nItem[val]) {
                      obj[val] = nItem[val];
                    }
                  }
                  if (i === 'tag' || i === 'project') {
                    if (values[i].includes(nItem[val]._id || '')) {
                      obj[val] = nItem[val];
                    }
                  }
                  if (i === 'type' || i === 'paymentOption') {
                    if (values[i].includes(nItem[val] || '')) {
                      obj[val] = nItem[val];
                    }
                  }
                } else if (i === 'updatedAt' && val === 'date') {
                  const dateCheck = new Date(nItem[val || 'createdAt']);
                  const fgDay = new Date(gteDate || '');
                  const ltDay = new Date(lteDate || '');
                  if (gteDate && lteDate) {
                    if (
                      (dateCheck.getTime() > fgDay.getTime() &&
                        dateCheck.getTime() < ltDay.getTime()) ||
                      dateCheck.getTime() === fgDay.getTime() ||
                      dateCheck.getTime() === ltDay.getTime()
                    ) {
                      obj[val] = nItem[val];
                    }
                  } else if (!gteDate) {
                    if (
                      dateCheck.getTime() < ltDay.getTime() ||
                      dateCheck.getTime() === ltDay.getTime()
                    ) {
                      obj[val] = nItem[val];
                    }
                  } else if (!lteDate) {
                    if (
                      dateCheck.getTime() > fgDay.getTime() ||
                      dateCheck.getTime() === fgDay.getTime()
                    ) {
                      obj[val] = nItem[val];
                    }
                  }
                }
              });
            }
            if (Object.keys(obj).length > 0) {
              if (Object.keys(obj).length !== Object.keys(options).length) {
                const cObject = Object.keys(options).filter(sItem => {
                  return sItem === 'billable' || sItem === 'reimbursable';
                });
                if (cObject.length === 2) {
                  return Object.keys(obj).length === Object.keys(options).length - 1;
                }
                return true;
              }
              return true;
            }
            return false;
          });
          onFilter(filteredList);
        }
        closeFilter();
      }
    });
  };

  getCategories = data => {
    const temp = [];
    data.forEach(item => {
      const { children, name } = item;
      if (children.length > 0) {
        temp.push(
          ...children.map(i => {
            return { _id: i._id, childrenName: i.name, name };
          })
        );
      }
    });
    return temp;
  };

  render() {
    const {
      form: { getFieldDecorator },
      listGroup,
      filter,
      listProject,
      appSetting,
      // listGroup,
      listOfType,
    } = this.props;
    const { date = {} } = filter;
    const {
      expenseType: { dynamic: listExpenseType = [] } = {},
      paymentOptions: { personal = [], company = [] } = {},
    } = appSetting;
    const categories = this.getCategories(listExpenseType).concat(listExpenseType);

    return (
      <div className={styles.root}>
        <Form onSubmit={this.handleSubmitForm} className={styles.form}>
          <FormItem label={formatMessage({ id: 'filter.date.range' })}>
            <InputGroup compact>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('date.0', {
                    initialValue: date[0] || null,
                  })(
                    <DatePicker
                      className={styles.input}
                      style={{ width: '100%' }}
                      format={dateFormat}
                      allowClear
                      // disabledDate={this.disabledDate}
                    />
                  )}
                </Col>
                <Col span={10} offset={4}>
                  {getFieldDecorator('date.1', {
                    initialValue: date[1] || null,
                  })(
                    <DatePicker
                      className={styles.input}
                      style={{ width: '100%' }}
                      format={dateFormat}
                      allowClear
                      // disabledDate={this.disabledDate}
                    />
                  )}
                </Col>
              </Row>
            </InputGroup>
          </FormItem>
          <FormItem label={formatMessage({ id: 'filter.amount.range' })}>
            <InputGroup compact>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('amount.0', {
                    initialValue: filter.amount && filter.amount[0],
                  })(
                    <Input
                      type="number"
                      className={styles.input}
                      placeholder={formatMessage({ id: 'filter.from' })}
                      allowClear
                    />
                  )}
                </Col>
                <Col span={10} offset={4}>
                  {getFieldDecorator('amount.1', {
                    initialValue: filter.amount && filter.amount[1],
                  })(
                    <Input
                      type="number"
                      className={styles.input}
                      placeholder={formatMessage({ id: 'filter.to' })}
                      allowClear
                    />
                  )}
                </Col>
              </Row>
            </InputGroup>
          </FormItem>
          <FormItem label={formatMessage({ id: 'filter.select.category' }, { format: 0 })}>
            {getFieldDecorator('type', {
              initialValue: listOfType || filter.type,
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'filter.select.type.placeholder' })}
                className={styles.select}
                allowClear
                filterOption={(input, option) =>
                  typeof option.props.children === 'string' &&
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
              >
                {categories
                  .sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                  })
                  .map(t => {
                    const { name, _id, childrenName = '' } = t;
                    return (
                      <Option
                        key={_id}
                        value={`${childrenName ? `${name} / ${childrenName}` : `${name}`}`}
                      >
                        {`${childrenName ? `${name} / ${childrenName}` : `${name}`}`}
                      </Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'bill.group' })}>
            {getFieldDecorator('tag', {
              initialValue: filter.tag,
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'filter.select.group.placeholder' })}
                className={styles.select}
                allowClear
                filterOption={(input, option) =>
                  typeof option.props.children === 'string' &&
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
              >
                {listGroup
                  .sort((a, b) => {
                    if (a.groupName < b.groupName) return -1;
                    if (a.groupName > b.groupName) return 1;
                    return 0;
                  })
                  .map(({ _id, groupName }) => (
                    <Option key={_id} value={_id}>
                      {groupName}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <Form.Item label={formatMessage({ id: 'reimbursement.projects' })}>
            {getFieldDecorator('project', {
              initialValue: filter.project,
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'reimbursement.projects.placeholder' })}
                allowClear
                filterOption={(input, option) =>
                  typeof option.props.children === 'string' &&
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
              >
                {listProject.map(item => {
                  const { name, _id } = item;
                  return (
                    <Option key={_id} value={_id}>
                      {name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <FormItem label={formatMessage({ id: 'bill.payment-option' })}>
            {getFieldDecorator('paymentOption', {
              initialValue: filter.paymentOption,
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'bill.payment-option.placeholder' })}
                className={styles.select}
                allowClear
              >
                <OptGroup label={formatMessage({ id: 'bill.personal' })}>
                  {personal.map(item => {
                    const { name = '' } = item;
                    const displayName = name
                      .split(' ')
                      .map(i => capitalizeFirstLetter(i))
                      .join(' ');
                    return <Option key={name}>{displayName}</Option>;
                  })}
                </OptGroup>
                <OptGroup label={formatMessage({ id: 'bill.company' })}>
                  {company.map(item => {
                    const { name = '' } = item;
                    const displayName = name
                      .split(' ')
                      .map(i => capitalizeFirstLetter(i))
                      .join(' ');
                    return <Option key={name}>{displayName}</Option>;
                  })}
                </OptGroup>
              </Select>
            )}
          </FormItem>
          <Row type="flex">
            <Col className={styles.mr_42}>
              <FormItem>
                {getFieldDecorator('billable', {
                  valuePropName: 'checked',
                  initialValue: filter.billable,
                })(<Checkbox>{formatMessage({ id: 'bill.billable' })}</Checkbox>)}
              </FormItem>
            </Col>
            <Col>
              <FormItem>
                {getFieldDecorator('reimbursable', {
                  valuePropName: 'checked',
                  initialValue: filter.reimbursable,
                })(<Checkbox>{formatMessage({ id: 'bill.reimbursable' })}</Checkbox>)}
              </FormItem>
            </Col>
          </Row>
          <div className={styles.controlButton}>
            <Button className={styles.btnApply} type="primary" htmlType="submit">
              <FormattedMessage id="filter.btn.submit" />
            </Button>
            <Button className={styles.btnReset} onClick={this.resetFilter}>
              <FormattedMessage id="filter.btn.reset" />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Filter;
