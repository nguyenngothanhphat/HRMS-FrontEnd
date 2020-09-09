import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import CommonLayout from '@/components/CommonLayout';
import BasicInformation from './components/BasicInformation';
import JobDetails from './components/JobDetails';
import styles from './index.less';

export default class FormTeamMember extends PureComponent {
  // componentDidMount() {
  // const {
  //   match: { params: { action = '', reId = '' } = {} },
  // } = this.props;
  // check action is add or review. If isReview fetch candidate by reID
  // }

  render() {
    // const {
    //   match: { params: { action = '', reId = '' } = {} },
    // } = this.props;
    const listMenu = [
      { id: '1', name: 'Basic Information', component: <BasicInformation /> },
      { id: '2', name: 'Job Details', component: <JobDetails /> },
    ];

    return (
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          <CommonLayout listMenu={listMenu} />
        </div>
      </PageContainer>
    );
  }
}
