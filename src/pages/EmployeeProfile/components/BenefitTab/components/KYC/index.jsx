import React from 'react';
import { formatMessage } from 'umi';
import styles from './styles.less';

export default function KYC(props) {
  const { kycStat, walletStat, adhaar, paytm } = props;
  return (
    <div className={styles.kyc}>
      <h1>{formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.adhaar' })}</h1>
      <div className={styles.items}>
        <div className={styles.item}>
          <h3>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.kycStat' })}
          </h3>
          <p style={{ color: '#6fb25f' }}>{kycStat}</p>
        </div>
        <div className={styles.item}>
          <h3>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.walletStat' })}
          </h3>
          <p style={{ color: '#6fb25f' }}>{walletStat}</p>
        </div>
        <div className={styles.item}>
          <h3>{formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.adhaar' })}</h3>
          <p>{adhaar}</p>
        </div>
        <div className={styles.item}>
          <h3>{formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.paytm' })}</h3>
          <p>{paytm}</p>
        </div>
      </div>
    </div>
  );
}
