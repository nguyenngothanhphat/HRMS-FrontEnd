import React from 'react';
import { Link } from 'umi';
import Launcher from '@/assets/launcher.svg';
import Arrow from '@/assets/next.svg';
import styles from './index.less';

const WorkInProgress = () => {
  return (
    <div className={styles.WorkInProgress}>
      <div className={styles.image}>
        <img src={Launcher} alt="" />
      </div>
      <span className={styles.description}>
        We are going to launch this page very soon.
        <br /> Stay tuned.
      </span>
      <Link to="/" className={styles.backToHome}>
        Back to home <img src={Arrow} alt="" />
      </Link>
    </div>
  );
};
export default WorkInProgress;
