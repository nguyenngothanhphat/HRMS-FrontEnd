import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

function CompensationDetail() {
  const compensationSummary = [
    {
      annualCTC: '5,500,000',
      basic: '90,999',
      otherAllowances: '44,999',
      variablePayTraget: '10%',
    },
  ];

  return (
    <Row gutter={[0, 16]} className={styles.CompensationDetail}>
      {compensationSummary.map((item) => {
        const { annualCTC = '', basic = '', otherAllowances = '', variablePayTraget = '' } = item;
        return (
          <>
            <Fragment key={item.label}>
              <Col span={6} className={styles.textLabel}>
                Current Annual CTC
              </Col>
              <Col span={18} className={styles.textValue}>
                {annualCTC}
              </Col>
            </Fragment>
            <Fragment key={item.label}>
              <Col span={6} className={styles.textLabel}>
                Basic
              </Col>
              <Col span={18} className={styles.textValue}>
                {basic}
              </Col>
            </Fragment>

            <Fragment key={item.label}>
              <Col span={6} className={styles.textLabel}>
                Other Allowances
              </Col>
              <Col span={18} className={styles.textValue}>
                {otherAllowances}
              </Col>
            </Fragment>
            <Fragment key={item.label}>
              <Col span={6} className={styles.textLabel}>
                Variable Pay Traget %
              </Col>
              <Col span={18} className={styles.textValue}>
                {variablePayTraget}
              </Col>
            </Fragment>
          </>
        );
      })}
    </Row>
  );
}

export default CompensationDetail;
