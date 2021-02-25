import React, { PureComponent } from 'react';
import CompanySignatoryHeader from './components/CompanySignatoryHeader';
import CompanySignatoryForm from './components/CompanySignatoryForm';

import styles from './index.less';

class CompanySignatory extends PureComponent {
  render() {
    const mockData = [
      {
        _id: '123',
        name: 'Mokchada Sinha',
        attachment: '',
      },
      {
        _id: '456',
        name: 'Mokchada Sinha',
        attachment: '',
      },
    ];
    return (
      <div className={styles.CompanySignatory}>
        <CompanySignatoryHeader />
        <CompanySignatoryForm list={mockData} />
      </div>
    );
  }
}

export default CompanySignatory;
