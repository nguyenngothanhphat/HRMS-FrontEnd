import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
import BenefitItem from '../BenefitItem';

const HealthWellbeing = (props) => {
  const { employeeProfile: { originData: { benefitPlans = [] } = {} } = {} } = props;
  return (
    <div className={styles.HealthWellbeing}>
      {benefitPlans.map((item) => {
        return <BenefitItem item={item} />;
      })}
    </div>
  );
};

export default connect(({ employeeProfile }) => ({
  employeeProfile,
}))(HealthWellbeing);
