import React, { PureComponent } from 'react';
import { history } from 'umi';
import styles from './index.less';

class CustomEmailsHeader extends PureComponent {
  createCustomEmail = () => {
    history.push('/employee-onboarding/settings/custom-emails/create-email-reminder');
  };

  render() {
    return (
      <div className={styles.CustomEmailsHeader}>
        <div className={styles.leftPart}>
          <div className={styles.title}>Custom emails</div>
          <div className={styles.subTitle}>
            Custom Email messages are a great way to recognize important dates and milestones. For
            example, you can remind managers of their team members’ start dates or create remainders
            for events, like license renewals or 30 day check-ins. You can use the Auto Text feature
            to generate personalized emails from a template.
          </div>
        </div>
        <div className={styles.rightPart}>
          <div className={styles.addButton} onClick={this.createCustomEmail}>
            <span>Create your custom e-mail</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomEmailsHeader;
