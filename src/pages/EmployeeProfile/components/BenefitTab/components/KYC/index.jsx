import React from 'react';
import styles from './styles.less';

export default function KYC(props) {
  const { kycStat, walletStat, adhaar, paytm } = props;
  return (
    <div className={styles.kyc}>
      <h1>Adhaar Number</h1>
      <div className={styles.items}>
        <div className={styles.item}>
          <h3>KYC Status</h3>
          <p style={{ color: '#6fb25f' }}>{kycStat}</p>
        </div>
        <div className={styles.item}>
          <h3>Wallet Status</h3>
          <p style={{ color: '#6fb25f' }}>{walletStat}</p>
        </div>
        <div className={styles.item}>
          <h3>Adhaar Number</h3>
          <p>{adhaar}</p>
        </div>
        <div className={styles.item}>
          <h3>Paytm Number</h3>
          <p>{paytm}</p>
        </div>
      </div>
    </div>
  );
}
