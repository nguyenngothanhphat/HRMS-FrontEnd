import React, { useState, useEffect } from 'react';
import {
  Row,
  Input,
  Select,
  Menu,
  Button,
  Drawer,
  Dropdown,
  Modal,
  Statistic,
  notification,
  List,
} from 'antd';
import Link from 'umi/link';
import { formatMessage, FormattedHTMLMessage } from 'umi-plugin-react/locale';
import { ReactComponent as ExportIcon } from '@/assets/svg/export.svg';
import { ReactComponent as FilterIcon } from '@/assets/svg/filter.svg';
import { ReactComponent as FilterFillIcon } from '@/assets/svg/filter_fill.svg';
import { connect } from 'dva';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import windowSize from 'react-window-size';
import ListReportTable from './ListReportTable';
import FilterForm from './FilterForm';
import styles from './index.less';
import ExportPDF from './ExportPDF';

const { Search } = Input;
const { Option } = Select;
const getCurrentYear = () => {
  return moment().year();
};
const Report = props => {
  const {
    windowWidth,
    dispatch,
    reimbursement: {
      recentReport = [],
      summaryReport: {
        ALL: allReport = {},
        REJECT: rejectReport = {},
        DRAFT: draftReport = {},
        INQUIRY: inquiryReport = {},
        REPORTED: reportedReport = {},
        COMPLETE: completeReport = {},
      } = {},
    } = {},
    loading,
    user: {
      currentUser: { company: { name: companyName, logoUrl: companyLogoUrl = '' } = {} } = {},
    } = {},
    user: { currentUser = {} } = {},
  } = props;

  const [currentMenuFilter, setCurrentMenuFilter] = useState('allreports');
  const [isShowFilterForm, setIsShowFilterForm] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [yearFilter, setYearFilter] = useState(getCurrentYear());
  const [csvRecord, setCsvRecord] = useState([]);
  const [selectedListID, setSelectedListID] = useState([]);
  const [confirmExport, setConfirmExport] = useState({
    isShow: false,
    type: '',
  });
  const onCloseFilterForm = () => {
    setIsShowFilterForm(false);
  };

  const onYearFilterChange = value => {
    setYearFilter(value);
    const payload = { year: value };
    dispatch({ type: 'reimbursement/filterRecentReport', payload });
    dispatch({ type: 'reimbursement/fetchSummary', payload });
    setCurrentMenuFilter('allreports');
  };

  const onMenuSelect = key => {
    if (key !== currentMenuFilter) {
      setCurrentMenuFilter(key);
      const payload = { year: yearFilter };
      switch (key) {
        case 'allreports':
          dispatch({ type: 'reimbursement/fetchRecentReport', payload });
          break;
        case 'reported':
          payload.status = 'PENDING';
          dispatch({ type: 'reimbursement/filterRecentReport', payload });
          break;
        default:
          payload.status = key.toUpperCase();
          dispatch({ type: 'reimbursement/filterRecentReport', payload });
          break;
      }
    }
  };

  const summaryMenu = [
    {
      key: 'allreports',
      amount: allReport.totalAmount,
      count: allReport.reportCount,
    },
    {
      key: 'reported',
      amount: reportedReport.totalAmount,
      count: reportedReport.reportCount,
    },
    {
      key: 'complete',
      amount: completeReport.totalAmount,
      count: completeReport.reportCount,
    },
    {
      key: 'inquiry',
      amount: inquiryReport.totalAmount,
      count: inquiryReport.reportCount,
    },
    {
      key: 'reject',
      amount: rejectReport.totalAmount,
      count: rejectReport.reportCount,
    },
    {
      key: 'draft',
      amount: draftReport.totalAmount,
      count: draftReport.reportCount,
    },
  ];

  const onSearch = value => {
    const payload = { q: value, year: yearFilter };
    dispatch({ type: 'reimbursement/filterRecentReport', payload });
  };
  useEffect(() => {
    const payload = { year: yearFilter };
    dispatch({ type: 'reimbursement/fetchRecentReport', payload });
    dispatch({ type: 'reimbursement/fetchSummary', payload });
  }, []);

  const convertStatusText = status => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'REPORTED';
      case 'COMPLETE':
        return 'APPROVED';
      default:
        return status;
    }
  };
  const actionBtn = [
    {
      key: 'filter',
      icon: (
        <>
          {isFiltering ? (
            <FilterFillIcon
              className={styles.iconPrimary}
              onClick={() => setIsShowFilterForm(true)}
            />
          ) : (
            <FilterIcon
              onClick={() => setIsShowFilterForm(true)}
              style={{ fill: 'black', width: 18 }}
            />
          )}
        </>
      ),
    },
  ];
  const generateCsvData = () => {
    const result = [];
    result.push(['Date', 'Number', 'Report Name', 'Owner', 'Completed On', 'Status', 'Amount']);
    recentReport.map(record => {
      return result.push([
        moment(record.updatedAt).format('MMM D, YYYY'),
        record.code,
        record.title,
        record.user ? record.user.fullName : '',
        record.status === 'COMPLETE' ? moment(record.updatedAt).format('MMM D, YYYY') : '',
        convertStatusText(record.status),
        `${record.currency}${record.amount}`,
      ]);
    });
    return result;
  };
  const generatePdfData = () => {
    const result = recentReport.filter(record => selectedListID.indexOf(record._id) !== -1);
    return result;
  };
  const handleExport = item => {
    setConfirmExport({
      isShow: true,
      type: item.key,
    });
  };
  const onOkExport = () => {
    if (confirmExport.type === 'exportcsv') {
      const allRecord = generateCsvData();
      setCsvRecord(allRecord);
    }
    if (confirmExport.type === 'exportpdf') {
      const listPdfExport = generatePdfData();
      ExportPDF(listPdfExport, companyLogoUrl, companyName);
    }
    setConfirmExport({
      isShow: false,
      type: '',
    });
  };
  useEffect(() => {
    if (csvRecord.length > 0) {
      const exportProcess = setInterval(() => {
        const isCompletedRender = document.getElementById('completed-render-exportcsv');
        if (isCompletedRender) {
          document.getElementById('exportcsvbtn').click();
          clearInterval(exportProcess);
        }
      }, 500);
    }
  }, [csvRecord]);
  useEffect(() => {
    if (csvRecord.length > 0) {
      setCsvRecord([]);
    }
  }, [recentReport]);
  const exportMenu = (
    <Menu onClick={item => handleExport(item)}>
      <Menu.Item key="exportcsv">
        <span>{formatMessage({ id: 'rp.exportCsv' })}</span>
      </Menu.Item>
      <Menu.Item key="exportpdf" disabled={selectedListID.length < 1}>
        <span>{formatMessage({ id: 'rp.exportPdf' })}</span>
      </Menu.Item>
    </Menu>
  );

  const formatNumber = num => {
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
  const getPrefix = () => {
    const {
      currency: { list: listCurrency = [] } = {},
      user: {
        currentUser: { location: { currency: { _id: userCurrency = '' } = {} } = {} } = {},
      } = {},
    } = props;
    const currentCurrency = listCurrency.find(item => item._id === userCurrency) || {};
    return currentCurrency.symbol || '';
  };

  const isAllowAddReport = () => {
    return !!currentUser.manager;
  };

  const showError = error => {
    notification.error({
      message: 'Process fail',
      description: (
        <List
          size="small"
          dataSource={[error]}
          renderItem={msg => <List.Item key={msg}>{msg}</List.Item>}
        />
      ),
    });
  };

  const currentYear = getCurrentYear();
  return (
    <div className={styles.listRpWrapper}>
      <Row type="flex" justify="space-between">
        <div className={styles.title}>
          <span>{formatMessage({ id: 'rp.listTitle' })}</span>
        </div>
        <Row className={styles.headerSearch}>
          <div className={styles.headerSearchWrapContent}>
            <Search
              placeholder={formatMessage({ id: 'rp.searchPH' })}
              onSearch={value => onSearch(value)}
              style={{ width: '286px', height: '44px', marginRight: '22px' }}
            />
            <Select
              className={styles.selectFY}
              defaultValue={currentYear.toString()}
              style={{ width: '100px' }}
              onChange={value => onYearFilterChange(value)}
            >
              <Option key={currentYear}>{`FY ${currentYear}`}</Option>
              <Option key={currentYear - 1}>{`FY ${currentYear - 1}`}</Option>
              <Option key={currentYear - 2}>{`FY ${currentYear - 2}`}</Option>
            </Select>
          </div>
        </Row>
      </Row>
      <Row type="flex" justify="space-between" className={styles.menuArea}>
        <Menu
          selectedKeys={currentMenuFilter}
          mode="horizontal"
          onSelect={({ key }) => onMenuSelect(key)}
          overflowedIndicator={null}
          style={{ backgroundColor: '#eff2fa', width: '61%' }}
        >
          {summaryMenu.map(item => {
            return (
              <Menu.Item key={item.key}>
                <div className={styles.summary}>
                  <Statistic
                    value={formatNumber(item.amount).value}
                    prefix={getPrefix()}
                    suffix={formatNumber(item.amount).suffix}
                    precision={formatNumber(item.amount).precision}
                  />
                  <div className={styles.summaryCount}>
                    {`${formatMessage({
                      id: `rp.${item.key === 'complete' ? 'approved' : item.key}`,
                    })} (${item.count})`}
                  </div>
                </div>
              </Menu.Item>
            );
          })}
        </Menu>
        <div className={styles.actionBtn}>
          {actionBtn.map(item => {
            return (
              <span key={item.key} className={styles.btn}>
                {item.icon}
              </span>
            );
          })}
          <Dropdown overlay={exportMenu} trigger={['click']}>
            <a
              style={{ marginRight: 30 }}
              className="ant-dropdown-link"
              onClick={e => e.preventDefault()}
            >
              <ExportIcon />
            </a>
          </Dropdown>
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

          <Link
            to={isAllowAddReport() ? 'report/new' : '#'}
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              isAllowAddReport()
                ? ''
                : showError(formatMessage({ id: 'rp.errorMessage.withoutManager' }));
              dispatch({ type: 'bill/saveSelectedList', payload: { selectedList: [] } });
            }}
          >
            <Button className={styles.addBtn} type="primary" icon="plus">
              {formatMessage({ id: 'rp.add' }).toUpperCase()}
            </Button>
          </Link>
        </div>
      </Row>
      <ListReportTable
        list={recentReport}
        selectedListID={selectedListID}
        setSelectedListID={setSelectedListID}
        loading={loading}
        {...props}
      />
      <Drawer
        placement="right"
        title={
          <span className={styles.filterDrawerTitle}>{formatMessage({ id: 'common.filter' })}</span>
        }
        closable
        onClose={onCloseFilterForm}
        visible={isShowFilterForm}
        className={styles.filterDrawer}
        width={windowWidth <= 450 ? 'auto' : 450}
        headerStyle={{ padding: '41px 24px 0 49px', border: 'none' }}
        bodyStyle={{ borderRadius: 4, padding: '26px 50px 28px 50px' }}
      >
        <FilterForm
          yearFilter={yearFilter}
          dispatch={dispatch}
          closeFilterForm={() => setIsShowFilterForm(false)}
          setIsFiltering={setIsFiltering}
        />
      </Drawer>
      <Modal
        wrapClassName={styles.wrapConfirmExport}
        visible={confirmExport.isShow}
        title={formatMessage({ id: 'rp.exportReports' })}
        okText={formatMessage({ id: 'rp.export' }).toUpperCase()}
        closable={false}
        onCancel={() =>
          setConfirmExport({
            isShow: false,
            type: '',
          })
        }
        cancelText={formatMessage({ id: 'rp.cancel' }).toUpperCase()}
        onOk={onOkExport}
        okButtonProps={{ className: styles.popupOkBtn }}
        cancelButtonProps={{ className: styles.cancelBtn }}
      >
        <div className={styles.expopupContent}>
          <span className={styles.expopupDes}>
            {confirmExport.type === 'exportpdf' && (
              <FormattedHTMLMessage
                id="rp.expopupDes"
                values={{
                  len:
                    selectedListID.length > 1
                      ? `${selectedListID.length} reports`
                      : `${selectedListID.length} report`,
                }}
              />
            )}
            {confirmExport.type === 'exportcsv' && (
              <FormattedHTMLMessage
                id="rp.expopupDes"
                values={{
                  len:
                    recentReport.length > 1
                      ? `${recentReport.length} reports`
                      : `${recentReport.length} report`,
                }}
              />
            )}
          </span>
          <br />
          <br />
          <span>{formatMessage({ id: 'rp.expopupQuestion' })}</span>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ loading, reimbursement, user, currency }) => ({
  user,
  reimbursement,
  loading: loading.models.reimbursement,
  currency,
}))(windowSize(Report));
