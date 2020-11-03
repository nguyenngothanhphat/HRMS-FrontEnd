import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Button, Affix } from 'antd';
import CommonLayout from '@/components/CommonLayout';
import { connect } from 'umi';
import BasicInformation from './components/BasicInformation';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
// import CustomField from './components/CustomField';
import Benefit from './components/Benefit';
import styles from './index.less';
import SalaryStructure from './components/SalaryStructure';
import BackgroundCheck from './components/BackgroundCheck';
import Payroll from './components/Payroll';
// import Additional from './components/Additional';
// import PreviewOffer from './components/PreviewOffer';

@connect(({ candidateInfo = {}, loading }) => ({
  candidateInfo,
  loading1: loading.effects['candidateInfo/fetchCandidateByRookie'],
  loading2: loading.effects['candidateInfo/fetchCandidateInfo'],
}))
class FormTeamMember extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { action = '', reId } = {} },
      dispatch,
      candidateInfo: { data },
    } = this.props;
    // check action is add or review. If isReview fetch candidate by reID
    if (action === 'review') {
      dispatch({
        type: 'candidateInfo/fetchCandidateByRookie',
        payload: {
          rookieID: reId,
        },
      });
      if (data.company._id.length > 0) {
        dispatch({
          type: 'candidateInfo/fetchLocationListByCompany',
          payload: {
            company: data.company._id,
          },
        });
      }
      dispatch({
        type: 'candidateInfo/fetchEmployeeTypeList',
      });
      dispatch({
        type: 'candidateInfo/fetchDocumentList',
      });
      dispatch({
        type: 'candidateInfo/fetchTemplate',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/saveOrigin',
      payload: {
        fullName: null,
        privateEmail: null,
        workEmail: null,
        workLocation: null,
        position: 'EMPLOYEE',
        employeeType: null,
        department: null,
        title: null,
        company: null,
        joineeEmail: '',
        previousExperience: null,
        processStatus: 'DRAFT',
        noticePeriod: null,
        dateOfJoining: null,
        reportingManager: null,
        compensationType: null,
        amountIn: null,
        timeOffPolicy: null,
        id: '',
        candidate: '',
        documentChecklistSetting: [
          {
            type: 'A',
            name: 'Identity Proof',
            data: [
              {
                key: 'aadharCard',
                alias: 'Aadhar Card',
                value: true,
              },
              {
                key: 'panCard',
                alias: 'PAN Card',
                value: true,
              },
              {
                key: 'passport',
                alias: 'Passport',
                value: false,
              },
              {
                key: 'drivingLicence',
                alias: 'Driving Licence',
                value: false,
              },
              {
                key: 'voterCard',
                alias: 'Voter Card',
                value: false,
              },
            ],
          },
          {
            type: 'B',
            name: 'Address Proof',
            data: [
              {
                key: 'rentalAgreement',
                alias: 'Rental Agreement',
                value: false,
              },
              {
                key: 'electricityUtilityBills',
                alias: 'Electricity & Utility Bills',
                value: false,
              },
              {
                key: 'telephoneBills',
                alias: 'Telephone Bills',
                value: false,
              },
            ],
          },
          {
            type: 'C',
            name: 'Educational',
            data: [
              {
                key: 'sslc',
                alias: 'SSLC',
                value: true,
              },
              {
                key: 'intermediateDiploma',
                alias: 'Intermedidate/Diploma',
                value: true,
              },
              {
                key: 'graduation',
                alias: 'Graduation',
                value: true,
              },
              {
                key: 'postGraduate',
                alias: 'Post Graduate',
                value: false,
              },
              {
                key: 'phdDoctorate',
                alias: 'PHD/Doctorate',
                value: false,
              },
            ],
          },
          {
            type: 'D',
            name: 'Technical Certifications',
            data: [
              {
                key: 'offerLetter',
                alias: 'Offer letter',
                value: false,
              },
              {
                key: 'appraisalLetter',
                alias: 'Appraisal letter',
                value: false,
              },
              {
                key: 'paysTubs',
                alias: 'Paystubs',
                value: false,
              },
              {
                key: 'form16',
                alias: 'Form 16',
                value: false,
              },
              {
                key: 'relievingLetter',
                alias: 'Relieving Letter',
                value: false,
              },
            ],
          },
        ],
        salaryPosition: '',
        listTitle: [],
        tableData: [],
        candidateSignature: null,
        hrManagerSignature: {},
        hrSignature: {},
        hiringAgreements: null,
        companyHandbook: null,
        benefits: [],
        comments: null,
        status: '',
        _id: '',
        ticketID: '',
        generatedBy: '',
        createdAt: '',
        updatedAt: '',
      },
    });
  }

  render() {
    const {
      match: { params: { action = '', reId = '' } = {} },
      candidateInfo,
      loading1,
    } = this.props;
    const { tempData: { locationList, employeeTypeList, documentList } = {} } = candidateInfo;
    const title = action === 'add' ? 'Add a team member' : `Review team member [${reId}]`;
    const listMenu = [
      {
        id: 1,
        name: 'Basic Information',
        key: 'basicInformation',
        component: <BasicInformation reId={reId} loading1={loading1} />,
      },
      {
        id: 2,
        name: 'Job Details',
        key: 'jobDetails',
        component: (
          <JobDetails
            locationList={locationList}
            employeeTypeList={employeeTypeList}
            reId={reId}
            loading={loading1}
          />
        ),
      },
      {
        id: 3,
        name: 'Salary Structure',
        key: 'salaryStructure',
        component: <SalaryStructure loading={loading1} reId={reId} />,
      },
      {
        id: 4,
        name: 'Background Check',
        key: 'backgroundCheck',
        // key: 'eligibilityDocuments',
        component: <BackgroundCheck documentList={documentList} loading={loading1} reId={reId} />,
      },
      { id: 5, name: 'Offer Details', key: 'offerDetails', component: <OfferDetail /> },
      { id: 6, name: 'Payroll Settings', key: 'payrollSettings', component: <Payroll /> },
      { id: 7, name: 'Benefits', key: 'benefits', component: <Benefit /> },
      // { id: 8, name: 'Custom Fields', key: 'customFields', component: <CustomField /> },
      // {
      //   id: 9,
      //   name: 'Additional Options',
      //   key: 'additionalOptions',
      //   component: <Additional />,
      // },
    ];

    const candidateProcess = {
      basicInformation: false,
      jobDetails: false,
      salaryStructure: false,
      backgroundCheck: false,
      // eligibilityDocuments: false,
      offerDetails: false,
      payrollSettings: false,
      benefits: false,
      // customFields: false,
      // additionalOptions: false,
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
      // {loading1 && loading 2 ? }
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

export default FormTeamMember;
