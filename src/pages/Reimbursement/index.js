import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Button,
  Dropdown,
  Menu,
  Layout,
  Skeleton,
  // Modal,
  Form,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
// import AmountInput from '@/components/AmountInput';
import check from '@/components/Authorized/CheckPermissions';
import ReimTable from '@/components/ReimTable';
import styles from './index.less';
import ExportExcel from './components/ExportExcel';
import ExportPDF from './components/ExportPDF';
import History from './components/History';

@connect(
  ({
    reimbursement,
    user: {
      currentUser,
      currentUser: {
        location: { currency },
      },
    },
    loading,
    setting: {
      item: { appearance, name: companyName },
    },
  }) => ({
    reimbursement,
    currentUser,
    fetching: loading.effects['reimbursement/fetch'],
    appearance,
    companyName,
    currency,
  })
)
@Form.create()
class Reimbursement extends PureComponent {
  // state = { visible: false };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { type = 'request' },
      },
    } = this.props;
    if (type !== 'approval') {
      dispatch({ type: 'reimbursement/fetch', payload: { method: 'approval' } });
    }
    dispatch({ type: 'setting/fetch' });
  }

  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  // handleOk = () => {
  //   const {
  //     currentUser: user,
  //     reimbursement: { selectedList },
  //     match: {
  //       params: { type = 'request' },
  //     },
  //     appearance,
  //     companyName,
  //     currency,
  //   } = this.props;
  //   console.log('handleOk currency', currency);
  //   const { docLogo } = appearance;
  //   const currentSelectedList = selectedList[type];
  //   const { form } = this.props;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       this.setState({
  //         visible: false,
  //       });
  //       ExportPDF(currentSelectedList, user, values, docLogo, companyName, currency);
  //     }
  //   });
  // };

  // handleCancel = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  parseBill = listBill => {
    const result = [];
    listBill.forEach(bill => result.push(bill.type || bill.mileage.type));
    return result.join(', ');
  };

  getBillData = data => {
    const billData = [];
    data.forEach(report => {
      billData.push(
        ...[{ reportId: report.id, amount: report.amount }, ...report.bills, { space: true }]
      );
    });
    return billData;
  };

  exportPDF = currentSelectedList => {
    const { appearance, companyName } = this.props;
    const { docLogo } = appearance;
    // if (check(['finance'], true, false)) {
    //   this.showModal();
    // } else {
    ExportPDF(currentSelectedList, docLogo, companyName);
    // }
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

  handleDropMenuClick = ({ key }) => {
    if (key !== 'excel' && key !== 'pdf') {
      const {
        reimbursement: { selectedList },
        dispatch,
      } = this.props;
      const arr = [];
      selectedList.approval.forEach(item => arr.push(item._id));
      dispatch({
        type: 'reimbursement/reviewMultiple',
        payload: { reIDs: arr, action: key },
      });
    }
  };

  menu = (currentSelectedList, type) => {
    const billData = this.getBillData(currentSelectedList);
    return (
      <Menu onClick={this.handleDropMenuClick}>
        {type === 'approval' && (
          <Menu.Item key="approve">
            <div>
              <Icon style={{ color: '#87d068' }} type="check" />
              <span className={styles.ml10}>
                {formatMessage({ id: 'reimbursement.approve-all' })}
              </span>
            </div>
          </Menu.Item>
        )}
        {type === 'approval' && (
          <Menu.Item key="reject">
            <div>
              <Icon style={{ color: '#f50' }} type="close" />
              <span className={styles.ml10}>
                {formatMessage({ id: 'reimbursement.reject-all' })}
              </span>
            </div>
          </Menu.Item>
        )}
        <Menu.Item key="excel">
          <ExportExcel data={currentSelectedList} billData={billData} type={type} />
        </Menu.Item>
        <Menu.Item key="pdf" onClick={() => this.exportPDF(currentSelectedList)}>
          <div>
            <Icon type="file-pdf" />
            <span className={styles.ml10}>
              {type === 'approval' ? `${formatMessage({ id: 'common.button.export' })} PDF` : 'PDF'}
            </span>
          </div>
        </Menu.Item>
      </Menu>
    );
  };

  renderActionButton = (totalReimbursement = 0, currentSelectedList = [], type = '') => {
    const titleId = type !== 'approval' ? 'common.button.export' : 'common.action';
    const iconType = type !== 'approval' ? 'upload' : 'more';
    if (totalReimbursement > 0) {
      return (
        <Dropdown overlay={this.menu(currentSelectedList, type)}>
          <Button type="primary">
            <Icon type={iconType} />
            <FormattedMessage id={titleId} /> <Icon type="down" />
          </Button>
        </Dropdown>
      );
    }
    return (
      <Button type="primary" ghost disabled>
        <Icon type={iconType} />
        <FormattedMessage id={titleId} />
      </Button>
    );
  };

  render() {
    const {
      reimbursement: { list, selectedList },
      match: {
        params: { type = 'request' },
      },
      fetching,
      // form,
      // currentUser: {
      //   location: { currency },
      // },
    } = this.props;
    // const { getFieldDecorator } = form;
    // const { visible } = this.state;
    const currentSelectedList = selectedList[type];
    const reimbursementList = list[type];
    const totalReimbursement = currentSelectedList ? currentSelectedList.length : 0;

    return (
      <Layout className={styles.root} hasSider={false}>
        <Layout.Header className={styles.header}>
          <Skeleton loading={fetching}>
            <Menu className={styles.menu} mode="horizontal" selectedKeys={[type]}>
              <Menu.Item key="request" className={styles.title}>
                <Link to="/report/request">
                  {list.request.length === 0
                    ? `${formatMessage({
                        id: 'reimbursement.type.request',
                      })}`
                    : `${formatMessage({
                        id: 'reimbursement.type.request',
                      })} (${list.request.length})`}
                </Link>
              </Menu.Item>
              <Menu.Item key="approval" className={styles.title}>
                <Link to="/report/approval">
                  {list.approval.length === 0
                    ? `${formatMessage({
                        id: 'reimbursement.type.approval',
                      })}`
                    : `${formatMessage({
                        id: 'reimbursement.type.approval',
                      })} (${list.approval.length})`}
                </Link>
              </Menu.Item>
              {check(['finance', 'admin'], true, false) && (
                <Menu.Item key="pending" className={styles.title}>
                  <Link to="/report/pending">
                    {list.pending.length === 0
                      ? `${formatMessage({
                          id: 'reimbursement.type.pending',
                        })}`
                      : `${formatMessage({
                          id: 'reimbursement.type.pending',
                        })} (${list.pending.length})`}
                  </Link>
                </Menu.Item>
              )}
              <Menu.Item key="history" className={styles.title}>
                <Link to="/report/history">
                  {`${formatMessage({
                    id: 'reimbursement.type.history',
                  })}`}
                </Link>
              </Menu.Item>
            </Menu>
          </Skeleton>
        </Layout.Header>
        <Layout.Content className="wrapper">
          {type !== 'history' && (
            <div>
              <Row type="flex" align="middle" justify="space-between">
                <Col span={12}>
                  {this.renderActionButton(totalReimbursement, currentSelectedList, type)}
                </Col>
                <Col>
                  {/* <Link to="/report/add"> */}
                  <Link to="/report/new">
                    <Button type="primary">
                      <Icon type="plus" />
                      <FormattedMessage id="common.button.new-report" />
                    </Button>
                  </Link>
                </Col>
                <Col span={24} style={{ fontSize: '15px', fontWeight: '300', paddingTop: '20px' }}>
                  {totalReimbursement}/{reimbursementList.length}{' '}
                  <FormattedMessage id="reimbursement.reports-selected" />
                </Col>
              </Row>
              <ReimTable type={type} selectedList={currentSelectedList} />
            </div>
          )}
          {type === 'history' && <History />}
          {/* <Modal
            title={formatMessage({ id: 'reimbursement.export-pdf.get-more-info.title' })}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose
          >
            <Form>
              <Form.Item label={formatMessage({ id: 'pdf.less-company-paid-expenses' })}>
                {getFieldDecorator('lessCompanyPaid', {
                  initialValue: {
                    currency,
                    number: '',
                  },
                  rules: [
                    {
                      validator: this.checkAmount,
                    },
                  ],
                })(<AmountInput />)}
              </Form.Item>
              <Form.Item label={formatMessage({ id: 'pdf.less-advance-amount' })}>
                {getFieldDecorator('lessAdvance', {
                  initialValue: {
                    currency,
                    number: '',
                  },
                  rules: [
                    {
                      validator: this.checkAmount,
                    },
                  ],
                })(<AmountInput />)}
              </Form.Item>
            </Form>
          </Modal> */}
        </Layout.Content>
      </Layout>
    );
  }
}

export default Reimbursement;
