import { Col, Row, Skeleton } from 'antd';
import React from 'react';

import { connect } from 'umi';
import EditBtn from '@/assets/edit.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import CommonModal from '@/components/CommonModal';
import EditTax from './component/EditTax';
import ViewTax from './component/ViewTax';

import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import styles from './index.less';

const TaxWithholdingInfo = (props) => {
  const { openTax, loadingTax, taxDataOrigin, dispatch } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openTax: true },
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
    </div>
  );
};

export default connect(
  ({
    loading,
    employeeProfile: {
      editGeneral: { openTax } = {},
      originData: { taxData: taxDataOrigin = {} },
    } = {},
  }) => ({
    loadingTax: loading.effects['employeeProfile/fetchTax'],
    openTax,
    taxDataOrigin,
  }),
)(TaxWithholdingInfo);
