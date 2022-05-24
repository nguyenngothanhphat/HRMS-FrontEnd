import React, { useState } from 'react';
import { Row, Col, Skeleton, Button } from 'antd';

import { connect } from 'umi';
import EditBtn from '@/assets/edit.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import ModalAddBank from './component/ModalAddBank';
import plusIcon from '@/assets/add-adminstrator.svg';
import CommonModal from '@/components/CommonModal';
import EditBank from './component/EditBank';
import ViewBank from './component/ViewBank';

import styles from './index.less';

const BankAccount = (props) => {
  const [visible, setVisible] = useState(false);

  const {
    openBank,
    loadingBank,
    visibleSuccess,
    bankDataOrigin,
    dispatch,
    profileOwner = false,
  } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openBank: true },
    });
  };

  const handleCancelModelSuccess = () => {
    dispatch({
      type: 'employeeProfile/save',
      payload: { visibleSuccess: false },
    });
  };

  const handleCancel = () => {
    const reverseFields = {
      bankName: bankDataOrigin[0] ? bankDataOrigin[0].bankName : '-',
      branchName: bankDataOrigin[0] ? bankDataOrigin[0].branchName : '-',
      accountNumber: bankDataOrigin[0] ? bankDataOrigin[0].accountNumber : '-',
      accountType: bankDataOrigin[0] ? bankDataOrigin[0].accountType : '-',
      swiftcode: bankDataOrigin[0] ? bankDataOrigin[0].swiftcode : '-',
      routingNumber: bankDataOrigin[0] ? bankDataOrigin[0].routingNumber : '-',
      ifscCode: bankDataOrigin[0] ? bankDataOrigin[0].ifscCode : '-',
      micrcCode: bankDataOrigin[0] ? bankDataOrigin[0].micrcCode : '-',
      uanNumber: bankDataOrigin[0] ? bankDataOrigin[0].uanNumber : '-',
    };
    const bankList = [...bankDataOrigin];
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
  };
  const handeAddBank = () => {
    setVisible(true);
  };
  const renderBank = openBank ? (
    <EditBank handleCancel={handleCancel} />
  ) : (
    <ViewBank bankData={bankDataOrigin} />
  );
  return (
    <div className={styles.BankAccount}>
      <Row className={styles.TableBankDetails}>
        <Col span={24}>
          <div>
            <div className={styles.spaceTitle}>
              <Row>
                <Col span={21}>
                  <p className={styles.TitleDetails}>Bank Details</p>
                </Col>
                <Col span={3} className={styles.flexEdit} onClick={() => handleEdit()}>
                  <img src={EditBtn} alt="" className={styles.IconEdit} />
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

        <div className={styles.addBank}>
          <div onClick={handeAddBank} className={styles.containerAddbank}>
            <img src={plusIcon} alt="add" />
            <span className={styles.textAdd}>Add Bank Account</span>
            <span className={styles.lableSpan}> (You can up to 4 account) </span>
          </div>
        </div>
        <ModalAddBank
          visible={visible}
          onClose={() => setVisible(false)}
          bankData={bankDataOrigin}
        />
      </Row>
      <CommonModal
        width={550}
        visible={visibleSuccess}
        hasFooter={false}
        onClose={handleCancelModelSuccess}
        hasHeader={false}
        content={
          <>
            <div style={{ textAlign: 'center' }}>
              <img src={imageAddSuccess} alt="update success" />
            </div>
            <br />
            <br />
            <p style={{ textAlign: 'center', color: '#707177', fontWeight: 500 }}>
              Update information successfully
            </p>
            <div className={styles.spaceFooterModalSuccess}>
              <Button onClick={handleCancelModelSuccess} className={styles.btnOkModalSuccess}>
                Okay
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default connect(
  ({
    loading,
    employeeProfile: {
      editGeneral: { openBank } = {},
      originData: { bankData: bankDataOrigin = {} },
      visibleSuccess = false,
    } = {},
  }) => ({
    loadingBank: loading.effects['employeeProfile/fetchBank'],
    openBank,
    visibleSuccess,
    bankDataOrigin,
  }),
)(BankAccount);
