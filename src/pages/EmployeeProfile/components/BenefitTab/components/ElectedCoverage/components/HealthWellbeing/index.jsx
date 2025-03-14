import React, { useEffect } from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import BenefitItem from '../BenefitItem';
import styles from './index.less';

const HealthWellbeing = (props) => {
  const {
    dispatch,
    employeeProfile: { originData: { benefitPlans = [], employmentData = {} } = {} } = {},
  } = props;
  const countryId = employmentData?.location?.headQuarterAddress?.country?._id;

  useEffect(() => {
    if (countryId) {
      dispatch({
        type: 'employeeProfile/getBenefitPlans',
        payload: {
          country: countryId,
        },
      });
    }
  }, [countryId]);

  if (benefitPlans.length === 0)
    return (
      <div className={styles.HealthWellbeing}>
        <EmptyComponent />
      </div>
    );
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
