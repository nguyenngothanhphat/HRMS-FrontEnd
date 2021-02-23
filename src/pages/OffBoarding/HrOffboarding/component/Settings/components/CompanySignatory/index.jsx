import React, { PureComponent } from 'react';
import CompanySignatoryHeader from './components/CompanySignatoryHeader';
import CompanySignatoryForm from './components/CompanySignatoryForm';

import styles from './index.less';

class CompanySignatory extends PureComponent {
  render() {
    return (
      <div className={styles.CompanySignatory}>
        <CompanySignatoryHeader />
        <CompanySignatoryForm />
      </div>
    );
  }
}

export default CompanySignatory;
