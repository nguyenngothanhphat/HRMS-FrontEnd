import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Button } from 'antd';
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
    const title = action === 'add' ? 'Add a team member' : `Review team member [${reId}]`;
    const listMenu = [
      {
        id: 1,
        name: 'Basic Information',
        key: 'basicInformation',
        isComplete: true,
        component: <BasicInformation />,
      },
      { id: 2, name: 'Job Details', component: <JobDetails /> },
      { id: 3, name: 'Eligibility documents', component: <EligibilityDocs /> },
      { id: 4, name: 'Offer Details', component: <BasicInformation /> },
      { id: 5, name: 'Benefits', component: <BasicInformation /> },
      { id: 6, name: 'Salary structure', component: <BasicInformation /> },
      { id: 7, name: 'Payroll settings', component: <BasicInformation /> },
      { id: 8, name: 'Custom Fields', component: <BasicInformation /> },
      { id: 9, name: 'Additional options', component: <BasicInformation /> },
    ];

    return (
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>{title}</p>
            {action === 'add' && (
              <div className={styles.titlePage__viewBtn}>
                <Button type="primary" ghost>
                  Finish Later
                </Button>
                <Button danger>Cancel</Button>
              </div>
            )}
          </div>
          <CommonLayout listMenu={listMenu} />
        </div>
      </PageContainer>
    );
  }
}
