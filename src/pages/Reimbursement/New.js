import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Card, Col, Input, Button, Checkbox, Drawer, Modal, notification } from 'antd';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import PriceInput from '@/components/PriceInput';
import ExpenseInput from '@/components/ExpenseInput';
import BillDetail from '@/components/BillDetail';
import check from '@/components/Authorized/CheckPermissions';
import StatusBox from '@/components/StatusBox';
import ReportInfo from './components/ReportInfo';
import Summary from './components/Summary';
import ExpenseList from './components/ExpenseList';
import Popup from './components/Popup';
import styles from './New.less';
import SendEmail from './components/SendEmail';

const { TextArea } = Input;

@Form.create()
@connect(({ bill, user, loading, reimbursement }) => ({
  bill,
  user: user.currentUser,
  fetching: loading.effects['reimbursement/fetchItem'],
  saving: loading.effects['reimbursement/save'],
  reimbursement,
}))
class New extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      classNameField: { title: [], description: [] },
      visible: false,
      showPopup: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { reId },
      },
    } = this.props;
    dispatch({ type: 'reimbursement/fetchItem', payload: { reId } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/save', payload: { item: false } });
    dispatch({ type: 'bill/save', payload: { selectedList: [], tempBillList: [] } });
  }

  getAction = action => {
    let result = action ? 'saveDraft' : 'submit';
    if (check(['customer'], true, false)) {
      result = 'saveDraft';
    }
    return result;
  };

  onSave = () => {
    const {
      dispatch,
      match: {
        params: { action, reId },
      },
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    Object.assign(values, {
      ...(action === 'update' ? { _id: reId } : {}),
      action: this.getAction(values.action),
      amount: values.amount.number,
      currency: values.amount.currency,
    });

    dispatch({
      type: 'reimbursement/saveRequest',
      payload: { method: action, ...values },
    });
  };

  onCancel = () => {
    this.setState({ showPopup: false });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showNotification = (type, message) => {
    notification[type]({
      message,
    });
  };

  checkBills = (rule, value, callback) => {
    let msg;
    try {
      if (!value || value.length === 0) {
        throw new Error(formatMessage({ id: 'reimbursement.required.bill' }));
      }
    } catch (error) {
      const { message } = error;
      msg = message;
    }
    callback(msg);
  };

  handleFocus = event => {
    const {
      target: { id },
    } = event;
    const { classNameField } = this.state;
    const fields = Object.keys(classNameField);
    fields.forEach(nameField => {
      classNameField[nameField] = classNameField[nameField].filter(field => field !== 'focus');
    });
    if (fields.indexOf(id) > -1) classNameField[id].push('focus');
    this.setState({
      classNameField: {
        ...classNameField,
      },
    });
  };

  handleSubmitForm = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll(err => {
      if (err) {
        const { bills: { errors = [] } = {} } = err;
        const [billsError = {}] = errors;
        this.showNotification('warn', billsError.message);
        return;
      }
      this.setState({ showPopup: true });
    });
  };

  handleRowClick = bill => {
    const { selectedBill } = this.state;
    this.setState({ ...(selectedBill !== bill && { selectedBill: bill }), visible: true });
  };

  render() {
    const {
      form,
      user: currentUser = { location: {} },
      saving,
      fetching = true,
      reimbursement: { item },
      match: {
        params: { action },
      },
      bill: { tempBillList = [], totalAmount: amount, list = [], selectedList = [] },
    } = this.props;
    const { assign = [] } = item;
    const { getFieldDecorator, getFieldsValue } = form;
    const { classNameField, selectedBill, visible, showPopup } = this.state;
    const {
      location: { currency },
    } = currentUser;
    const titleClass = [...classNameField.title];
    const descriptionClass = [...classNameField.description];
    const itemPopup = Object.assign(
      {},
      { ...item, user: item.user || currentUser },
      getFieldsValue(),
      { bills: list.filter(e => tempBillList.includes(e._id)) }
    );

    const dummyDataReport = {
      name: 'Report 2020',
      owner: 'Phuoc Nguyen',
      number: 'PN 123',
      created: '2020-03-10T06:04:08.670Z',
      submitted: '2020-03-10T06:04:08.670Z',
    };

    const employeeInfo = {
      name: 'Phuoc Nguyen',
      id: 'K2',
      company: 'Expenso',
      location: 'VN',
      department: 'Ent',
      email: 'k2@mail.com',
      phone: '0123456789',
      manager: 'K1',
    };

    return (
      <div className={styles.root}>
        <StatusBox status="COMPLETE" />
        <StatusBox status="REJECT" />
        <StatusBox status="DRAFT" />
        <StatusBox status="INQUIRY" />
        <StatusBox status="REPORTED" />
        <ReportInfo item={dummyDataReport} employee={employeeInfo} />
        <Summary listExpenses={list} />
        <ExpenseList selectedList={selectedList} list={list} />
        <Form layout="vertical">
          <Card className={`b-r ${styles.form}`} loading={!item || fetching}>
            {item && !fetching && (
              <Row type="flex" gutter={8} justify="space-between" align="bottom">
                <Col span={12}>
                  <Form.Item
                    className={titleClass.join(' ')}
                    label={formatMessage({ id: 'common.title' })}
                  >
                    {getFieldDecorator('title', {
                      initialValue:
                        item.title || `${currentUser.fullName}, ${moment().format('LL')}`,
                      rules: [{ required: true, message: 'Title must be provided' }],
                    })(<Input disabled={action === 'view'} className={styles.input} />)}
                  </Form.Item>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Form.Item>
                    {getFieldDecorator('amount', {
                      initialValue: {
                        number: amount,
                        currency: item.currency || currency,
                      },
                    })(<PriceInput className={styles['price-input']} />)}
                  </Form.Item>
                </Col>
                {action !== 'view' && !check(['customer'], true, false) && (
                  <Col sm={18}>
                    <Form.Item>
                      {getFieldDecorator('action', {
                        initialValue: item.status === 'DRAFT',
                        valuePropName: 'checked',
                      })(
                        <Checkbox>
                          <FormattedMessage id="reimbursement.checkbox.save-draft" />
                        </Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                )}
                {check(['customer'], true, false) && (
                  <Col sm={18}>
                    <div />
                  </Col>
                )}
                {action !== 'view' && (
                  <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
                    <Form.Item>
                      <Link to="/report">
                        <Button className={styles.mr10}>
                          <FormattedMessage id="common.cancel" />
                        </Button>
                      </Link>

                      <Button loading={saving} onClick={this.handleSubmitForm} type="primary">
                        {action === 'update'
                          ? formatMessage({ id: 'reimbursement.update' })
                          : formatMessage({ id: 'reimbursement.createNew' })}
                      </Button>
                    </Form.Item>
                  </Col>
                )}
                {action !== 'update' && check(['customer'], true, false) && (
                  <Col span={12}>
                    <Form.Item className={descriptionClass.join(' ')} label="Cc:">
                      {getFieldDecorator('cc', {
                        initialValue: assign,
                      })(<SendEmail styleName={styles.select} />)}
                    </Form.Item>
                  </Col>
                )}
                <Col span={24}>
                  <Form.Item
                    className={descriptionClass.join(' ')}
                    label={formatMessage({ id: 'common.description' })}
                  >
                    {getFieldDecorator('description', {
                      initialValue: item.description,
                    })(
                      <TextArea
                        disabled={action === 'view'}
                        className={styles.input}
                        autosize={{ minRows: 1, maxRows: 8 }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    {getFieldDecorator('bills', {
                      initialValue:
                        (item.bills && item.bills.map(bill => bill._id)) || tempBillList,
                      rules: [
                        {
                          validator: this.checkBills,
                        },
                      ],
                    })(<ExpenseInput onRowClick={this.handleRowClick} />)}
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Card>
        </Form>
        <Drawer
          title={formatMessage({ id: 'reimbursement.bill-detail' })}
          placement="right"
          onClose={this.onClose}
          visible={visible}
          width={600}
          bodyStyle={{ height: '100%' }}
        >
          <BillDetail bill={selectedBill} />
        </Drawer>
        <Modal
          title={
            <Row type="flex" justify="space-between" align="middle">
              <Col>
                <h3>
                  <FormattedMessage id="reimbursement.summary" />
                </h3>
              </Col>
              <Col>
                <Button className={styles.btn} type="primary" onClick={() => this.onSave()}>
                  <FormattedMessage id="common.save" />
                </Button>
                <Button className={styles.btn} onClick={() => this.onCancel()}>
                  <FormattedMessage id="common.cancel" />
                </Button>
              </Col>
            </Row>
          }
          height="90%"
          width="90%"
          centered
          footer={null}
          closable={false}
          visible={showPopup}
          className={styles.popup}
          onClose={this.onCancel}
          onCancel={this.onCancel}
        >
          <Popup item={itemPopup} />
        </Modal>
      </div>
    );
  }
}

export default New;
