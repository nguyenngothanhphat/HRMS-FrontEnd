import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import EligibilityDocs from './components/EligibilityDocs';

export default class FormTeamMember extends PureComponent {
  // componentDidMount() {
  // const {
  //   match: { params: { action = '', reId = '' } = {} },
  // } = this.props;
  // check action is add or review. If isReview fetch candidate by reID
  // }

  render() {
    const {
      match: { params: { action = '', reId = '' } = {} },
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          {action} team member {action === 'review' && reId}
          <EligibilityDocs />
        </div>
      </PageContainer>
    );
  }
}
