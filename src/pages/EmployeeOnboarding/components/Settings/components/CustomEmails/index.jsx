import React, { PureComponent } from 'react';
import CustomEmailsHeader from './components/CustomEmailsHeader';
import addButton from './assets/addButton.svg';

import styles from './index.less';

class CustomEmails extends PureComponent {
  render() {
    return (
      <div className={styles.CustomEmails}>
        <CustomEmailsHeader />

        <img className={styles.addButton} src={addButton} alt="add button" />
      </div>
    );
  }
}

export default CustomEmails;
