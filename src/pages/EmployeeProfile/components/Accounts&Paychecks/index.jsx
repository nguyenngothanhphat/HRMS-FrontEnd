import React, { PureComponent } from 'react';
import { Row, Col, Collapse, Skeleton, Button, Modal } from 'antd';
import { connect } from 'umi';
import { PlusOutlined, MinusOutlined, EditFilled } from '@ant-design/icons';
import ViewBank from './components/View/ViewBank';
import EditBank from './components/Edit/EditBank';
import ViewTax from './components/View/ViewTax';
import EditTax from './components/Edit/EditTax';
import PaySlipMonth from './components/PayslipMonth';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      editGeneral: { openTax, openBank } = {},
      originData: { bankData: bankDataOrigin = {}, taxData: taxDataOrigin = {} },
      tempData: { bankData = {}, taxData = {} } = {},
      visibleSuccess = false
    } = {},
  }) => ({
    loadingTax: loading.effects['employeeProfile/fetchTax'],
    loadingBank: loading.effects['employeeProfile/fetchBank'],
    openTax,
    openBank,
    bankDataOrigin,
    visibleSuccess,
    taxDataOrigin,
    bankData,
    taxData,
  }),
)
class AccountsPaychecks extends PureComponent {
  handleIconCollapse = (isActive) => {
    return isActive ? <MinusOutlined className={styles.minusIcon} /> : <PlusOutlined />;
  };

  handleEdit = (name) => {
    if (name === 'bank') {
      const { dispatch } = this.props;
      dispatch({
        type: 'employeeProfile/saveOpenEdit',
        payload: { openBank: true },
      });
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
      const { bankDataOrigin, bankData, dispatch } = this.props;
      const reverseFields = {
        bankName: bankDataOrigin[0] ? bankDataOrigin[0].bankName : '-',
        accountNumber: bankDataOrigin[0] ? bankDataOrigin[0].accountNumber : '-',
        accountType: bankDataOrigin[0] ? bankDataOrigin[0].accountType : '-',
        ifscCode: bankDataOrigin[0] ? bankDataOrigin[0].ifscCode : '-',
        micrcCode: bankDataOrigin[0] ? bankDataOrigin[0].micrcCode : '-',
        uanNumber: bankDataOrigin[0] ? bankDataOrigin[0].uanNumber : '-',
      };
      const bankList = [...bankData];
      const payload = { ...bankList[0], ...reverseFields };
      bankList.splice(0, 1, payload);
      const isModified = JSON.stringify(bankList) !== JSON.stringify(bankDataOrigin);
      dispatch({
        type: 'employeeProfile/saveTemp',
        payload: { bankData: bankList },
      });
      dispatch({
        type: 'employeeProfile/save',
        payload: { isModified },
      });
      dispatch({
        type: 'employeeProfile/saveOpenEdit',
        payload: { openBank: false },
      });
    }
    if (name === 'tax') {
      const { taxDataOrigin, taxData, dispatch } = this.props;
      const reverseFields = {
        incomeTaxRule: taxDataOrigin[0] ? taxDataOrigin[0].incomeTaxRule : '-',
        panNum: taxDataOrigin[0] ? taxDataOrigin[0].panNum : '-',
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

  handleCancelModelSuccess = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'employeeProfile/save',
      payload: {visibleSuccess: false}
    })
  };

  render() {
    const { openTax, loadingTax, openBank, loadingBank, visibleSuccess } = this.props;
    const { Panel } = Collapse;
    const getyear = new Date();
    const year = getyear.getFullYear();
    const renderTax = openTax ? <EditTax handleCancel={this.handleCancel} /> : <ViewTax />;
    const renderBank = openBank ? <EditBank handleCancel={this.handleCancel} /> : <ViewBank />;
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
            {loadingBank ? (
              <div className={styles.viewLoading}>
                <Skeleton loading={loadingBank} active />
              </div>
            ) : (
              renderBank
            )}
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
        <Modal
          visible={visibleSuccess}
          className={styles.modalUpdateSuccess}
          footer={null}
          width="30%"
          onCancel={this.handleCancelModelSuccess}
        >
          <div style={{ textAlign: 'center' }}>
            <img src={imageAddSuccess} alt="update success" />
          </div>
          <br />
          <br />
          <p style={{ textAlign: 'center', color: '#707177' }}>Update infomation successfully</p>
          <div className={styles.spaceFooterModalSuccess}>
            <Button onClick={this.handleCancelModelSuccess} className={styles.btnOkModalSuccess}>
              Okay
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AccountsPaychecks;
