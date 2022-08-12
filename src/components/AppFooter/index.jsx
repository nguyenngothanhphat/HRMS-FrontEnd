import React from 'react';
import { useIntl } from 'umi';
import LogoFooter from '@/assets/PaxanimiLogo1.png';

import styles from './index.less';

const AppFooter = () => {
  const intl = useIntl();
  return (
    <div className={styles.AppFooter}>
      <div>
        <img src={LogoFooter} alt="The Logo Not Found At Location" />
      </div>
      <div>{intl.formatMessage({ id: 'footer.div2' })}</div>
    </div>
  );
};
export default AppFooter;
