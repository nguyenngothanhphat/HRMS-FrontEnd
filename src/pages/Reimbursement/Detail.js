import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Card, Col, Divider, Tag, Drawer, Button, Menu, Icon, Dropdown } from 'antd';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ExpenseTable from '@/components/ExpenseTable';
import PriceInput from '@/components/PriceInput';
import check from '@/components/Authorized/CheckPermissions';
import StatusBox from '@/components/StatusBox';
import Crypto from '@/utils/Crypto';
import styles from './Detail.less';
import MessageBox from './components/MessageBox/index';
import ReviewBox from './components/ReviewBox';
import StatusFlow from './components/StatusFlow';
import ReportHistory from './components/ReportHistory';
import ExportPDF from './components/ExportPDF';
import ExportExcel from './components/ExportExcel';

@connect(
  ({
    bill,
    user: { currentUser },
    loading,
    reimbursement: { item, errors, action: actionReimbursement },
    reportHistory: { activities },
    setting,
  }) => ({
    bill,
    currentUser,
    loading: loading.models.reimbursement,
    item,
    errors,
    actionReimbursement,
    activities,
    setting,
  })
)
class Detail extends PureComponent {
  state = {
    visibleComment: false,

    // eslint-disable-next-line react/no-unused-state
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { reId },
      },
    } = this.props;
    dispatch({ type: 'reimbursement/fetchItem', payload: reId });
    dispatch({ type: 'customer/fetch' });
    dispatch({ type: 'reportHistory/fetchItem', payload: reId });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'reimbursement/save', payload: { item: false } });
    dispatch({ type: 'bill/save', payload: { selectedList: [], tempBillList: [] } });
    dispatch({ type: 'reportHistory/save', payload: { activities: [] } });
  }

  showDrawerComment = () => {
    this.setState({
      visibleComment: true,
    });
  };

  onCloseComment = () => {
    this.setState({
      visibleComment: false,
    });
  };

  showHistory = () => {
    this.setState({
      visibleHistory: true,
    });
  };

  hideHistory = () => {
    this.setState({
      visibleHistory: false,
    });
  };

  handlerAfterVisibleChange = visible => {
    if (visible) this.carousel = React.createRef();
  };

  render() {
    const {
      item,
      loading,
      match: {
        params: { action },
      },
      dispatch,
      currentUser,
      setting,
    } = this.props;
    const { email: myEmail = '' } = currentUser;
    const { user: { email: reportOwner = '' } = {} } = item;
    const { item: { appearance: { docLogo = '' } = {}, name: companyName = '' } = {} } = setting;
    const { visibleComment, visibleHistory } = this.state;

    const getBillData = data => {
      const billData = [];
      data.forEach(report => {
        billData.push(
          ...[{ reportId: report.id, amount: report.amount }, ...report.bills, { space: true }]
        );
      });
      return billData;
    };

    const menu = i => {
      const billData = getBillData(i ? [i] : []);
      return (
        <Menu>
          <Menu.Item key="excel">
            <ExportExcel data={[i]} billData={billData} />
          </Menu.Item>
          <Menu.Item key="pdf" onClick={() => ExportPDF([i], docLogo, companyName)}>
            <div>
              <Icon type="file-pdf" />
              <span className={styles.ml10}>PDF</span>
            </div>
          </Menu.Item>
        </Menu>
      );
    };

    const renderActionButton = i => {
      const titleId = 'common.button.export';
      const iconType = 'upload';
      return (
        <Dropdown overlay={menu(i)}>
          <Button style={{ marginRight: 15, fontSize: 14 }} type="primary" shape="round">
            <Icon type={iconType} />
            <FormattedMessage id={titleId} /> <Icon type="down" />
          </Button>
        </Dropdown>
      );
    };

    return (
      <div onClick={this.handleFocus} className={styles.root}>
        <Card loading={loading}>
          <Row type="flex" justify="space-between" style={{ paddingBottom: '10px' }}>
            <Col>
              <h3>
                <FormattedMessage id="reimbursement.summary" />
              </h3>
            </Col>
            <Col>
              {action === 'review' && myEmail !== reportOwner ? (
                <div className={styles.reviewBox}>
                  {renderActionButton(item)}
                  <ReviewBox
                    dispatch={dispatch}
                    reId={item.id}
                    status={item.status}
                    commentDetai={item.commentDetai}
                  />
                  <Button
                    className={styles.btnHistory}
                    type="primary"
                    shape="circle"
                    icon="history"
                    onClick={this.showHistory}
                  />
                </div>
              ) : (
                <div>
                  {renderActionButton(item)}
                  <Tag
                    className={styles.tag}
                    color="#096dd9"
                    onClick={() => this.showDrawerComment()}
                  >
                    <FormattedMessage id="reimbursement.comment" />
                  </Tag>
                  <Button type="primary" shape="circle" icon="history" onClick={this.showHistory} />
                </div>
              )}
            </Col>
          </Row>
          <Divider />
          <Row type="flex" justify="space-between" align="top">
            <Col span={16}>
              <Row className={styles.row}>
                <Col span={4}>
                  <strong>
                    <FormattedMessage id="common.reportID" />
                  </strong>
                </Col>
                <Col className={styles.textReportID} span={20}>
                  {Crypto.encryptShort(item.id)}
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={4}>
                  <strong>
                    <FormattedMessage id="reimbursement.creator" />
                  </strong>
                </Col>
                <Col className={styles.text} span={20}>
                  {item.user && item.user.fullName}
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={4}>
                  <strong>
                    <FormattedMessage id="common.description" />
                  </strong>
                </Col>
                <Col className={styles.text} span={20}>
                  {item.description}
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={4}>
                  <strong>
                    <FormattedMessage id="reimbursement.submit-date" />
                  </strong>
                </Col>
                <Col className={styles.text} span={20}>
                  {moment(item.createdAt).format('DD/MM/YYYY')}
                </Col>
              </Row>
              {!check(['customer'], true, false) && (
                <Row className={styles.row}>
                  <Col span={4}>
                    <strong>
                      <FormattedMessage id="common.status" />
                    </strong>
                  </Col>
                  <Col span={20}>
                    <StatusBox status={item.status} />
                  </Col>
                </Row>
              )}
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <PriceInput
                className={styles.currency}
                value={{ currency: item.currency, number: item.amount }}
              />
            </Col>
            {!check(['customer'], true, false) && <StatusFlow item={item} />}
          </Row>
          <Divider />
          <ExpenseTable
            title={formatMessage({ id: 'dashboard.card.bill.title' })}
            list={item.bills || []}
          />
        </Card>
        <Drawer
          title={formatMessage({ id: 'reimbursement.comment-detail' })}
          placement="right"
          onClose={this.onCloseComment}
          visible={visibleComment}
          width={500}
          afterVisibleChange={this.handlerAfterVisibleChange}
        >
          <MessageBox isReview={action === 'review'} comments={item.comments} user={currentUser} />
        </Drawer>
        <Drawer
          title={formatMessage({ id: 'reimbursement.history' })}
          placement="right"
          onClose={this.hideHistory}
          visible={visibleHistory}
          width={500}
          afterVisibleChange={this.handlerAfterVisibleChange}
        >
          <ReportHistory />
        </Drawer>
      </div>
    );
  }
}

export default Detail;
