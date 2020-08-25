import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Icon,
  notification,
  Tooltip,
  Menu,
  Dropdown,
  Input,
  Statistic,
  Button,
} from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
// import router from 'umi/router';
import withRouter from 'umi/withRouter';
import StatusBox from '@/components/StatusBox';
import { generateCsvData } from '@/utils/utils';
import { router } from 'umi';
import ReportBreadcrumb from '../components/Breadcrumb';
import ReportInfo from '../components/ReportInfo';
// import ApprovalFlow from '../AddNewReport/components/approvalFlow';
import ApprovalFlowNew from '../AddNewReport/components/approvalFlowNew';

import CommentBox from '../AddNewReport/components/commentAndReport';
import Summary from '../components/Summary';
import ExpenseList from '../components/ExpenseList';
import DialogConfirm from './components/DialogConfirm';
import ExportPDF from '../../Report/ExportPDF';
import PageLoading from '../../../components/PageLoading';
import ReportTitle from './components/ReportTitle';

import styles from './index.less';

const { TextArea } = Input;
@connect(
  ({
    bill,
    bill: { filter },
    user: { currentUser = {}, userList = [] },
    loading,
    reimbursement,
    currency: { list = [] },
    group: { listGroup },
    type: { list: listOfType },
    project: { listProject },
    appSetting,
    user,
  }) => ({
    bill,
    currentUser,
    fetching: loading.effects['reimbursement/fetchItem'],
    saving: loading.effects['reimbursement/save'],
    loadingUpdate: loading.effects['reimbursement/updateReport'],
    loadingDelete: loading.effects['reimbursement/removeReport'],
    loadingReview: loading.effects['reimbursement/review'],
    reimbursement,
    currency: list,
    userList,
    listOfType,
    listGroup,
    listProject,
    appSetting,
    filter,
    user,
  })
)
class ViewReport extends PureComponent {
  state = {
    onEdit: false,
    open: {},
    confirmText: {},
    isViewReportInTeamReport: false,
    comments: [],
    nextApprovalId: '',
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { reId },
        path = '',
        url = '',
      },
      currentUser: {
        location: { _id = '', id = '' },
      },
      currentUser = {},
      reimbursement: {
        item: { user = {} },
      },
    } = this.props;
    if (path.search('teamreport') !== -1) {
      this.setState({ isViewReportInTeamReport: true });
    } else if (user.id !== currentUser.id) {
      router.push(url.replace('report', 'teamreport'));
    }
    const data = {
      status: [],
      location: _id || id,
    };
    dispatch({ type: 'user/getUserList', payload: data });
    dispatch({ type: 'bill/fetchActiveReim', payload: { status: ['ACTIVE'] } });
    dispatch({ type: 'reimbursement/fetchItem', payload: { reId } });
    dispatch({ type: 'project/fetch', payload: { location: _id || id } });
    if (_id || id) {
      dispatch({
        type: 'appSetting/fetchByLocation',
        payload: { location: _id || id },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentUser = {},
      reimbursement: {
        item = false,
        item: { user = {} },
      },
    } = nextProps;
    const { nextApprovalId = '' } = this.state;
    if (item) {
      if (item.status === 'DRAFT' || item.status === 'INQUIRY') {
        if (user.id !== currentUser.id) {
          notification.warn({
            message: formatMessage({ id: 'employee.report.view.warning.permission' }),
          });
          router.push('/report');
        } else {
          this.setState({
            disableButton: false,
          });
        }
      } else if (item.status === 'COMPLETE' || item.status === 'REJECT' || item.status === 'PAID') {
        this.setState({
          disableButton: true,
        });
      } else if (nextApprovalId !== '' && nextApprovalId !== currentUser.id) {
        if (currentUser.approle !== 'FINANCE') {
          this.setState({
            disableButton: true,
          });
        } else {
          this.setState({
            disableButton: false,
          });
        }
      } else {
        this.setState({
          disableButton: false,
        });
      }
      // else if (user.id === currentUser.id) {
      //   this.setState({
      //     disableButton: true,
      //   });
      // }
    }
  }

  getSelectedList = selectedList => {
    let arr = [];
    selectedList.map(item => {
      arr = [...arr, item._id];
      return arr;
    });
    return arr;
  };

  getCurrency = () => {
    const {
      currency = [],
      reimbursement: { item = {} },
      currentUser: {
        location: {
          currency: { symbol = '$' },
        },
      },
    } = this.props;
    if (item.currency) {
      const currencySymbol = currency.filter(nItem => {
        return nItem._id === item.currency;
      });
      return (currencySymbol[0] && currencySymbol[0].symbol) || '$';
    }
    return symbol || '$';
  };

  getApproveFlowData = step => {
    const {
      reimbursement: { item = {} },
    } = this.props;
    let approvalStep = 0;
    if ((item && item.status === 'COMPLETE') || (item && item.status === 'PAID')) {
      approvalStep = 100;
      return approvalStep;
    }
    if (item && item.status === 'DRAFT') {
      approvalStep = 0;
      return approvalStep;
    }
    if (step !== 0 && item.approvalFlow && item.approvalFlow.nodes.length > 0) {
      approvalStep = (100 / (item.approvalFlow.nodes.length + 1)) * step;
      return approvalStep;
    }
    return approvalStep;
  };

  deleteReport = () => {
    const {
      dispatch,
      match: {
        params: { reId },
      },
    } = this.props;
    dispatch({ type: 'reimbursement/removeReport', payload: { reId } });
  };

  onEdit = () => {
    const {
      dispatch,
      reimbursement: { item = {} },
    } = this.props;
    dispatch({
      type: 'bill/saveSelectedList',
      payload: { selectedList: this.getSelectedList(item.bills) },
    });
    setTimeout(() => {
      this.setState({
        onEdit: true,
      });
    }, 1500);
  };

  onDialogOpen = type => {
    this.setState({ open: { [type]: true } });
  };

  onTextChange = (e, type) => {
    this.setState({ confirmText: { [type]: e.target.value } });
  };

  onDialogClose = type => {
    this.setState({ open: { [type]: false } });
  };

  getDataComment = data => {
    let arr = [];
    if (data.length > 0) {
      data.map(item => {
        arr = [...arr, item.content];
        return arr;
      });
    }
    return arr;
  };

  getTotalAmount = () => {
    const {
      bill: { list = [], selectedList = [] },
      reimbursement: { item = {} },
    } = this.props;
    const arr = [...list, ...item.bills];
    let amount = 0;
    arr.forEach(aItem => {
      const index = selectedList.findIndex(nItem => nItem === aItem._id);
      if (index !== -1) {
        amount += aItem.amount;
      }
    });
    return amount;
  };

  getApprovalText = () => {
    const {
      reimbursement: { item = {} },
    } = this.props;
    let text = '';
    const dataApproval = this.getNextStepApproval();
    let mText = '';
    if (dataApproval.length > 1) {
      dataApproval.map((mItem, index) => {
        if (index === dataApproval.length - 1 && index !== 0) {
          mText += `and ${mItem} `;
        } else if (index === 0) {
          mText += `by ${mItem} `;
        } else if (index !== 0 && index < dataApproval.length - 1) {
          mText += `, ${mItem} `;
        }
        return mText;
      });
    } else if (dataApproval.length === 1 && dataApproval[0]) {
      mText += `by ${dataApproval[0] || ''}`;
    }
    switch (item.status) {
      case 'DRAFT':
        text = '';
        break;
      case 'COMPLETE':
        text = `${formatMessage({ id: 'employee.report.view.approvalText.complete' })} ${mText}`;
        break;
      case 'INQUIRY':
        text = `${formatMessage({ id: 'employee.report.view.approvalText.inquiry' })} ${mText}`;
        break;
      case 'REJECT':
        text = `${formatMessage({ id: 'employee.report.view.approvalText.reject' })} ${mText}`;
        break;
      case 'PAID':
        text = `${formatMessage({
          id: 'employee.report.view.approvalText.paid',
        })}`;
        break;
      default:
        text = `${formatMessage({ id: 'employee.report.view.approvalText.report' })} ${mText}`;
        break;
    }
    return text;
  };

  getNextStepApproval = () => {
    const {
      reimbursement: {
        item = {},
        item: { manager = {}, approvalFlow = {}, approvalHistory = [] },
      },
      currentUser: { id = '' },
    } = this.props;
    let dataApproval = [];
    if (item.status === 'DRAFT') {
      return dataApproval;
    }
    if (item.status === 'COMPLETE' || item.status === 'PAID') {
      if (approvalHistory && approvalHistory.length > 0) {
        approvalHistory.map(aItem => {
          dataApproval = [...dataApproval, aItem.fullName];
          return dataApproval;
        });
      }
      return dataApproval;
    }
    if (item && item.approvalStep === 0 && item.status !== 'DRAFT') {
      dataApproval = [...dataApproval, manager.fullName || 'Manager'];
      this.setState({
        nextApprovalId: manager.id,
      });
      return dataApproval;
    }
    if (approvalHistory && approvalHistory.length > 0 && item.status === 'REJECT') {
      approvalHistory.map(sItem => {
        if (sItem.status === 'REJECT') {
          dataApproval = [...dataApproval, sItem.fullName];
        }
        return dataApproval;
      });
      return dataApproval;
    }
    if (approvalHistory && approvalHistory.length > 0 && item.status === 'INQUIRY') {
      approvalHistory.map(sItem => {
        if (sItem.status === 'INQUIRY') {
          dataApproval = [...dataApproval, sItem.fullName];
        }
        return dataApproval;
      });
      return dataApproval;
    }
    // eslint-disable-next-line no-else-return
    else if (
      approvalFlow.nodes &&
      approvalFlow.nodes.length > 0 &&
      item.status !== 'REJECT' &&
      item.status !== 'INQUIRY'
    ) {
      const group = approvalFlow.nodes[item.approvalStep] || {};
      const name =
        (group.data.members[0] && group.data.members[0].fullName) ||
        (group.data.members[0] && group.data.members[0].firstName) ||
        '';
      const approvalId =
        (group.data.members[0] && group.data.members[0].id) ||
        (group.data.members[0] && group.data.members[0]._id) ||
        '';
      let isFinancer = false;
      group.data.members.map(gItem => {
        if (gItem._id === id) {
          isFinancer = true;
        }
        return isFinancer;
      });
      if (isFinancer) {
        this.setState({
          nextApprovalId: id,
        });
      }
      // if (approvalId === id && group.data.members.length > 1) {
      //   name =
      //     (group.data.members[1] && group.data.members[1].fullName) ||
      //     (group.data.members[1] && group.data.members[1].firstName) ||
      //     '';
      //   approvalId =
      //     (group.data.members[1] && group.data.members[1].id) ||
      //     (group.data.members[1] && group.data.members[1]._id) ||
      //     '';
      // }
      else {
        this.setState({
          nextApprovalId: approvalId,
        });
      }
      dataApproval = [...dataApproval, name];

      return dataApproval;
    }
    return dataApproval;
  };

  onSaveReport = () => {
    const {
      dispatch,
      reimbursement: { item = {} },
      bill: { selectedList = [], totalAmount = 0 },
    } = this.props;
    let action = 'submit';
    const { onEdit = false, reportName = '', comments = [] } = this.state;
    if ((onEdit && item.status === 'DRAFT') || (onEdit && item.status === 'INQUIRY')) {
      action = 'saveDraft';
    }
    if (item.bills.length > 0 || (selectedList.length > 0 && onEdit)) {
      const data = {
        id: item.id || item._id || '',
        action,
        amount: onEdit ? this.getTotalAmount() : item.amount || totalAmount,
        bills: onEdit ? selectedList : this.getSelectedList(item.bills),
        currency: item.currency,
        title: onEdit && reportName.trim().length > 0 ? reportName : item.title,
        ...(comments.length > 0 ? { messages: comments } : ''),
      };
      dispatch({ type: 'reimbursement/updateReport', payload: data }).then(() => {
        this.setState({
          onEdit: false,
        });
      });
    } else {
      notification.warn({ message: formatMessage({ id: 'employee.onSubmit.error' }) });
    }
  };

  onSubmitReport = () => {
    const {
      dispatch,
      reimbursement: { item = {} },
      bill: { selectedList = [], totalAmount = 0 },
    } = this.props;
    const { onEdit = false, reportName = '', comments = [] } = this.state;
    if (item.bills.length > 0 || (selectedList.length > 0 && onEdit)) {
      const data = {
        id: item.id || item._id || '',
        action: 'submit',
        amount: onEdit ? this.getTotalAmount() : item.amount || totalAmount,
        bills: onEdit ? selectedList : this.getSelectedList(item.bills),
        currency: item.currency,
        title: onEdit && reportName.trim().length > 0 ? reportName : item.title,
        ...(comments.length > 0 ? { messages: comments } : ''),
      };
      dispatch({ type: 'reimbursement/updateReport', payload: data }).then(() => {
        this.setState({
          onEdit: false,
        });
      });
    } else {
      notification.warn({ message: formatMessage({ id: 'employee.onSubmit.error' }) });
    }
  };

  onReviewReport = (type, text = '', dialogOpen = '') => {
    const {
      dispatch,
      reimbursement: { item = {} },
    } = this.props;
    if (type === 'reject' || type === 'inquiry') {
      if (text.trim().length <= 0) {
        notification.error({ message: formatMessage({ id: 'employee.new.page.reject.error' }) });
        return;
      }
    }
    const data = {
      action: type,
      reId: item.id || item._id || '',
      ...(text.trim().length > 0 ? { message: text } : ''),
    };
    dispatch({ type: 'reimbursement/review', payload: data }).then(() => {
      this.setState({
        open: { [dialogOpen]: false },
      });
    });
  };

  onExportPDF = () => {
    const {
      currentUser: {
        company: { name = '', logoUrl = '' },
      },
      reimbursement: { item = {} },
    } = this.props;
    let arr = [];
    arr = [...arr, item];
    ExportPDF(arr, logoUrl, name);
  };

  onExportCSV = () => {
    const {
      reimbursement: { item = {} },
    } = this.props;
    const data = generateCsvData(item);
    const csvContent = `data:text/csv;charset=utf-8,${data.map(e => e.join(',')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `report-${item.id}.csv`);
    document.body.appendChild(link);

    link.click();
  };

  renderSubmitButton = status => {
    const { disableButton = false, onEdit = false, nextApprovalId = '' } = this.state;
    const {
      reimbursement: { item = {} },
      currentUser: { appRole = '', id = '' },
    } = this.props;
    const isAuthor = item.user && item.user.id === id;
    // const isForceApprove =
    //   item.status === 'PENDING' && nextApprovalId !== id && appRole === 'FINANCE';
    const isForceApprove = nextApprovalId !== id && appRole === 'FINANCE';
    const approveMenu = (
      <Menu style={{ minWidth: '150px' }}>
        <Menu.Item
          key="1"
          onClick={() => {
            this.onDialogOpen('onAskMoreDialogOpen');
          }}
        >
          {formatMessage({ id: 'employee.report.view.button.askMore' })}
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            this.onDialogOpen('onRejectDialogOpen');
          }}
        >
          {formatMessage({ id: 'employee.report.view.button.reject' })}
        </Menu.Item>
      </Menu>
    );

    const submitMenu = (
      <Menu style={{ minWidth: '150px' }}>
        <Menu.Item key="1" onClick={this.onEdit} disabled={onEdit}>
          {formatMessage({ id: 'employee.report.view.button.edit' })}
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            this.onDialogOpen('onDeleteDialogOpen');
          }}
        >
          {formatMessage({ id: 'employee.new.page.dialog.button.delete' })}
        </Menu.Item>
      </Menu>
    );
    const resubmitMenu = (
      <Menu style={{ minWidth: '150px' }}>
        <Menu.Item key="1" onClick={this.onEdit}>
          {formatMessage({ id: 'employee.report.view.button.edit' })}
        </Menu.Item>
      </Menu>
    );
    let menu = null;
    let button = '';
    let onClick = () => {};
    switch (status) {
      case 'DRAFT':
        menu = submitMenu;
        button = formatMessage({ id: 'employee.new.page.button.submit' });
        onClick = () => {
          this.onDialogOpen('onSubmitDialogOpen');
        };
        break;
      case 'INQUIRY':
        menu = resubmitMenu;
        button = formatMessage({ id: 'employee.report.view.button.resubmit' });
        onClick = () => {
          this.onDialogOpen('onSubmitDialogOpen');
        };
        break;
      case 'COMPLETE':
        button = formatMessage({ id: 'employee.report.view.button.resubmit' });
        this.setState({
          disableButton: true,
        });
        break;
      case 'PAID':
        button = formatMessage({ id: 'employee.report.view.button.resubmit' });
        this.setState({
          disableButton: true,
        });
        break;
      case 'REJECT':
        if (isAuthor) {
          return (
            <Button
              className={`${styles.employee_report_view_button_submit} ${
                styles.employee_report_view_button_delete
              }`}
              onClick={() => {
                this.onDialogOpen('onDeleteDialogOpen');
              }}
            >
              {formatMessage({ id: 'employee.new.page.dialog.button.delete' })}
            </Button>
          );
        }
        button = formatMessage({ id: 'employee.report.view.button.resubmit' });
        this.setState({
          disableButton: true,
        });
        break;
      default:
        if (isForceApprove) {
          onClick = () => {
            this.onDialogOpen('onForceApproveDialogOpen');
          };
        } else {
          onClick = () => {
            this.onDialogOpen('onApproveDialogOpen');
          };
        }
        menu = approveMenu;
        button = formatMessage({ id: 'employee.report.view.button.approve' });
        this.setState({
          disableButton: false,
        });
        break;
    }
    return (
      <Dropdown.Button
        className={`${styles.employee_report_view_button_submit} ${
          disableButton ? `${styles.employee_report_disabled}` : ''
        }`}
        overlay={menu}
        onClick={onClick}
        disabled={disableButton}
        icon={<Icon type="down" />}
      >
        {button}
      </Dropdown.Button>
    );
  };

  onCancelEdit = () => {
    this.setState({
      onEdit: false,
    });
  };

  onSendComment = message => {
    const {
      dispatch,
      reimbursement: {
        item: { id = '', _id = '' },
      },
    } = this.props;
    const data = {
      reId: _id || id,
      message,
    };
    dispatch({ type: 'reimbursement/comment', payload: data });
  };

  onComments = comments => {
    this.setState({
      comments,
    });
  };

  render() {
    const {
      reimbursement: {
        item = {},
        item: {
          title = '',
          code = '',
          createdAt = '',
          updatedAt = '',
          user = {},
          location = {},
          company = {},
          manager = {},
        },
      },
      fetching,
      // currentUser: { id = '', _id = '', department = '' },
      currentUser,
      bill: { list = [], selectedList = [] },
      loadingUpdate,
      loadingDelete,
      loadingReview,
    } = this.props;
    const {
      onEdit,
      open = {},
      confirmText = {},
      reportName = item.title || '',
      isViewReportInTeamReport = false,
    } = this.state;

    const expenseList = item.bills || list || [];
    const currencySymbol = this.getCurrency();
    // const approvalStep = this.getApproveFlowData(item.approvalStep || 0);
    const isNewReport = item.status === 'DRAFT';
    const nextStepApproval = this.getApprovalText();

    const reportData = {
      // name: reportName && reportName.trim().length > 0 ? reportName : title,
      name: title,
      owner: user.fullName || user.firstName,
      number: code,
      created: createdAt,
      submitted: updatedAt,
    };

    const employeeInfo = {
      name: user.fullName || user.firstName || '',
      id: user.employeeId || '',
      company: company.name || '',
      location: location.name || '',
      department: user.department || '',
      email: user.email || '',
      phone: user.phone || '',
      manager: manager.fullName || manager.firstName || '',
    };

    const exportMenu = (
      <Menu style={{ minWidth: '150px' }}>
        <Menu.Item key="1" onClick={this.onExportCSV}>
          CSV
        </Menu.Item>
        <Menu.Item key="2" onClick={this.onExportPDF}>
          PDF
        </Menu.Item>
      </Menu>
    );

    const submitContent = (
      <p style={{ color: '#000' }}>
        {formatMessage({ id: 'employee.new.page.dialog.submit.content' })}
      </p>
    );

    const deleteContent = (
      <div>
        <p style={{ color: '#000', marginTop: '-10px' }}>
          {formatMessage({ id: 'employee.new.page.dialog.delete._01' })}
        </p>
        <p style={{ color: '#000', marginBottom: '-15px' }}>
          {formatMessage({ id: 'employee.new.page.dialog.delete._02' })}
        </p>
      </div>
    );

    const approveContent = (
      <div className={styles.employee_report_confirm_approve_content}>
        <p style={{ color: '#000' }}>
          {open.onRejectDialogOpen
            ? `${formatMessage({ id: 'employee.new.page.dialog.reject.content' })}${user.fullName ||
                user.firstName ||
                ''}`
            : formatMessage({ id: 'employee.new.page.dialog.approve.content' })}
        </p>
        <TextArea
          rows={4}
          maxLength={250}
          value={(open.onRejectDialogOpen ? confirmText.rejectText : confirmText.approveText) || ''}
          onChange={e => {
            const text = open.onRejectDialogOpen ? 'rejectText' : 'approveText';
            this.onTextChange(e, text);
          }}
          placeholder={`${formatMessage({ id: 'employee.new.page.dialog.approve.placeholder' })}${
            open.onRejectDialogOpen ? '*' : ''
          }`}
        />
        <p
          style={{
            textAlign: 'right',
            color: '#000',
            opacity: '0.5',
            marginBottom: '10px!important',
          }}
        >
          {(open.onRejectDialogOpen
            ? confirmText.rejectText && confirmText.rejectText.length.toString()
            : confirmText.approveText && confirmText.approveText.length.toString()) || '0'}
          /250
        </p>
      </div>
    );

    const forceApproveContent = (
      <div className={styles.employee_report_confirm_approve_content}>
        <p style={{ color: '#000' }}>
          {formatMessage({ id: 'employee.new.page.dialog.force.approve.content' })}
        </p>
        <TextArea
          rows={4}
          maxLength={250}
          value={confirmText.forceApproveText || ''}
          onChange={e => {
            this.onTextChange(e, 'forceApproveText');
          }}
          placeholder={formatMessage({ id: 'employee.new.page.dialog.approve.placeholder' })}
        />
        <p
          style={{
            textAlign: 'right',
            color: '#000',
            opacity: '0.5',
            marginBottom: '10px!important',
          }}
        >
          {(confirmText.forceApproveText && confirmText.forceApproveText.length.toString()) || '0'}
          /250
        </p>
      </div>
    );

    const askMoreContent = (
      <div className={styles.employee_report_confirm_approve_content}>
        <p style={{ color: '#000' }}>
          {`${formatMessage({ id: 'employee.new.page.dialog.askMore.content' })}${user.fullName ||
            user.firstName ||
            ''}`}
        </p>
        <TextArea
          rows={4}
          maxLength={250}
          value={confirmText.askMoreText || ''}
          onChange={e => {
            this.onTextChange(e, 'askMoreText');
          }}
          placeholder={`${formatMessage({ id: 'employee.new.page.dialog.approve.placeholder' })}*`}
        />
        <p
          style={{
            textAlign: 'right',
            color: '#000',
            opacity: '0.5',
            marginBottom: '10px!important',
          }}
        >
          {(confirmText.askMoreText && confirmText.askMoreText.length.toString()) || '0'}
          /250
        </p>
      </div>
    );

    return item ? (
      <PageLoading loading={fetching} size="small">
        <Row className={styles.employee_report_view_container}>
          <Col span={24}>
            <ReportBreadcrumb
              title={formatMessage({ id: 'report.report-review' })}
              isViewReportInTeamReport={isViewReportInTeamReport}
            />
          </Col>
          <Col span={24} style={{ marginTop: '23px' }}>
            <Row className={styles.employee_report_data}>
              <Col span={14} className={styles.employee_report_view_report_data}>
                {onEdit ? (
                  <ReportTitle
                    reportTitle={title}
                    reportName={reportName}
                    getReportName={rName => {
                      this.setState({ reportName: rName });
                    }}
                  />
                ) : (
                  <ReportInfo
                    item={reportData}
                    employee={employeeInfo}
                    // readOnly={!onEdit}
                    // getReportName={rName => {
                    //   this.setState({ reportName: rName });
                    // }}
                  />
                )}
              </Col>
              <Col
                span={10}
                style={{ textAlign: 'right' }}
                className={styles.employee_new_report_name_container}
              >
                <div className={styles.employee_report_new_name}>
                  <div
                    style={{ width: '100%', float: 'right', marginBottom: '10px' }}
                    className={styles.employee_report_new_name_text}
                  >
                    <Tooltip
                      title={
                        onEdit
                          ? this.getTotalAmount()
                              .toFixed(2)
                              .toString()
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0
                          : item.amount
                              .toFixed(2)
                              .toString()
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || 0
                      }
                    >
                      <h1 style={{ display: 'flex' }}>
                        {currencySymbol || '$'}&nbsp;
                        <Statistic
                          className={styles.employee_report_totalAmount}
                          value={
                            onEdit
                              ? this.getTotalAmount()
                                  .toFixed(2)
                                  .toString()
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1') || 0
                              : item.amount
                                  .toFixed(2)
                                  .toString()
                                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1') || 0
                          }
                          precision={2}
                        />
                      </h1>
                    </Tooltip>
                  </div>
                  {onEdit ? (
                    <Button
                      className={styles.employee_report_view_button_cancel}
                      onClick={this.onSaveReport}
                      loading={loadingUpdate}
                      // onClick={this.onCancelEdit}
                    >
                      {formatMessage({ id: 'employee.report.view.button.save' })}
                    </Button>
                  ) : (
                    <Dropdown.Button
                      className={styles.employee_report_view_button_export}
                      overlay={exportMenu}
                      onClick={this.onExportPDF}
                      icon={<Icon type="down" />}
                    >
                      {formatMessage({ id: 'employee.report.view.button.export' })}
                    </Dropdown.Button>
                  )}

                  {this.renderSubmitButton(item.status)}
                  <div>
                    <StatusBox status={item.status} />
                  </div>
                  <div className={styles.employee_report_approval_text}>
                    <p style={{ marginBottom: '0' }}>
                      {item.status !== 'DRAFT' ? nextStepApproval : ''}
                    </p>
                    {item.status === 'PAID' ? (
                      <p style={{ display: 'flex' }}>
                        {formatMessage({ id: 'employee.report.view.approvalText.paid.amount' })}
                        {currencySymbol || '$'}{' '}
                        {item.amount
                          .toFixed(2)
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1') || 0}
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24} className={styles.employee_report_view_approval_flow}>
                <h1>{formatMessage({ id: 'employee.new.page.name.flow' })}</h1>
              </Col>
              <Col span={14} className={styles.employee_report_view_approval_flow_container}>
                <div className={styles.employee_new_report_approval_block}>
                  {/* <ApprovalFlow
                    approvalStep={approvalStep}
                    status={item.status || ''}
                    manager={(item.manager && item.manager.fullName) || ''}
                    item={item}
                  /> */}
                  <ApprovalFlowNew approvalFlow={item} currentUser={currentUser} />
                  <div className={styles.employee_report_view_summary}>
                    <Summary
                      totalList={item.bills || []}
                      listExpenses={onEdit ? selectedList : this.getSelectedList(item.bills)}
                    />
                  </div>
                </div>
              </Col>
              <Col span={10} className={styles.employee_report_view_comment_box_container}>
                <CommentBox
                  isNew={isNewReport}
                  sendReportedComment={message => {
                    if (!onEdit && item.status !== 'DRAFT' && item.status !== 'INQUIRY') {
                      this.onSendComment(message);
                    }
                  }}
                  sendComment={comments => {
                    if (onEdit || (item.status === 'DRAFT' || item.status === 'INQUIRY')) {
                      this.onComments(comments);
                    }
                  }}
                  item={item}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24} className={styles.employee_report_view_expense_list}>
                <ExpenseList
                  isExpBtnDisabled={!onEdit}
                  selectedList={onEdit ? selectedList : this.getSelectedList(item.bills)}
                  list={onEdit ? [...list, ...expenseList] : item.bills}
                  rowSelection={onEdit ? list : null}
                />
              </Col>
            </Row>
          </Col>
          <DialogConfirm
            open={open.onDeleteDialogOpen}
            title={formatMessage({ id: 'employee.new.page.dialog.delete.title' })}
            onConfirm={this.deleteReport}
            onDialogClose={() => {
              this.onDialogClose('onDeleteDialogOpen');
            }}
            content={deleteContent}
            submit={formatMessage({ id: 'employee.new.page.dialog.button.delete' })}
            loadingButton={loadingDelete}
          />
          <DialogConfirm
            open={open.onSubmitDialogOpen}
            title={formatMessage({ id: 'employee.new.page.dialog.submit.title' })}
            onConfirm={this.onSubmitReport}
            onDialogClose={() => {
              this.onDialogClose('onSubmitDialogOpen');
            }}
            content={submitContent}
            submit={formatMessage({ id: 'employee.new.page.dialog.button.submit' })}
            loadingButton={loadingUpdate}
          />
          <DialogConfirm
            open={open.onApproveDialogOpen}
            title={formatMessage({ id: 'employee.new.page.dialog.approve.title' })}
            onConfirm={() => {
              this.onReviewReport('approve', confirmText.approveText || '', 'onApproveDialogOpen');
            }}
            onDialogClose={() => {
              this.onDialogClose('onApproveDialogOpen');
            }}
            className={styles.employee_report_confirm_approve}
            content={approveContent}
            submit={formatMessage({ id: 'employee.report.view.button.approve' })}
            loadingButton={loadingReview}
          />
          <DialogConfirm
            open={open.onForceApproveDialogOpen}
            title={formatMessage({ id: 'employee.new.page.dialog.approve.title' })}
            onConfirm={() => {
              this.onReviewReport(
                'approve',
                confirmText.forceApproveText || '',
                'onForceApproveDialogOpen'
              );
            }}
            onDialogClose={() => {
              this.onDialogClose('onForceApproveDialogOpen');
            }}
            className={styles.employee_report_confirm_approve}
            content={forceApproveContent}
            submit={formatMessage({ id: 'employee.report.view.button.approve' })}
            loadingButton={loadingReview}
          />
          <DialogConfirm
            open={open.onRejectDialogOpen}
            title={formatMessage({ id: 'employee.new.page.dialog.reject.title' })}
            onConfirm={() => {
              this.onReviewReport('reject', confirmText.rejectText || '', 'onRejectDialogOpen');
            }}
            onDialogClose={() => {
              this.onDialogClose('onRejectDialogOpen');
            }}
            onReject
            className={styles.employee_report_confirm_approve}
            content={approveContent}
            submit={formatMessage({ id: 'employee.report.view.button.reject' })}
            loadingButton={loadingReview}
          />
          <DialogConfirm
            open={open.onAskMoreDialogOpen}
            title={formatMessage({ id: 'employee.report.view.button.askMore' })}
            onConfirm={() => {
              this.onReviewReport('inquiry', confirmText.askMoreText || '', 'onAskMoreDialogOpen');
            }}
            onDialogClose={() => {
              this.onDialogClose('onAskMoreDialogOpen');
            }}
            className={styles.employee_report_confirm_approve}
            content={askMoreContent}
            submit={formatMessage({ id: 'employee.new.box.send' })}
            loadingButton={loadingReview}
          />
        </Row>
      </PageLoading>
    ) : (
      <div />
    );
  }
}

export default withRouter(ViewReport);
