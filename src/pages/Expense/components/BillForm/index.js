import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Button, Select, Input, DatePicker, Skeleton, Checkbox } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import AmountInput from '@/components/AmountInput';
import GroupInput from '@/components/GroupInput';
import ImagesUpload from '@/components/ImagesUpload';
import CardSelect from '@/components/CardSelect';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const noneProject = { name: 'None', _id: -1 };

@Form.create()
@connect(
  ({
    project: { listProject },
    exchangeRate = {},
    loading,
    customField: { listCustomField },
    user: { currentUser },
  }) => ({
    listProject,
    exchangeRate,
    listCustomField,
    currentUser,
    submitting: loading.effects['bill/submit'],
  })
)
class BillForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { searchType: '', listFieldItem: [], listRecently: [] };
  }

  componentDidMount() {
    const {
      dispatch,
      currentUser: {
        location: { _id },
      },
    } = this.props;
    const list = localStorage.getItem('recentlyTypes');
    if (list !== null) {
      this.setState({ listRecently: JSON.parse(list) });
    }
    dispatch({ type: 'type/fetch', payload: { location: _id } });
    dispatch({ type: 'project/fetchByAssign', payload: { location: _id } });
    dispatch({ type: 'customField/fetch' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'exchangeRate/save', payload: { rate: {} } });
    dispatch({ type: 'bill/save', payload: { item: {} } });
  }

  handleSubmitForm = (saveAndNew = false) => {
    const {
      form,
      match: {
        params: { action },
      },
      listCustomField = [],
    } = this.props;
    const { listFieldItem, listRecently = [] } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { reimbursable = false } = values;
      let formData = {
        ...values,
        method: 'submit',
        reimbursable,
      };
      const { dispatch } = this.props;
      if (action !== 'add') {
        formData = {
          ...formData,
          method: 'update',
          expenseID: action,
        };
      }
      const customFieldsData = {};
      const originListField = listCustomField.filter(i => i.expenseType.id === values.type);
      const listField = listFieldItem.length > 0 ? listFieldItem : originListField;

      const newListRecently = [values.type, ...listRecently];
      const listFilter = newListRecently.filter(
        (value, index, self) => self.findIndex(s => s === value) === index
      );
      if (listFilter.length > 3) {
        listFilter.pop();
      }
      localStorage.setItem('recentlyTypes', JSON.stringify(listFilter));
      const filter = {
        amount({
          originalNumber: originAmount,
          original: originCurrency,
          rate: exchangeRate,
          number: amount,
          currency,
        }) {
          formData = {
            ...formData,
            originAmount,
            originCurrency,
            exchangeRate,
            amount,
            currency,
          };
        },
        date(v) {
          formData = {
            ...formData,
            date: v.toDate().toString(),
          };
        },
        group(group) {
          if (group && typeof group._id === 'number') {
            formData = {
              ...formData,
              group: group._id,
            };
          }
        },
        creditCard(v) {
          if (v && v.key) {
            formData = {
              ...formData,
              creditCard: v.key,
            };
          }
        },
      };
      Object.keys(values).forEach(field => {
        listField.forEach(i => {
          if (i._id === field) {
            customFieldsData[field] = values[field];
          }
        });
        const val = values[field];
        if (val) {
          const fc = filter[field];
          if (fc) fc(val);
        }
      });
      formData = {
        ...formData,
        project: values.project === -1 ? undefined : values.project,
        customFieldsData,
      };
      dispatch({ type: 'bill/submit', payload: { formData, saveAndNew } });
    });
  };

  checkAmount = (rule, amount, callback) => {
    let msg;
    const filter = [
      v => ({
        check: !v,
        message: formatMessage({ id: 'bill.required.amount' }),
      }),
      ({ original }) => ({
        check: typeof original !== 'string',
        message: formatMessage({ id: 'bill.required.originalCurrency' }),
      }),
      ({ rate, original, currency }) => ({
        check: original !== currency && typeof rate !== 'number',
        message: formatMessage({ id: 'bill.invalid.exchangeRate' }),
      }),
      ({ originalNumber }) => ({
        check: !originalNumber || originalNumber < 0,
        message: formatMessage({ id: 'bill.required.originalAmount' }),
      }),
      ({ number }) => ({
        check: !number || number < 0,
        message: formatMessage({ id: 'bill.required.amount' }),
      }),
      ({ originalNumber, original, currency }) => ({
        check: original !== currency && originalNumber > 10000000000,
        message: formatMessage({ id: 'bill.max.originalAmount' }, { max: 10000000000 }),
      }),
      ({ number }) => ({
        check: number > 100000000000,
        message: formatMessage({ id: 'bill.max.amount' }, { max: 10000000000 }),
      }),
      ({ number }) => ({
        check: number < 0.0001,
        message: formatMessage({ id: 'bill.min.amount' }),
      }),
    ];
    const result = filter.some(fc => {
      const { check, message } = fc(amount);
      msg = message;
      return check;
    });
    if (!result) msg = undefined;
    callback(msg);
  };

  changeDate = async () => {
    const { dispatch, form } = this.props;
    const selectedCurrency = await form.getFieldValue('amount');
    const selectedDate = await form.getFieldValue('date');
    await dispatch({
      type: 'exchangeRate/fetchRate',
      payload: {
        original: selectedCurrency.original,
        byPass: true,
        date: selectedDate ? selectedDate.toString() : '',
      },
    });
  };

  deduplicate = arr => {
    const set = new Set(arr);
    return [...set];
  };

  getTypeName = id => {
    const {
      type: { list = [] },
    } = this.props;
    if (id) {
      return list.find(item => item.id === id).type || '';
    }
    return '';
  };

  onSearchType = value => {
    this.setState({ searchType: value });
  };

  onSelectType = item => {
    const { listCustomField = [] } = this.props;
    const list = listCustomField.filter(i => i.expenseType.id === item);
    this.setState({ searchType: '', listFieldItem: list });
  };

  checkboxForm = ({ _id, name }) => {
    const { form, item } = this.props;
    const { getFieldDecorator } = form;
    const { customFieldsData } = item || {};
    return (
      <FormItem>
        {getFieldDecorator(_id, {
          initialValue: customFieldsData ? customFieldsData[_id] : false,
          valuePropName: 'checked',
        })(<Checkbox>{name}</Checkbox>)}
      </FormItem>
    );
  };

  inputForm = ({ _id, name, placeholder, mandatory }) => {
    const { form, item } = this.props;
    const { getFieldDecorator } = form;
    const { customFieldsData } = item || {};
    return (
      <FormItem label={name}>
        {getFieldDecorator(_id, {
          initialValue: customFieldsData && customFieldsData[_id],
          rules: [
            {
              required: mandatory,
              message: `${name} must be provide`,
            },
          ],
        })(<Input placeholder={placeholder} />)}
      </FormItem>
    );
  };

  numberForm = ({ _id, name, placeholder, mandatory }) => {
    const { form, item } = this.props;
    const { getFieldDecorator } = form;
    const { customFieldsData } = item || {};
    return (
      <FormItem label={name}>
        {getFieldDecorator(_id, {
          initialValue: customFieldsData && customFieldsData[_id],
          rules: [
            {
              required: mandatory,
              message: `${name} must be provide`,
            },
          ],
        })(<Input placeholder={placeholder} type="number" />)}
      </FormItem>
    );
  };

  dateForm = ({ _id, name, mandatory }) => {
    const { form, item } = this.props;
    const { getFieldDecorator } = form;
    const { customFieldsData } = item || {};
    return (
      <FormItem label={name}>
        {getFieldDecorator(_id, {
          initialValue: customFieldsData ? moment(customFieldsData[_id]) : '',
          rules: [
            {
              required: mandatory,
              message: `${name} must be provide`,
            },
          ],
        })(
          <DatePicker
            className={styles.date}
            style={{ width: '100%' }}
            onChange={this.changeDate}
          />
        )}
      </FormItem>
    );
  };

  getTypeName = (list, id) => {
    const result = list.find(i => i.id === id);
    return result && result.type;
  };

  render() {
    const {
      form,
      type: { list = [] },
      exchangeRate: { currency: systemCurrency },
      item,
      match: {
        params: { action },
      },
      loading = true,
      listProject = [],
      submitting,
      listCustomField = [],
    } = this.props;

    const { searchType, listFieldItem, listRecently = [] } = this.state;
    const newListProject = [noneProject, ...listProject];
    const {
      type = {},
      description = '',
      date = Date.now(),
      amount: number,
      currency = systemCurrency,
      exchangeRate: rate = 1,
      originAmount: originalNumber = number,
      originCurrency: original = currency,
      images = [],
      group = '',
      reimbursable = true,
      billable = true,
      creditCard,
      paymentOption = 'cash',
      project = noneProject,
      vendor = '',
    } = item || {};
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const paymentType = getFieldValue('paymentOption');
    const projectItem = getFieldValue('project');
    const typeItem = getFieldValue('type');
    let listType = list.map(t => ({
      ...t,
      type: !t.parent ? t.type : `${t.parent.type} / ${t.type}`,
    }));
    listType = listType.sort((first, next) => first.type.localeCompare(next.type));
    const selectedDate = form.getFieldValue('date');
    const originListField = listCustomField.filter(i => i.expenseType.id === typeItem);
    const listField = listFieldItem.length > 0 ? listFieldItem : originListField;
    return (
      <Form className={styles.root} layout="horizontal">
        <Skeleton loading={loading} active>
          {item && (
            <Row gutter={12}>
              <Col sm={14} xs={24} className={styles.form1}>
                <Card>
                  <FormItem
                    label={
                      <span>
                        <span className={styles.asterisk}>* </span>
                        {formatMessage({ id: 'bill.amount' })}
                      </span>
                    }
                  >
                    {getFieldDecorator('amount', {
                      initialValue: {
                        currency,
                        number,
                        originalNumber,
                        rate,
                        original,
                      },
                      rules: [
                        {
                          validator: this.checkAmount,
                        },
                      ],
                    })(<AmountInput selectedDate={selectedDate} />)}
                  </FormItem>
                  <Row gutter={24}>
                    <Col span={16}>
                      <FormItem label={formatMessage({ id: 'bill.description' })}>
                        {getFieldDecorator('description', {
                          initialValue: description,
                        })(
                          <TextArea
                            className={styles.input}
                            autosize={{ minRows: 1, maxRows: 4 }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label={formatMessage({ id: 'bill.form.expense-date' })}>
                        {getFieldDecorator('date', {
                          initialValue: moment(date),
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: 'bill.required.date' }),
                            },
                          ],
                        })(
                          <DatePicker
                            className={styles.date}
                            style={{ width: '100%' }}
                            onChange={this.changeDate}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem label={formatMessage({ id: 'bill.vendor' })}>
                    {getFieldDecorator('vendor', {
                      initialValue: vendor,
                    })(<Input />)}
                  </FormItem>
                  <Row gutter={24}>
                    <Col span={16}>
                      <FormItem label={formatMessage({ id: 'bill.project' })}>
                        {getFieldDecorator('project', {
                          initialValue: project ? project._id : -1,
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: 'bill.select.project.required' }),
                            },
                          ],
                        })(
                          <Select
                            placeholder={formatMessage({ id: 'bill.select.project.placeholder' })}
                            className={styles.select}
                            showSearch
                            filterOption={(input, option) =>
                              typeof option.props.children === 'string' &&
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                            }
                          >
                            {newListProject.map(p => (
                              <Option key={p._id} value={p._id}>
                                {p.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      {projectItem !== -1 && (
                        <FormItem colon={false} label=" ">
                          {getFieldDecorator('billable', {
                            initialValue: billable,
                            valuePropName: 'checked',
                          })(
                            <Checkbox>
                              <FormattedMessage id="category.billable" />
                            </Checkbox>
                          )}
                        </FormItem>
                      )}
                    </Col>
                  </Row>
                  <FormItem label={formatMessage({ id: 'bill.type' })}>
                    {getFieldDecorator('type', {
                      initialValue: type.id,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'bill.select.type.required' }),
                        },
                      ],
                    })(
                      <Select
                        placeholder={formatMessage({ id: 'bill.select.type.placeholder' })}
                        className={styles.select}
                        onSearch={this.onSearchType}
                        onSelect={this.onSelectType}
                        showSearch
                        filterOption={(input, option) =>
                          typeof option.props.children === 'string' &&
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                        }
                      >
                        {searchType === '' && (
                          <OptGroup label={formatMessage({ id: 'common.recently' })}>
                            {listRecently.map(t => (
                              <Option key={t} value={t}>
                                {this.getTypeName(list, t)}
                              </Option>
                            ))}
                          </OptGroup>
                        )}
                        <OptGroup label="All Types">
                          {listType.map(t => (
                            <Option key={t.id} value={t.id}>
                              {t.type}
                            </Option>
                          ))}
                        </OptGroup>
                      </Select>
                    )}
                  </FormItem>
                  {listField.map(i => {
                    switch (i.type) {
                      case 'checkbox':
                        return this.checkboxForm(i);
                      case 'date':
                        return this.dateForm(i);
                      case 'text':
                        return this.inputForm(i);
                      case 'number':
                        return this.numberForm(i);
                      default:
                        return '';
                    }
                  })}
                  <FormItem label={formatMessage({ id: 'common.tag' })}>
                    {getFieldDecorator('group', {
                      initialValue: group,
                    })(<GroupInput />)}
                  </FormItem>
                  <FormItem label={formatMessage({ id: 'bill.payment-option' })}>
                    {getFieldDecorator('paymentOption', {
                      initialValue: paymentOption,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'bill.payment-option.required' }),
                        },
                      ],
                    })(
                      <Select
                        placeholder={formatMessage({ id: 'bill.payment-option.placeholder' })}
                        className={styles.select}
                        onChange={value => {
                          if (['cash', 'credit card'].indexOf(value) > -1) {
                            setFieldsValue({ reimbursable: true });
                          } else {
                            setFieldsValue({ reimbursable: false });
                          }
                        }}
                      >
                        <Option value="cash">{formatMessage({ id: 'bill.cash' })}</Option>
                        <Option value="credit card">
                          {formatMessage({ id: 'bill.credit-card' })}
                        </Option>
                        <Option value="company cc">
                          {formatMessage({ id: 'bill.company-credit-card' })}
                        </Option>
                        <Option value="company cash">
                          {formatMessage({ id: 'bill.company-cash' })}
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                  {paymentType === 'company cc' && (
                    <FormItem label={formatMessage({ id: 'bill.form.creditCard' })}>
                      {getFieldDecorator('creditCard', {
                        initialValue: creditCard && {
                          key: creditCard._id,
                          label: creditCard.name,
                        },
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'bill.creditCard.required' }),
                          },
                        ],
                      })(
                        <CardSelect
                          placeholder={formatMessage({ id: 'creditCard.select.placeholder' })}
                          className={styles.select}
                        />
                      )}
                    </FormItem>
                  )}

                  {['cash', 'credit card'].indexOf(paymentType) > -1 && (
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
                  )}

                  <FormItem>
                    <Row gutter={12} type="flex" align="middle" justify="center">
                      {action === 'add' && (
                        <Col>
                          <Button
                            loading={submitting}
                            onClick={() => this.handleSubmitForm(true)}
                            className={`${styles.btnAdd} ${styles.btnNew}`}
                          >
                            <FormattedMessage id="common.save-and-new" />
                          </Button>
                        </Col>
                      )}
                      <Col>
                        <Button
                          type="primary"
                          loading={submitting}
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
              </Col>
              <Col sm={10} xs={24} className={styles.form2}>
                <Card>
                  {getFieldDecorator('images', {
                    initialValue: images,
                  })(<ImagesUpload />)}
                </Card>
              </Col>
            </Row>
          )}
        </Skeleton>
      </Form>
    );
  }
}

export default BillForm;
