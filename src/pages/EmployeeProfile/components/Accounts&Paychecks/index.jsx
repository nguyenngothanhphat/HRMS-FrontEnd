import React, { PureComponent } from 'react';
import { Row, Col, Collapse, Skeleton } from 'antd';
import { connect } from 'umi';
import { PlusOutlined, MinusOutlined, EditFilled } from '@ant-design/icons';
import ViewBank from './components/View/ViewBank';
import EditBank from './components/Edit/EditBank';
import ViewTax from './components/View/ViewTax';
import EditTax from './components/Edit/EditTax';
import PaySlipMonth from './components/PayslipMonth';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      editGeneral: { openTax, openBank } = {},
      originData: { bankData: bankDataOrigin = {}, taxData: taxDataOrigin = {} },
      tempData: { bankData = {}, taxData = {} } = {},
    } = {},
  }) => ({
    loadingTax: loading.effects['employeeProfile/fetchTax'],
    openTax,
    openBank,
    bankDataOrigin,
    taxDataOrigin,
    bankData,
    taxData,
  }),
)
class AccountsPaychecks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openEditBank: false,
    };
  }

  handleIconCollapse = (isActive) => {
    return isActive ? <MinusOutlined className={styles.minusIcon} /> : <PlusOutlined />;
  };

  handleEdit = (name) => {
    if (name === 'bank') {
      this.setState({ openEditBank: true });
    }
    if (name === 'tax') {
      const { dispatch } = this.props;
      dispatch({
        type: 'employeeProfile/saveOpenEdit',
        payload: { openTax: true },
      });
    }
  };

  handleCancel = (name) => {
    if (name === 'bank') {
      this.setState({ openEditBank: false });
    }
    if (name === 'tax') {
      const { taxDataOrigin, taxData, dispatch } = this.props;
      const reverseFields = {
        incomeTaxRule: taxDataOrigin[0] ? taxDataOrigin[0].incomeTaxRule : '',
        panNum: taxDataOrigin[0] ? taxDataOrigin[0].panNum : '',
      };
      const taxList = [...taxData];
      const payload = { ...taxData[0], ...reverseFields };
      taxList.splice(0, 1, payload);
      const isModified = JSON.stringify(taxList) !== JSON.stringify(taxDataOrigin);
      dispatch({
        type: 'employeeProfile/saveTemp',
        payload: { taxData: taxList },
      });
      dispatch({
        type: 'employeeProfile/save',
        payload: { isModified },
      });
      dispatch({
        type: 'employeeProfile/saveOpenEdit',
        payload: { openTax: false },
      });
    }
  };

  render() {
    const { openEditBank } = this.state;
    const { openTax, loadingTax } = this.props;
    const { Panel } = Collapse;
    const getyear = new Date();
    const year = getyear.getFullYear();
    const renderTax = openTax ? <EditTax handleCancel={this.handleCancel} /> : <ViewTax />;
    return (
      <div className={styles.AccountPaychecks}>
        <Row className={styles.TableBankDetails}>
          <Col span={24}>
            <div>
              <div className={styles.spaceTitle}>
                <Row>
                  <Col span={21}>
                    <p className={styles.TitleDetails}>Bank Details</p>
                  </Col>
                  <Col span={3} className={styles.flexEdit} onClick={() => this.handleEdit('bank')}>
                    <EditFilled className={styles.IconEdit} />
                    <p className={styles.TitleDetailsEdit}>Edit</p>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col span={24}>
            {openEditBank ? <EditBank handleCancel={this.handleCancel} /> : <ViewBank />}
          </Col>
        </Row>

        <Row className={styles.TableTaxDetails}>
          <Col span={24} className>
            <div>
              <div className={styles.spaceTitle}>
                <Row>
                  <Col span={21}>
                    <p className={styles.TitleDetails}>Tax Details</p>
                  </Col>
                  <Col span={3} className={styles.flexEdit} onClick={() => this.handleEdit('tax')}>
                    <EditFilled className={styles.IconEdit} />
                    <p className={styles.TitleDetailsEdit}>Edit</p>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col span={24}>
            {loadingTax ? (
              <div className={styles.viewLoading}>
                <Skeleton loading={loadingTax} active />
              </div>
            ) : (
              renderTax
            )}
          </Col>
        </Row>
        <Row className={styles.TableBankDetails}>
          <Col span={24}>
            <Collapse
              defaultActiveKey={['1']}
              className={styles.CollapseYear}
              expandIconPosition="right"
              expandIcon={({ isActive }) => this.handleIconCollapse(isActive)}
            >
              <Panel header={`Pay Slips : Year ${year}`} key="1">
                <PaySlipMonth />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountsPaychecks;
