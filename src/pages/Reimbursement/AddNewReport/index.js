import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Input, Modal, Tooltip, notification, Statistic } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { getMonth } from '@/utils/utils';
// import ApprovalFlow from './components/approvalFlow';
import ApprovalFlowNew from './components/approvalFlowNew';
import CommentBox from './components/commentAndReport';
import Summary from '../components/Summary';
import ExpenseList from '../components/ExpenseList';
import ReportBreadcrumb from '../components/Breadcrumb';

import styles from './index.less';

@connect(
  ({
    bill,
    bill: { filter },
    loading,
    user,
    user: { currentUser = {} },
    reimbursement,
    currency: { list = [] },
    group: { listGroup },
    type: { list: listOfType },
    project: { listProject },
    appSetting,
  }) => ({
    currentUser,
    loading: loading.models.user,
    fetchBillActive: loading.effects['bill/fetchActiveReim'],
    loadingCreateReport: loading.effects['reimbursement/addReport'],
    reimbursement,
    bill,
    currency: list,
    listOfType,
    listGroup,
    listProject,
    appSetting,
    filter,
    user,
  })
)
class AddNewReport extends PureComponent {
  state = {
    reportName: '',
    dialogSaveOpen: false,
    message: [],
    dialogType: '',
  };

  componentDidMount() {
    const {
      dispatch,
      currentUser: {
        location: { _id = '', id = '' },
      },
    } = this.props;
    dispatch({ type: 'bill/fetchActiveReim', payload: { status: ['ACTIVE'] } });
    this.getName();
    dispatch({ type: 'project/fetch', payload: { location: _id || id } });
    dispatch({ type: 'reimbursement/approvalData' });
    if (_id || id) {
      dispatch({
        type: 'appSetting/fetchByLocation',
        payload: { location: _id || id },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bill/save',
      payload: { selectedList: [], tempBillList: [], list: [], totalAmount: 0 },
    });
  }

  getName = () => {
    const { currentUser = {} } = this.props;
    const date = new Date();
    const month = getMonth(date);
    const userName = currentUser.fullName || currentUser.firstName || '';
    this.setState({
      reportName: `${userName}, ${month} ${date.getFullYear()}`,
    });
  };

  // getCurrency = () => {
  //   const {
  //     currency = [],
  //     bill: { selectedList = [], list = [] },
  //     currentUser = {},
  //   } = this.props;
  //   console.log('currency', currentUser);
  //   if (selectedList.length > 0) {
  //     const bill = list.filter(item => {
  //       return item._id === selectedList[0];
  //     });
  //     const currencySymbol = currency.filter(item => {
  //       return item._id === bill[0].currency;
  //     });
  //     return currencySymbol[0].symbol || '$';
  //   }
  //   return '$';
  // };

  onNameChange = e => {
    this.setState({
      reportName: e.target.value,
    });
  };

  onDialogOpen = () => {
    this.setState({
      dialogSaveOpen: true,
      dialogType: 'saveDraft',
    });
  };

  onSubmitDialogOpen = () => {
    this.setState({
      dialogSaveOpen: true,
      dialogType: 'submit',
    });
  };

  onDialogClose = () => {
    this.setState({
      dialogSaveOpen: false,
    });
  };

  addMessage = message => {
    this.setState({
      message,
    });
  };

  onSave = (type, totalAmount) => {
    const {
      dispatch,
      bill: { selectedList = [] },
      currentUser: { location: { currency: { _id: myCurrency = '' } = {} } = {} },
    } = this.props;
    if (selectedList.length > 0) {
      const { message = [], reportName = '' } = this.state;
      const data = {
        action: type,
        amount: totalAmount,
        bills: selectedList,
        currency: myCurrency,
        title: reportName,
        ...(message.length > 0 ? { message } : ''),
      };
      dispatch({ type: 'reimbursement/addReport', payload: data });
    } else {
      notification.warn({ message: formatMessage({ id: 'employee.onSubmit.error' }) });
    }
  };

  renderSaveDraftDialogConfirm = total => {
    const { dialogSaveOpen, dialogType } = this.state;
    const { loadingCreateReport } = this.props;
    return (
      <Modal
        visible={dialogSaveOpen}
        className={styles.employee_new_report_dialog}
        title={
          dialogType === 'saveDraft'
            ? formatMessage({ id: 'employee.new.page.dialog.title' })
            : formatMessage({ id: 'employee.new.page.dialog.submit.title' })
        }
        footer={[
          <Button
            key="back"
            onClick={this.onDialogClose}
            style={{
              border: '1px solid #fca00a',
              color: '#fca00a',
              marginRight: '24px',
              height: '35px',
              minWidth: '100px',
              textTransform: 'uppercase',
            }}
          >
            {formatMessage({ id: 'employee.new.page.dialog.button.back' })}
          </Button>,
          <Button
            key="submit"
            onClick={() => {
              this.onSave(dialogType, total);
            }}
            style={{
              backgroundColor: '#fca00a',
              border: '1px solid #fca00a',
              color: '#fff',
              height: '35px',
              minWidth: '100px',
              textTransform: 'uppercase',
              marginRight: '23px',
            }}
            loading={loadingCreateReport}
          >
            {dialogType === 'saveDraft'
              ? formatMessage({ id: 'employee.new.page.dialog.button.saveDraft' })
              : formatMessage({ id: 'employee.new.page.dialog.button.submit' })}
          </Button>,
        ]}
      >
        <div className={styles.employee_new_report_dialog_content}>
          {dialogType === 'saveDraft' ? (
            <div>
              <p style={{ color: '#000' }}>
                {formatMessage({ id: 'employee.new.page.dialog.content_1' })}
              </p>
              <p style={{ color: '#fca00a', fontWeight: 'bold' }}>
                {formatMessage({ id: 'employee.new.page.dialog.content_2' })}
              </p>
              <p style={{ color: '#000' }}>
                {formatMessage({ id: 'employee.new.page.dialog.content_3' })}
              </p>
            </div>
          ) : (
            <p style={{ color: '#000' }}>
              {formatMessage({ id: 'employee.new.page.dialog.submit.content' })}
            </p>
          )}
        </div>
      </Modal>
    );
  };

  getDataFlow = () => {
    const { reimbursement = {} } = this.props;
    return reimbursement.approvalData
      ? {
          approvalFlow: reimbursement.approvalData,
        }
      : {};
  };

  calTotalAmount = (listAll, listSelected) => {
    let arr = [];
    listSelected.map(item => {
      arr = [
        ...arr,
        ...listAll.filter(nItem => {
          return nItem._id === item;
        }),
      ];
      return arr;
    });
    const listAmount = arr.map(i => i.amount);
    let total = 0;
    for (let i = 0; i < listAmount.length; i += 1) {
      total += listAmount[i];
    }
    return total;
  };

  render() {
    const { reportName = '' } = this.state;
    const {
      currentUser: {
        location: {
          currency: { symbol = '$' },
        },
        // manager = {},
      },
      bill: { list = [], tempBillList = [], listAll = [] },
      fetchBillActive,
      reimbursement: { approvalData = {} } = {},
      currentUser,
    } = this.props;
    // const managerName = manager && manager.fullName ? manager.fullName : '';
    const selectedList = tempBillList ? [...tempBillList] : [];
    const newTotalAmount = this.calTotalAmount(listAll, selectedList) || 0;
    return (
      <Row className={styles.employee_report_new_component}>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <ReportBreadcrumb title={formatMessage({ id: 'employee.new.page.breadcrumb' })} />
            </Col>
            <Col span={14} className={styles.employee_new_col_name_container}>
              <div className={styles.employee_report_col_name}>
                <div className={styles.employee_report_name}>
                  <div className={styles.employee_report_name_input}>
                    {formatMessage({ id: 'employee.new.page.name.input' })}
                  </div>
                  <Input
                    required
                    className={styles.employee_report_input_value}
                    value={reportName}
                    onChange={this.onNameChange}
                  />
                </div>
                <h1>{formatMessage({ id: 'employee.new.page.name.flow' })}</h1>
              </div>
            </Col>
            <Col
              span={10}
              style={{ textAlign: 'right' }}
              className={styles.employee_new_report_name_container}
            >
              <div className={styles.employee_report_new_name}>
                <div style={{ width: '100%', float: 'right' }}>
                  <Tooltip title={newTotalAmount || 0}>
                    {/* <h1>
                      {symbol || '$'}{' '}
                      {totalAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0}
                    </h1> */}
                    <h1 style={{ display: 'flex' }}>
                      {symbol || '$'}&nbsp;
                      <Statistic
                        className={styles.employee_report_totalAmount}
                        value={newTotalAmount}
                        // precision={2}
                      />
                    </h1>
                  </Tooltip>
                </div>
                <Button className={styles.employee_report_button_save} onClick={this.onDialogOpen}>
                  {formatMessage({ id: 'employee.new.page.button.save' })}
                </Button>
                <Button
                  onClick={this.onSubmitDialogOpen}
                  className={styles.employee_report_button_submit}
                >
                  {formatMessage({ id: 'employee.new.page.button.submit' })}
                </Button>
                <div className={styles.employee_report_name_description}>
                  {formatMessage({ id: 'employee.new.page.name.description' })}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={14} className={styles.employee_new_report_approval}>
          <div className={styles.employee_new_report_approval_block}>
            {/* <ApprovalFlow manager={managerName || ''} item={dataFlow} /> */}
            <ApprovalFlowNew approvalFlow={approvalData} currentUser={currentUser} />
            <div className={styles.employee_new_report_summary}>
              <Summary listExpenses={selectedList} />
            </div>
          </div>
        </Col>
        <Col span={10} className={styles.employee_new_report_comment_box}>
          <div
            style={{ zIndex: '101', position: 'relative' }}
            className={styles.comment_box_responsive}
          >
            <CommentBox
              isNew
              sendComment={comment => {
                this.addMessage(comment);
              }}
            />
          </div>
        </Col>
        <Col span={24} className={styles.employee_new_report_expense_list}>
          {!fetchBillActive && <ExpenseList selectedList={selectedList} list={list} />}
        </Col>
        {this.renderSaveDraftDialogConfirm(newTotalAmount)}
      </Row>
    );
  }
}

export default AddNewReport;
