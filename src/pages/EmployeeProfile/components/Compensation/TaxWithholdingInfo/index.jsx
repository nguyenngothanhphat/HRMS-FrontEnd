import React from 'react';
import { Row, Col, Skeleton, Button } from 'antd';

import { connect } from 'umi';
import EditBtn from '@/assets/edit.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import CommonModal from '@/components/CommonModal';
import EditTax from './component/EditTax';
import ViewTax from './component/ViewTax';

import styles from './index.less';

const TaxWithholdingInfo = (props) => {
  const { openTax, loadingTax, visibleSuccess, taxDataOrigin, dispatch } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openTax: true },
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
      incomeTaxRule: taxDataOrigin[0] ? taxDataOrigin[0].incomeTaxRule : '-',
      panNum: taxDataOrigin[0] ? taxDataOrigin[0].panNum : '-',
    };
    const taxList = [...taxDataOrigin];
    const payload = { ...taxDataOrigin[0], ...reverseFields };
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
  };

  const renderTax = openTax ? (
    <EditTax handleCancel={handleCancel} />
  ) : (
    <ViewTax taxData={taxDataOrigin} />
  );
  return (
    <div className={styles.TaxDetail}>
      <Row className={styles.TableTaxDetails}>
        <Col span={24}>
          <div>
            <div className={styles.spaceTitle}>
              <Row>
                <Col span={21}>
                  <p className={styles.TitleDetails}>Tax Details</p>
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
          {loadingTax ? (
            <div className={styles.viewLoading}>
              <Skeleton loading={loadingTax} active />
            </div>
          ) : (
            renderTax
          )}
        </Col>
      </Row>
      <CommonModal
        visible={visibleSuccess}
        hasFooter={false}
        onClose={handleCancelModelSuccess}
        onFinish={handleCancelModelSuccess}
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
      editGeneral: { openTax } = {},
      originData: { taxData: taxDataOrigin = {} },
      // tempData: { bankData = {}, taxData = {} } = {},
      visibleSuccess = false,
    } = {},
  }) => ({
    loadingTax: loading.effects['employeeProfile/fetchTax'],
    openTax,
    visibleSuccess,
    taxDataOrigin,
  }),
)(TaxWithholdingInfo);
