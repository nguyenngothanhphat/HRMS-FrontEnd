import React, { PureComponent } from 'react';
import { Link } from 'umi';
import CustomEmailsHeader from './components/CustomEmailsHeader';
import CustomEmailsTableField from './components/CustomEmailsTableField';
import addButton from './assets/addButton.svg';

import styles from './index.less';

class CustomEmails extends PureComponent {
  render() {
    return (
      <div className={styles.CustomEmails}>
        <CustomEmailsHeader />

        <CustomEmailsTableField />

        {/* <Link to="/employee-onboarding/create-email-reminder">
          <img className={styles.addButton} src={addButton} alt="add button" />
        </Link> */}
      </div>
    );
  }
}

export default CustomEmails;
