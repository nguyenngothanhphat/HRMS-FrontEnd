import React, { PureComponent } from 'react';
import { history } from 'umi';
import CustomBlueButton from '@/components/CustomBlueButton';
import styles from './index.less';

class Header extends PureComponent {
  createCustomEmail = () => {
    history.push('/offboarding/settings/custom-emails/create-custom-email');
  };

  render() {
    return (
      <div className={styles.Header}>
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
          <CustomBlueButton onClick={this.createCustomEmail}>
            Create your custom e-mail
          </CustomBlueButton>
        </div>
      </div>
    );
  }
}

export default Header;
