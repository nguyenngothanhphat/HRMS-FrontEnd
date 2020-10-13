import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Button, Affix } from 'antd';
import CommonLayout from '@/components/CommonLayout';
import BasicInformation from './components/BasicInformation';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
import CustomField from './components/CustomField';
import Benefit from './components/Benefit';
import styles from './index.less';
import SalaryStructure from './components/SalaryStructure';
import EligibilityDocs from './components/EligibilityDocs';
import Payroll from './components/Payroll';
import Additional from './components/Additional';
// import PreviewOffer from './components/PreviewOffer';

export default class FormTeamMember extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { action = '', reId = '' } = {} },
    } = this.props;
    console.log('test', reId);
    // check action is add or review. If isReview fetch candidate by reID

    // console.log(this.props);
  }

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
        component: <BasicInformation />,
      },
      { id: 2, name: 'Job Details', key: 'jobDetails', component: <JobDetails reId={reId} /> },
      {
        id: 3,
        name: 'Eligibility Documents',
        key: 'eligibilityDocuments',
        component: <EligibilityDocs />,
      },
      { id: 4, name: 'Offer Details', key: 'offerDetails', component: <OfferDetail /> },
      { id: 5, name: 'Benefits', key: 'benefits', component: <Benefit /> },
      { id: 6, name: 'Salary Structure', key: 'salaryStructure', component: <SalaryStructure /> },
      { id: 7, name: 'Payroll Settings', key: 'payrollSettings', component: <Payroll /> },
      { id: 8, name: 'Custom Fields', key: 'customFields', component: <CustomField /> },
      {
        id: 9,
        name: 'Additional Options',
        key: 'additionalOptions',
        component: <Additional />,
      },
    ];

    const candidateProcess = {
      basicInformation: false,
      jobDetails: false,
      eligibilityDocuments: false,
      offerDetails: false,
      benefits: false,
      salaryStructure: false,
      payrollSettings: false,
      customFields: false,
      additionalOptions: false,
    };

    const formatListMenu =
      listMenu.map((item) => {
        const { key } = item;
        return {
          ...item,
          isComplete: candidateProcess[key],
        };
      }) || [];
    return (
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          <Affix offsetTop={40}>
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
          </Affix>
          <CommonLayout listMenu={formatListMenu} />
        </div>
      </PageContainer>
    );
  }
}
