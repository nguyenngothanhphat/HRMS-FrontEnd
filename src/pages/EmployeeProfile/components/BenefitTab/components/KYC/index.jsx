import React from 'react';
import { formatMessage } from 'umi';
import styles from './styles.less';

export default function KYC(props) {
  const { kycStat, walletStat, adhaar, paytm } = props;
  return (
    <div className={styles.kyc}>
      <div className={styles.items}>
        <div className={styles.item}>
          <div>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.kycStat' })}
          </div>
          <div style={{ color: '#00c598' }}>{kycStat}</div>
        </div>
        <div className={styles.item}>
          <div>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.walletStat' })}
          </div>
          <div style={{ color: '#00c598' }}>{walletStat}</div>
        </div>
        <div className={styles.item}>
          <div>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.adhaar' })}
          </div>
          <div style={{ color: '#707177' }}>{adhaar}</div>
        </div>
        <div className={styles.item}>
          <div>
            {formatMessage({ id: 'pages.employeeProfile.BenefitTab.components.kyc.paytm' })}
          </div>
          <div style={{ color: '#707177' }}>{paytm}</div>
        </div>
      </div>
    </div>
  );
}
