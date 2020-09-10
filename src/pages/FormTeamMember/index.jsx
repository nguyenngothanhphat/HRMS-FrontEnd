import React, { PureComponent } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CommonLayout from '@/components/CommonLayout';
import BasicInformation from './components/BasicInformation';
import JobDetails from './components/JobDetails';
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
    const listMenu = [
      { id: '1', name: 'Basic Information', component: <BasicInformation /> },
      { id: '2', name: 'Job Details', component: <JobDetails /> },
    ];

    return (
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          {action} team member {action === 'review' && reId}
          <EligibilityDocs />
          <CommonLayout listMenu={listMenu} />
        </div>
      </PageContainer>
    );
  }
}
