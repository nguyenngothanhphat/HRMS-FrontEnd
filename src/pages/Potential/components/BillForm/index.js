import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  DatePicker,
  Skeleton,
  Checkbox,
  notification,
} from 'antd';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import AmountInput from '@/components/AmountInput';
import GroupInput from '@/components/GroupInput';
import styles from './index.less';
import CardSelect from '../CardSelect';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const noneProject = { name: 'None', _id: -1 };

@connect(
  ({
    loading,
    type,
    bill,
    exchangeRate,
    creditCard,
    customField: { listCustomField },
    project: { listProject },
  }) => ({
    type,
    loading: loading.models.bill,
    bill,
    exchangeRate,
    creditCard,
    listCustomField,
    listProject,
  })
)
@Form.create()
class BillForm extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { action },
      },
    } = this.props;
    dispatch({ type: 'type/fetch' });
    dispatch({ type: 'bill/fetchItem', payload: action });
    dispatch({ type: 'creditCard/fetch' });
    dispatch({ type: 'project/fetchByAssign' });
    dispatch({ type: 'customField/fetch' });
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      match: {
        params: { action },
      },
    } = this.props;
    // Typical usage (don't forget to compare props):
    if (action !== prevProps.match.params.action) {
      dispatch({ type: 'type/fetch' });
      dispatch({ type: 'bill/fetchItem', payload: action });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'bill/save', payload: { item: {} } });
  }

  checkType = id => {
    const {
      type: { list },
    } = this.props;
    const type = list.find(item => item.id === id);
    return type;
  };

  checkCreditCard = values => {
    const {
      creditCard: { listCard },
    } = this.props;
    const card = listCard.find(item => item._id === values.key);
    return card;
  };

  runMatching = orginList => {
    const { dispatch } = this.props;
    const listBills = [];
    const listBillsUnMatch = [];
    const transMatch = [];
    const listMatch = orginList.filter(item => item.match === true);
    listMatch.forEach(item => listBills.push(item));
    const list = orginList.filter(item => !item.match);
    list.forEach(b => {
      const data = b.transEror.find(
        r =>
          r.amount === parseFloat(b.amount) &&
          moment(r.date, 'MM/DD/YYYY').isSame(b.date, 'day') &&
          b.creditCard &&
          b.creditCard.lastName.toLowerCase() === r.lastName.toLowerCase() &&
          b.creditCard.firstName.toLowerCase() === r.firstName.toLowerCase()
      );
      if (data) {
        listBills.push({ ...b, transaction: data, match: true });
        transMatch.push(data);
      } else {
        listBillsUnMatch.push({ ...b, match: false });
      }
    });
    listBillsUnMatch.forEach(b => {
      const transEror = b.transEror.filter(
        r => !transMatch.find(itemMatch => r.amount === itemMatch.amount)
      );
      let newTrans = transEror.map(tEror => {
        let point = 0;
        if (tEror.amount === parseFloat(b.amount)) point += 1;
        if (moment(tEror.date, 'MM/DD/YYYY').isSame(b.date, 'day')) point += 1;
        if (b.creditCard) {
          if (b.creditCard.lastName.toLowerCase() === tEror.lastName.toLowerCase()) point += 1;
          if (b.creditCard.firstName.toLowerCase() === tEror.firstName.toLowerCase()) point += 1;
        }
        return { ...tEror, point };
      });
      newTrans = newTrans.sort((current, next) => next.point - current.point);
      listBills.push({ ...b, transEror: newTrans });
    });
    dispatch({ type: 'bill/save', payload: { listBills } });
  };

  handleSave = () => {
    const {
      handleCloseModal,
      form,
      bill: { listBills },
      match: {
        params: { action },
      },
      exchangeRate: { origin },
    } = this.props;
    const data = [];
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const typeObj = this.checkType(values.type);
      const creditCardObj = values.creditCard && this.checkCreditCard(values.creditCard);
      listBills.forEach(item => {
        if (item.id === action) {
          data.push({
            ...values,
            creditCard: creditCardObj,
            currency: origin,
            type: typeObj,
            amount: values.amount.number,
            id: item.id,
            transEror: item.transEror,
          });
        } else {
          data.push(item);
        }
      });
      this.runMatching(data);
    });
    notification.success({
      message: formatMessage({ id: 'bill.submit.success' }),
    });
    handleCloseModal();
  };

  checkAmount = (rule, { number, currency } = {}, callback) => {
    let msg;
    try {
      if (!number || !currency || number < 0)
        throw new Error(formatMessage({ id: 'common.required.amount' }));
    } catch ({ message }) {
      msg = message;
    }
    callback(msg);
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

  checkboxForm = ({ _id, name }) => {
    const {
      form,
      bill: { item },
    } = this.props;
    const { getFieldDecorator } = form;
    const { customFieldsData } = item || {};
    return (
      <FormItem>
        {getFieldDecorator(_id, {
          initialValue: customFieldsData ? customFieldsData[_id] : false,
          valuePropName: 'checked',
        })(<Checkbox disabled>{name}</Checkbox>)}
      </FormItem>
    );
  };

  inputForm = ({ _id, name, placeholder, mandatory }) => {
    const {
      form,
      bill: { item },
    } = this.props;
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
        })(<Input placeholder={placeholder} disabled />)}
      </FormItem>
    );
  };

  numberForm = ({ _id, name, placeholder, mandatory }) => {
    const {
      form,
      bill: { item },
    } = this.props;
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
        })(<Input placeholder={placeholder} type="number" disabled />)}
      </FormItem>
    );
  };

  dateForm = ({ _id, name, mandatory }) => {
    const {
      form,
      bill: { item },
    } = this.props;
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
            disabled
          />
        )}
      </FormItem>
    );
  };

  render() {
    const {
      form,
      type: { list = [] },
      bill: {
        item: {
          type = {},
          description = '',
          date = Date.now(),
          amount,
          currency = 'INR',
          group = '',
          reimbursable = true,
          creditCard,
          paymentOption = 'cash',
          project = noneProject,
          billable = false,
        },
      },
      loading = true,
      listProject = [],
      listCustomField = [],
    } = this.props;
    const newListProject = [noneProject, ...listProject];
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const typeItem = getFieldValue('type');
    const listField = listCustomField.filter(i => i.expenseType.id === typeItem);
    const paymentType = getFieldValue('paymentOption');
    const projectItem = getFieldValue('project');
    let listType = list.map(t => ({
      ...t,
      type: !t.parent ? t.type : `${t.parent.type} / ${t.type}`,
    }));
    listType = listType.sort((first, next) => first.type.localeCompare(next.type));

    return (
      <Form className={styles.root} layout="horizontal">
        <Skeleton loading={loading} active>
          <Row gutter={12}>
            <Col span={24} className={styles.form1}>
              <Card>
                <FormItem label={formatMessage({ id: 'common.amount' })}>
                  {getFieldDecorator('amount', {
                    initialValue: { currency, number: amount },
                    rules: [
                      {
                        validator: this.checkAmount,
                      },
                    ],
                    validateTrigger: '',
                  })(<AmountInput />)}
                </FormItem>
                <Row gutter={24}>
                  <Col span={16}>
                    <FormItem label={formatMessage({ id: 'common.description' })}>
                      {getFieldDecorator('description', {
                        initialValue: description,
                      })(
                        <TextArea
                          className={styles.input}
                          autosize={{ minRows: 1, maxRows: 4 }}
                          disabled
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={formatMessage({ id: 'common.expense-date' })}>
                      {getFieldDecorator('date', {
                        initialValue: moment(date),
                        rules: [
                          {
                            required: true,
                            message: formatMessage({
                              id: 'bill.required.date',
                            }),
                          },
                        ],
                      })(<DatePicker className={styles.date} style={{ width: '100%' }} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={16}>
                    <FormItem label={formatMessage({ id: 'bill.project' })}>
                      {getFieldDecorator('project', {
                        initialValue: project._id,
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
                <FormItem label={formatMessage({ id: 'common.expense-type' })}>
                  {getFieldDecorator('type', {
                    initialValue: type.id,
                    rules: [{ required: true, message: 'Type must be provided' }],
                  })(
                    <Select
                      placeholder={formatMessage({ id: 'bill.select.type.placeholder' })}
                      className={styles.select}
                      disabled
                    >
                      {listType.map(t => (
                        <Option key={t.id} value={t.id}>
                          {t.type}
                        </Option>
                      ))}
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
                  })(<GroupInput disabled />)}
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
                      disabled
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
                      initialValue: creditCard && { key: creditCard._id, label: creditCard.name },
                    })(
                      <CardSelect
                        placeholder={formatMessage({ id: 'creditCard.select.placeholder' })}
                        className={styles.select}
                        disabled={!creditCard}
                      />
                    )}
                  </FormItem>
                )}
                <Form.Item>
                  {getFieldDecorator('reimbursable', {
                    initialValue: reimbursable,
                    valuePropName: 'checked',
                  })(<Checkbox disabled> {formatMessage({ id: 'common.reimbursable' })}</Checkbox>)}
                </Form.Item>
                <FormItem>
                  <Row gutter={12} type="flex" align="middle" justify="center">
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => this.handleSave()}
                        className={styles.btnAdd}
                      >
                        {formatMessage({ id: 'common.save' }).toUpperCase()}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </Card>
            </Col>
          </Row>
        </Skeleton>
      </Form>
    );
  }
}

export default BillForm;
