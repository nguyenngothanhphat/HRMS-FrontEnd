import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { ExcelRenderer } from 'react-excel-renderer';
import { Form, Steps, Button, Icon, Row, Col, Upload, Divider, Table } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import ReimTable from '@/components/ReimTable';
import ExpenseTable from './components/ExpenseTable';
import styles from './index.less';

const StepItem = Steps.Step;
@connect(({ potential, loading, user, reimbursement, bill: { match, unMatch, listBills } }) => ({
  user,
  loading: loading.models.user,
  reimbursement,
  match,
  unMatch,
  potential,
  listBills,
}))
@Form.create()
class Potential extends PureComponent {
  pagination = {
    showSizeChanger: false,
    showQuickJumper: false,
    hideOnSinglePage: true,
    pageSize: 5,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      rows: [],
    };
  }

  next = () => {
    const { current } = this.state;
    const number = current + 1;
    this.setState({ current: number > 4 ? 3 : number });
  };

  runMatching = () => {
    const {
      reimbursement: { selectedList },
      dispatch,
    } = this.props;
    const { rows: listTransaction } = this.state;
    const listBills = [];
    const listBillsUnMatch = [];
    const transMatch = [];
    const listOriginBill = [];
    selectedList.approval[0].bills.forEach(item =>
      listOriginBill.push({ ...item, transaction: undefined })
    );
    listOriginBill.forEach(b => {
      const data = listTransaction.find(
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
    const transEror = listTransaction.filter(r => transMatch.indexOf(r) === -1);
    listBillsUnMatch.forEach(b => {
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

    this.next();
  };

  reset = () => {
    this.setState({ current: 0, rows: [] });
  };

  back = () => {
    const { current } = this.state;
    const number = current - 1;
    this.setState({ current: number < 0 ? 0 : number });
  };

  getJsDateFromExcel = excelDate => {
    let date;
    if (typeof excelDate === 'number') {
      const t = new Date(1900, 0, excelDate - 1);
      date = moment(t).format('MM/DD/YYYY');
    } else {
      date = excelDate;
    }
    return date;
  };

  renderFile = fileObj => {
    // just pass the fileObj as parameter;
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        // console.log(err);
      } else {
        const columns = [{ key: 0, name: '' }];
        resp.cols.forEach((item, index) =>
          columns.push({ key: item.key + 1, name: resp.rows[0][index] })
        );
        const data = [];
        resp.rows.forEach(
          (item, index) =>
            item.length !== 0 &&
            data.push({
              key: index,
              lastName: item[0],
              firstName: item[1],
              processDate: this.getJsDateFromExcel(item[2]),
              date: this.getJsDateFromExcel(item[3]),
              reference: item[4],
              amount: item[5],
              description1: item[6],
              description2: item[7],
            })
        );
        data.shift();
        this.setState({
          rows: data,
        });
      }
    });
  };

  listBillsMatch = () => {
    const { listBills } = this.props;
    const match = listBills.filter(b => b.match === true);
    return match;
  };

  listBillsUnMatch = () => {
    const { listBills } = this.props;
    const unMatch = listBills.filter(b => b.match === false);
    return unMatch;
  };

  totalAmount = () => {
    const { listBills } = this.props;
    const match = listBills.filter(b => b.match === true);
    let result = 0;
    match.forEach(m => {
      result += parseInt(m.amount, 10);
    });
    return result;
  };

  submit = () => {
    const {
      dispatch,
      listBills,
      reimbursement: { selectedList },
    } = this.props;
    const list = [];
    listBills.forEach(item =>
      list.push({ ...item, creditCard: item.creditCard && item.creditCard._id })
    );
    dispatch({
      type: 'potential/matching',
      payload: {
        reId: selectedList.approval[0].id,
        bills: list,
      },
    });
    this.next();
  };

  render() {
    const { current, rows } = this.state;
    // const arr = this.checkTitle();
    const { pagination } = this;
    const columns = [
      {
        title: formatMessage({ id: 'bill.transaction.lastName' }).toUpperCase(),
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: formatMessage({ id: 'bill.transaction.firstName' }).toUpperCase(),
        dataIndex: 'firstName',
        key: 'firstName',
      },
      {
        title: formatMessage({ id: 'bill.transaction.processDate' }).toUpperCase(),
        dataIndex: 'processDate',
        key: 'processDate',
      },
      {
        title: formatMessage({ id: 'bill.transaction.transactionDate' }).toUpperCase(),
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: formatMessage({ id: 'bill.transaction.refNo' }).toUpperCase(),
        dataIndex: 'reference',
        key: 'reference',
      },
      {
        title: formatMessage({ id: 'bill.transaction.amount' }).toUpperCase(),
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: formatMessage({ id: 'bill.transaction.description1' }).toUpperCase(),
        dataIndex: 'description1',
        key: 'description1',
      },
      {
        title: formatMessage({ id: 'bill.transaction.description2' }).toUpperCase(),
        dataIndex: 'description2',
        key: 'description2',
      },
    ];
    const {
      reimbursement: { selectedList },
    } = this.props;
    const type = 'approval';
    const currentSelectedList = selectedList[type];

    const titleSteps = [
      formatMessage({ id: 'potential.import-bank-transaction' }),
      formatMessage({ id: 'potential.select-report' }),
      formatMessage({ id: 'potential.potential-match' }),
    ];
    const propsUpload = {
      name: 'file',
      showUploadList: false,
      accept: '.xlsx, .csv',
      onChange: info => {
        this.renderFile(info.file);
      },
      beforeUpload: () => false,
    };
    return (
      <div className={styles.content}>
        <Row>
          <Col span={18} offset={3}>
            <Steps current={current} labelPlacement="vertical" className={styles.styleStep}>
              {titleSteps.map(item => (
                <StepItem key={item} title={item} />
              ))}
            </Steps>
          </Col>
        </Row>
        <div>
          {current === 3 && (
            <Row gutter={24} style={{ paddingTop: '20px' }}>
              <Col span={5} offset={7}>
                <Link to={`/report/review/${selectedList.approval[0].id}`}>
                  <Button type="primary" style={{ width: '100%' }}>
                    {formatMessage({ id: 'potential.button.view-report' }).toUpperCase()}
                  </Button>
                </Link>
              </Col>
              <Col span={5}>
                <Button style={{ width: '100%' }} onClick={() => this.reset()}>
                  {formatMessage({ id: 'potential.button.back' }).toUpperCase()}
                </Button>
              </Col>
            </Row>
          )}
          <Row type="flex" align="middle" justify="space-between" style={{ padding: '30px 0' }}>
            <Col span={12}>
              {current === 0 && (
                <Upload {...propsUpload}>
                  <Button type="primary">
                    <img alt="logo" src="/assets/img/import-2.png" />
                    <span style={{ paddingLeft: '10px' }}>
                      {formatMessage({ id: 'potential.import-bank-transaction' }).toUpperCase()}
                    </span>
                  </Button>
                </Upload>
              )}
              {current === 1 && (
                <div style={{ fontSize: '20px', fontWeight: '600' }}>
                  <FormattedMessage id="potential.select-report" />
                </div>
              )}
            </Col>
            <Col>
              <div>
                {current !== 3 && current !== 0 && (
                  <Button className={styles.btnReset} onClick={() => this.back()}>
                    {formatMessage({ id: 'potential.button.back' }).toUpperCase()}
                  </Button>
                )}
                {current === 0 && (
                  <Button
                    className={`${styles.btnReset} ${styles.btnNext}`}
                    type="primary"
                    onClick={() => this.next()}
                    // disabled={current < arr.length - 1 && undefined}
                    disabled={rows.length > 0 ? undefined : true}
                  >
                    {formatMessage({ id: 'potential.button.next' }).toUpperCase()}
                    <Icon type="double-right" />
                  </Button>
                )}
                {current === 1 && (
                  <Button
                    className={`${styles.btnReset} ${styles.btnNext}`}
                    type="primary"
                    onClick={() => this.runMatching()}
                    // disabled={current < arr.length - 1 && undefined}
                    disabled={selectedList.approval.length > 0 ? undefined : true}
                  >
                    {formatMessage({ id: 'potential.button.next' }).toUpperCase()}
                    <Icon type="double-right" />
                  </Button>
                )}
                {current === 2 && (
                  <Button
                    className={`${styles.btnReset} ${styles.btnNext}`}
                    type="primary"
                    onClick={() => this.submit()}
                  >
                    {formatMessage({ id: 'potential.button.save-matching' }).toUpperCase()}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          {current === 0 && (
            <Table
              columns={columns}
              dataSource={rows}
              scroll={{ x: 'fit-content' }}
              pagination={pagination}
            />
          )}
          {current === 1 && (
            <div>
              <ReimTable type={type} selectedList={currentSelectedList} isPotential />
              <Divider />
              {selectedList.approval.length > 0 && (
                <ExpenseTable
                  titleTable={formatMessage({ id: 'potential.report-details' }).toUpperCase()}
                  list={selectedList.approval[0].bills}
                />
              )}
            </div>
          )}
          {current === 2 && (
            <div>
              <ExpenseTable
                titleTable={formatMessage({ id: 'potential.match' })}
                matchPage
                isMatch
                list={this.listBillsMatch()}
              />
              <Divider />
              <ExpenseTable
                titleTable={formatMessage({ id: 'potential.mismatch' })}
                matchPage
                list={this.listBillsUnMatch()}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Potential;
