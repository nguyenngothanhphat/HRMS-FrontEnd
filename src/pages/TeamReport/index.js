import React, { PureComponent } from 'react';
import { CSVLink } from 'react-csv';
import { Row, Input, Select, Button, Col, Drawer, Menu, Modal, Dropdown, Statistic } from 'antd';
import { formatMessage, FormattedHTMLMessage } from 'umi-plugin-react/locale';
import { ReactComponent as ExportIcon } from '@/assets/svg/export.svg';
import { ReactComponent as FilterIcon } from '@/assets/svg/filter.svg';
import { ReactComponent as FilterFillIcon } from '@/assets/svg/filter_fill.svg';
import moment from 'moment';
import { connect } from 'dva';
import windowSize from 'react-window-size';
import FilterForm from './FilterForm';
import ExportPDF from './ExportPDF';
import ListReportTable from './ListReportTable';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

@connect(
  ({
    reimbursement,
    user: { currentUser = {} },
    user,
    loading,
    locations: { list: listLocation = [] },
    currency,
  }) => ({
    reimbursement,
    currentUser,
    listLocation,
    loading: loading.models.reimbursement,
    loadingReview: loading.effects['reimbursement/teamReportApprove'],
    currency,
    user,
  })
)
class TeamReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowFilterForm: false,
      selectedListId: [],
      dialogApproveOpen: false,
      dialogExportOpen: false,
      exportType: '',
      allowApprove: false,
      csvRecord: [],
      filter: {
        year: this.getCurrentYear(),
        currentMenuFilter: 'pendingByUser',
        page: 1,
        limit: 10,
      },
      isFiltering: false,
    };
  }

  componentDidMount() {
    this.fetchAllData();
  }

  fetchAllData = () => {
    const { filter } = this.state;
    this.fetchLocation();
    this.fetchSummaryApproval(filter);
    this.fetchTeamReport(filter);
    this.fetchEmployeeList();
  };

  reCheckAllowApprove = () => {
    const { selectedListId, filter } = this.state;
    let allowApprove = false;
    const {
      currentUser,
      reimbursement: { teamReport = [] },
    } = this.props;
    if (teamReport.length > 0) {
      if (currentUser.appRole !== 'FINANCE') {
        if (filter.currentMenuFilter === 'pendingByUser') {
          teamReport.forEach(element => {
            if (
              selectedListId.indexOf(element._id) !== -1 &&
              element.status.toUpperCase() !== 'COMPLETE'
            ) {
              allowApprove = true;
            }
          });
        }
      } else if (filter.currentMenuFilter !== 'complete') {
        teamReport.forEach(element => {
          if (
            selectedListId.indexOf(element._id) !== -1 &&
            element.status.toUpperCase() !== 'COMPLETE'
          ) {
            allowApprove = true;
          }
        });
      }
    }
    this.setState({ allowApprove });
  };

  fetchLocation = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'locations/fetch' });
  };

  fetchSummaryApproval = payload => {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/fetchSummaryApproval', payload });
  };

  fetchEmployeeList = () => {
    const payload = { status: ['ACTIVE'] };
    const { dispatch } = this.props;
    dispatch({ type: 'user/getEmployeeList', payload });
  };

  fetchTeamReport = (payload = {}) => {
    const { dispatch } = this.props;
    switch (payload.currentMenuFilter) {
      case 'all':
        dispatch({ type: 'reimbursement/fetchTeamReportAllReport', payload: { ...payload } }).then(
          () => {
            this.setState({ csvRecord: [] });
            this.reCheckAllowApprove();
          }
        );
        break;
      case 'pendingByUser':
      default:
        dispatch({ type: 'reimbursement/fetchTeamReportByUser', payload: { ...payload } }).then(
          () => {
            this.setState({ csvRecord: [] });
            this.reCheckAllowApprove();
          }
        );
        break;
    }
  };

  getDataWithPagination = data => {
    const { filter } = this.state;
    const payload = {
      ...filter,
      page: data.page,
      limit: data.limit,
    };
    this.setState({ filter: payload });
    this.fetchTeamReport(payload);
  };

  onSearch = value => {
    const { filter } = this.state;
    const payload = {
      ...filter,
      q: value,
    };
    this.fetchTeamReport(payload);
  };

  applyFilter = data => {
    this.fetchTeamReport(data);
    this.fetchSummaryApproval(data);
    this.setState({ isFiltering: true, filter: { ...data } });
    this.isShowHideFilterForm(false);
  };

  resetFilter = data => {
    let payload = data;
    payload = this.removeKey(payload, 'date');
    payload = this.removeKey(payload, 'amount');
    payload = this.removeKey(payload, 'status');
    payload = this.removeKey(payload, 'creators');
    payload = this.removeKey(payload, 'location');

    // delete data['date'];
    // delete data['amount'];
    // delete data['status'];
    // delete data['creators'];
    this.fetchTeamReport(payload);
    this.fetchSummaryApproval(payload);
    this.setState({ isFiltering: false, filter: { ...payload } });
    this.isShowHideFilterForm(false);
  };

  removeKey = (obj, deleteKey) => {
    const clone = Object.assign({}, obj);
    delete clone[deleteKey];
    return clone;
  };

  getCurrentYear = () => {
    return moment().year();
  };

  handleExport = item => {
    this.setState({ dialogExportOpen: true, exportType: item.key });
  };

  exportMenu = () => {
    const { selectedListId = [] } = this.state;
    return (
      <Menu onClick={item => this.handleExport(item)}>
        <Menu.Item key="exportcsv">
          <span>{formatMessage({ id: 'rp.exportCsv' })}</span>
        </Menu.Item>
        <Menu.Item key="exportpdf" disabled={selectedListId.length < 1}>
          <span>{formatMessage({ id: 'rp.exportPdf' })}</span>
        </Menu.Item>
      </Menu>
    );
  };

  getCsvRecord = () => {
    const { csvRecord = [] } = this.state;
    return csvRecord;
  };

  isShowHideFilterForm = status => {
    this.setState({ isShowFilterForm: status });
  };

  onCloseFilterForm = () => {
    this.isShowHideFilterForm(false);
  };

  setSelectedListId = value => {
    const {
      currentUser,
      reimbursement: { teamReport = [] },
    } = this.props;
    const { filter } = this.state;

    let allowApprove = false;
    if (value.length > 0) {
      if (currentUser.appRole !== 'FINANCE') {
        if (filter.currentMenuFilter === 'pendingByUser') {
          teamReport.forEach(element => {
            if (value.indexOf(element._id) !== -1 && element.status.toUpperCase() !== 'COMPLETE') {
              allowApprove = true;
            }
          });
        }
      } else if (filter.currentMenuFilter !== 'complete') {
        teamReport.forEach(element => {
          if (value.indexOf(element._id) !== -1 && element.status.toUpperCase() !== 'COMPLETE') {
            allowApprove = true;
          }
        });
      }
    }
    this.setState({ selectedListId: value, allowApprove });
  };

  onApprove = () => {
    const { dispatch } = this.props;
    const { selectedListId } = this.state;
    const payload = { action: 'approve', reIds: selectedListId };
    dispatch({ type: 'reimbursement/teamReportApprove', payload }).then(() => {
      this.onDialogClose();
      this.fetchAllData();
    });
  };

  onDialogOpen = () => {
    this.setState({
      dialogApproveOpen: true,
    });
  };

  onDialogClose = () => {
    this.setState({
      dialogApproveOpen: false,
    });
  };

  getApproveReportLength = () => {
    const { selectedListId } = this.state;
    let count = 0;
    const {
      reimbursement: { teamReport = [] },
    } = this.props;
    teamReport.forEach(element => {
      if (
        selectedListId.indexOf(element._id) !== -1 &&
        element.status.toUpperCase() !== 'COMPLETE'
      ) {
        count += 1;
      }
    });
    return count;
  };

  renderApproveDialogConfirm = () => {
    const { dialogApproveOpen } = this.state;
    const { loadingReview } = this.props;
    return (
      <Modal
        visible={dialogApproveOpen}
        className={styles.employee_new_report_dialog}
        title={formatMessage({ id: 'rp.approve.title' })}
        footer={[
          <Button
            key="back"
            onClick={() => {
              this.onDialogClose();
            }}
            style={{
              border: '1px solid #fca00a',
              color: '#fca00a',
              marginRight: '24px',
              height: '35px',
              minWidth: '100px',
              textTransform: 'uppercase',
            }}
          >
            {formatMessage({ id: 'rp.back' })}
          </Button>,
          <Button
            key="submit"
            onClick={() => {
              this.onApprove();
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
            loading={loadingReview}
          >
            {formatMessage({ id: 'rp.approve' })}
          </Button>,
        ]}
      >
        <div className={styles.employee_new_report_dialog_content}>
          <p style={{ color: '#000' }}>{formatMessage({ id: 'rp.approve.content_1' })}</p>
          <p style={{ color: '#fca00a', fontWeight: 'bold' }}>
            {formatMessage({ id: 'rp.approve.content_2' }, { len: this.getApproveReportLength() })}
          </p>
          <p style={{ color: '#000' }}>{formatMessage({ id: 'rp.approve.content_3' })}</p>
        </div>
      </Modal>
    );
  };

  generateCsvData = () => {
    const {
      reimbursement: { teamReport = [] },
    } = this.props;
    const { selectedListId } = this.state;
    const result = [];
    result.push(['Date', 'Number', 'Report Name', 'Owner', 'Completed On', 'Status', 'Amount']);
    const teamReportFilter =
      selectedListId.length > 0
        ? teamReport.filter(record => selectedListId.indexOf(record._id) !== -1)
        : teamReport;
    teamReportFilter.map(record => {
      return result.push([
        moment(record.updatedAt).format('MMM D, YYYY'),
        record.code,
        record.title,
        record.user ? record.user.fullName : '',
        record.status === 'COMPLETE' ? moment(record.updatedAt).format('MMM D, YYYY') : '',
        record.status,
        `${record.currency}${record.amount}`,
      ]);
    });
    return result;
  };

  generatePdfData = () => {
    const {
      reimbursement: { teamReport = [] },
    } = this.props;
    const { selectedListId } = this.state;
    const result =
      selectedListId.length > 0
        ? teamReport.filter(record => selectedListId.indexOf(record._id) !== -1)
        : teamReport;
    return result;
  };

  onOkExport = () => {
    const {
      currentUser: { company: { name: companyName = '', logoUrl: companyLogoUrl = '' } = {} } = {},
    } = this.props;

    const { exportType } = this.state;
    if (exportType === 'exportcsv') {
      const allRecord = this.generateCsvData();
      this.setState({ csvRecord: allRecord });
      if (allRecord.length > 0) {
        const exportProcess = setInterval(() => {
          const isCompletedRender = document.getElementById('completed-render-exportcsv');
          if (isCompletedRender) {
            document.getElementById('exportcsvbtn').click();
            clearInterval(exportProcess);
          }
        }, 500);
      }
    }
    if (exportType === 'exportpdf') {
      const listPdfExport = this.generatePdfData();
      ExportPDF(listPdfExport, companyLogoUrl, companyName);
    }

    this.setState({ dialogExportOpen: false, exportType: '' });
  };

  renderDownloadFile = () => {
    const { csvRecord = [] } = this.state;
    return (
      <span>
        {csvRecord.length > 0 && (
          <CSVLink
            data={csvRecord}
            filename="list-report.csv"
            id="exportcsvbtn"
            className={styles.hiddenLink}
            target="_blank"
          >
            <span id="completed-render-exportcsv">Download me</span>
          </CSVLink>
        )}
      </span>
    );
  };

  renderExportDialogConfirm = () => {
    const {
      reimbursement: { teamReport = [] },
    } = this.props;
    const { dialogExportOpen, exportType, selectedListId } = this.state;

    let csvLength = teamReport;
    if (selectedListId.length > 0) {
      csvLength = selectedListId;
    }

    return (
      <Modal
        wrapClassName={styles.wrapConfirmExport}
        visible={dialogExportOpen}
        title={formatMessage({ id: 'rp.exportReports' })}
        okText={formatMessage({ id: 'rp.export' }).toUpperCase()}
        closable={false}
        onCancel={() => this.setState({ dialogExportOpen: false, exportType: '' })}
        cancelText={formatMessage({ id: 'rp.cancel' }).toUpperCase()}
        onOk={this.onOkExport}
        okButtonProps={{ className: styles.popupOkBtn }}
        cancelButtonProps={{ className: styles.cancelBtn }}
      >
        <div className={styles.expopupContent}>
          <span className={styles.expopupDes}>
            {exportType === 'exportpdf' && (
              <FormattedHTMLMessage
                id="rp.expopupDes"
                values={{
                  len:
                    selectedListId.length > 1
                      ? `${selectedListId.length} reports`
                      : `${selectedListId.length} report`,
                }}
              />
            )}
            {exportType === 'exportcsv' && (
              <FormattedHTMLMessage
                id="rp.expopupDes"
                values={{
                  len:
                    csvLength.length > 1
                      ? `${csvLength.length} reports`
                      : `${csvLength.length} report`,
                }}
              />
            )}
          </span>
          <br />
          <br />
          <span>{formatMessage({ id: 'rp.expopupQuestion' })}</span>
        </div>
      </Modal>
    );
  };

  onMenuSelect = key => {
    const { filter } = this.state;
    if (key !== filter.currentMenuFilter) {
      const payload = {
        ...filter,
        currentMenuFilter: key,
      };
      this.fetchTeamReport(payload);
      this.setState({ filter: payload });
    }
  };

  onYearFilterChange = value => {
    const { filter } = this.state;
    const payload = {
      ...filter,
      year: value,
    };
    this.fetchSummaryApproval(payload);
    this.fetchTeamReport(payload);
    this.setState({ filter: payload });
  };

  formatNumber = num => {
    if (num > 1000000000) {
      const billion = num / 1000000000;
      return { precision: 3, suffix: 'B', value: billion };
    }
    if (num > 1000000) {
      const million = num / 1000000;
      return { precision: 3, suffix: 'M', value: million };
    }
    return { precision: 2, suffix: '', value: num };
  };

  getPrefix = () => {
    const {
      currency: { list: listCurrency = [] } = {},
      user: {
        currentUser: { location: { currency: { _id: userCurrency = '' } = {} } = {} } = {},
      } = {},
    } = this.props;
    const currentCurrency = listCurrency.find(item => item._id === userCurrency) || {};
    return currentCurrency.symbol || '';
  };

  render() {
    const {
      windowWidth,
      reimbursement: { teamReport = [], teamReportTotal = 0, summaryTeamReport = {} } = {},
      user: { employeeList = [] },
      listLocation,
    } = this.props;
    const {
      isShowFilterForm,
      filter,
      allowApprove,
      isFiltering,
      pendingByUserReport = Object.entries(summaryTeamReport).length > 1
        ? summaryTeamReport.pendingByUser
        : {},
      allReport = Object.entries(summaryTeamReport).length > 1 ? summaryTeamReport.all : {},
    } = this.state;

    const summaryMenu = [
      {
        key: 'pendingByUser',
        amount: Object.entries(pendingByUserReport).length > 1 ? pendingByUserReport.amount : 0,
        count: Object.entries(pendingByUserReport).length > 1 ? pendingByUserReport.total : 0,
      },
    ];
    summaryMenu.push({
      key: 'all',
      amount: Object.entries(allReport).length > 1 ? allReport.amount : 0,
      count: Object.entries(allReport).length > 1 ? allReport.total : 0,
    });
    const actionBtn = [
      {
        icon: (
          <>
            {isFiltering ? (
              <FilterFillIcon
                className={styles.iconPrimary}
                onClick={() => this.isShowHideFilterForm(true)}
              />
            ) : (
              <FilterIcon
                onClick={() => this.isShowHideFilterForm(true)}
                style={{ fill: 'black', width: 18 }}
              />
            )}
          </>
        ),
      },
      {
        icon: (
          <Dropdown overlay={this.exportMenu} trigger={['click']}>
            <a
              style={{ marginRight: 30 }}
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
            >
              <ExportIcon style={{ fill: 'black', width: 18 }} />
            </a>
          </Dropdown>
        ),
      },
    ];

    const getTotalReportLength = () => {
      return teamReportTotal;
    };
    return (
      <div className={styles.listRpWrapper}>
        <Row type="flex" justify="space-between">
          <div className={styles.title}>
            <span>{formatMessage({ id: 'teamreport.listTitle' })}</span>
          </div>
          <Row className={styles.headerSearch}>
            <div className={styles.headerSearchWrapContent}>
              <Select
                className={styles.selectFY}
                defaultValue={`FY ${this.getCurrentYear()}`}
                style={{ width: '100px' }}
                onChange={value => this.onYearFilterChange(value)}
              >
                <Option value="2018">FY 2018</Option>
                <Option value="2019">FY 2019</Option>
                <Option value="2020">FY 2020</Option>
              </Select>
            </div>
          </Row>
        </Row>
        <Row type="flex" justify="space-between" className={styles.menuArea}>
          <Col span={12}>
            <Menu
              selectedKeys={filter.currentMenuFilter}
              mode="horizontal"
              style={{ backgroundColor: '#eff2fa' }}
              onSelect={({ key }) => this.onMenuSelect(key)}
            >
              {summaryMenu.map(item => {
                return (
                  <Menu.Item key={item.key}>
                    <div className={styles.summary}>
                      <Statistic
                        value={this.formatNumber(item.amount).value}
                        prefix={this.getPrefix()}
                        suffix={this.formatNumber(item.amount).suffix}
                        precision={this.formatNumber(item.amount).precision}
                      />
                      <div className={styles.summaryCount}>
                        {`${formatMessage({
                          id: `rp.${item.key}`,
                        })} (${item.count})`}
                      </div>
                    </div>
                  </Menu.Item>
                );
              })}
              {this.renderDownloadFile()}
            </Menu>
          </Col>
          <Col className={styles.actionBtn}>
            <Search
              placeholder={formatMessage({ id: 'rp.searchTeamReport' })}
              onSearch={value => this.onSearch(value)}
              style={{ width: '286px', height: '44px', marginRight: '30px' }}
            />
            {actionBtn.map(item => {
              return <span className={styles.btn}>{item.icon}</span>;
            })}
            <Button
              className={styles.addBtn}
              type="primary"
              onClick={() => this.onDialogOpen()}
              disabled={!allowApprove}
            >
              {formatMessage({ id: 'rp.approve' }).toUpperCase()}
            </Button>
          </Col>
        </Row>
        <ListReportTable
          isViewReportInTeamReport
          list={teamReport}
          listLocation={listLocation}
          totalRecord={getTotalReportLength()}
          setSelectedListId={this.setSelectedListId}
          getDataWithPagination={this.getDataWithPagination}
          filter={filter}
          {...this.props}
        />
        <Drawer
          placement="right"
          title={
            <span className={styles.filterDrawerTitle}>
              {formatMessage({ id: 'common.filter' })}
            </span>
          }
          closable
          onClose={this.onCloseFilterForm}
          visible={isShowFilterForm}
          className={styles.filterDrawer}
          width={windowWidth <= 450 ? 'auto' : 450}
          headerStyle={{ padding: '41px 24px 0 49px', border: 'none' }}
          bodyStyle={{ borderRadius: 4, padding: '26px 50px 28px 50px' }}
        >
          <FilterForm
            filter={filter}
            applyFilter={this.applyFilter}
            resetFilter={this.resetFilter}
            listLocation={listLocation}
            employeeList={employeeList}
          />
        </Drawer>
        {this.renderApproveDialogConfirm()}
        {this.renderExportDialogConfirm()}
      </div>
    );
  }
}

export default windowSize(TeamReport);
