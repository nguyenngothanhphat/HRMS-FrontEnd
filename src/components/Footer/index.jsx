import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import LogoFooter from '@/assets/PaxanimiLogo1.png';

import styles from './index.less';

export default class Footer extends PureComponent {
  render() {
    return (
      <div className={styles.Footer}>
        <div>
          <img src={LogoFooter} alt="The Logo Not Found At Location" />
        </div>
        <div>{formatMessage({ id: 'footer.div2' })}</div>
      </div>
    );
  }
}
