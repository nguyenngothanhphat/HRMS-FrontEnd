import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Button, Affix, Spin } from 'antd';
import CommonLayout from '@/components/CommonLayout';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { PROCESS_STATUS } from '@/utils/onboarding';
import BasicInformation from './components/BasicInformation';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
// import CustomField from './components/CustomField';
import Benefit from './components/Benefit';
import styles from './index.less';
import SalaryStructure from './components/SalaryStructure';
// import BackgroundCheck from './components/BackgroundCheck';
import BackgroundCheck from './components/BackgroundCheckNew';
import BackgroundRecheck from './components/BackgroundRecheck';
import Payroll from './components/Payroll';
// import AdditionalQuestion from './components/AdditionalQuestion';
// import Additional from './components/Additional';
// import PreviewOffer from './components/PreviewOffer';

@connect(({ candidateInfo = {}, user, loading }) => ({
  candidateInfo,
  user,
  loading1: loading.effects['candidateInfo/fetchCandidateByRookie'],
}))
class FormTeamMember extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { action = '', reId } = {} },
      dispatch,
      // user: { companiesOfUser = [] },
      // candidateInfo,
    } = this.props;
    // check action is add or review. If isReview fetch candidate by reID
    // console.log(candidateInfo.currentStep);
    if (action === 'review' || action === 'add' || action === 'candidate-detail') {
      dispatch({
        type: 'candidateInfo/fetchCandidateByRookie',
        payload: {
          rookieID: reId,
          tenantId: getCurrentTenant(),
        },
      }).then(({ data }) => {
        if (!data) {
          return;
        }
        const { currentStep = 0 } = data;

        if (currentStep >= 4) {
          dispatch({
            type: 'candidateInfo/saveTemp',
            payload: {
              valueToFinalOffer: 1,
            },
          });
        }
      });
      // if (company._id.length > 0) {
      //   dispatch({
      //     type: 'candidateInfo/fetchLocationListByCompany',
      //     payload: {
      //       company: company._id,
      //     },
      //   });
      // }
      dispatch({
        type: 'candidateInfo/fetchEmployeeTypeList',
      });
      dispatch({
        type: 'candidateInfo/fetchDocumentList',
      });
      dispatch({
        type: 'candidateInfo/fetchDefaultTemplateList',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
      dispatch({
        type: 'candidateInfo/fetchCustomTemplateList',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
    }
  }

  componentWillUnmount() {
    this.resetFormMember();
    this.resetFirstField();
  }

  resetFormMember = () => {
    const { dispatch, candidateInfo = {} } = this.props;
    const { listTitle } = candidateInfo;
    dispatch({
      type: 'candidateInfo/saveOrigin',
      payload: {
        listTitle,
        firstName: null,
        middleName: null,
        lastName: null,
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
            type: 'E',
            name: 'Previous Employment',
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
        // listTitle: [],
        candidateSignature: {},
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

    // dispatch({
    //   type: 'candidateInfo/save',
    //   payload: {
    //     checkMandatory: {
    //       ...checkMandatory,
    //       filledJobDetail: false,
    //     },
    //     tempData: {
    //       checkStatus: {
    //         filledBasicInformation: false,
    //         filledJobDetail: false,
    //         filledBackgroundCheck: false,
    //       },
    //     },
    //   },
    // });

    dispatch({
      type: 'candidateInfo/saveTemp',
      payload: {
        salaryTitle: null,
      },
    });

    dispatch({
      type: 'candidateInfo/updateBackgroundRecheck',
      payload: [],
    });
  };

  resetFirstField = () => {
    const { dispatch, candidateInfo: { tempData = {} } = {} } = this.props;
    dispatch({
      type: 'candidateInfo/save',
      payload: {
        tempData: {
          ...tempData,
          locationList: [],
          departmentList: [],
          titleList: [],
          managerList: [],
          salaryTitle: null,
          workLocation: null,
          employeeType: {},
          documentsByCandidate: [],
          documentsByCandidateRD: [],
          documentChecklistSetting: [],
          backgroundRecheck: [],
          documentList: [],
          previousEmployment: {},
        },
      },
    });
  };

  handleCancel = async () => {
    const { dispatch, history, candidateInfo: { data: { ticketID = '' } = {} } = {} } = this.props;
    if (!dispatch) {
      return;
    }

    const response = await dispatch({
      type: 'onboard/deleteTicketDraft',
      payload: {
        id: ticketID,
        tenantId: getCurrentTenant(),
      },
    });
    const { statusCode = 1 } = response;
    if (statusCode === 200) {
      dispatch({
        type: 'candidateInfo/saveTemp',
        payload: {
          cancelCandidate: true,
        },
      });

      this.resetFirstField();

      // this.resetFormMember();
      history.push('/employee-onboarding');
    }
  };

  handleFinishLater = async () => {
    const { candidateInfo: { data } = {}, dispatch, history } = this.props;
    const response = await dispatch({
      type: 'candidateInfo/updateByHR',
      payload: {
        ...data,
        tenantId: getCurrentTenant(),
        // candidate: data.id
      },
    });
    const { statusCode = 1 } = response;
    if (statusCode === 200) {
      history.push('/employee-onboarding');
    }
  };

  render() {
    const {
      match: { params: { action = '', reId = '', tabName = '' } = {} },
      candidateInfo,
      loading1 = false,
      candidateInfo: {
        data: {
          _id: candidateId = '',
          // documentsByCandidate = []
        },
      } = {},
      location: { state: { isAddNew = false } = {} } = {},
    } = this.props;
    const check = !loading1 && candidateId !== '';
    // const checkDocument = !loading1 && documentsByCandidate.length > 0;
    const {
      tempData: { locationList, employeeTypeList, documentList, valueToFinalOffer = 0 } = {},
      data: { processStatus = '' } = {},
    } = candidateInfo;

    const title = isAddNew ? `Add team member [${reId}]` : `Review team member [${reId}]`;
    const listMenu = [
      {
        id: 1,
        name: 'Basic Information',
        key: 'basicInformation',
        component: !check ? null : (
          <BasicInformation reId={reId} loading1={loading1} processStatus={processStatus} />
        ),
        link: 'basic-information',
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
            processStatus={processStatus}
          />
        ),
        link: 'job-details',
      },
      {
        id: 3,
        name: 'Salary Structure',
        key: 'salaryStructure',
        component: <SalaryStructure loading={loading1} reId={reId} processStatus={processStatus} />,
        link: 'salary-structure',
      },
      {
        id: 4,
        name: 'Document Verification',
        key: 'backgroundCheck',
        // key: 'eligibilityDocuments',
        component:
          processStatus !== PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT &&
          processStatus !== PROCESS_STATUS.SENT_PROVISIONAL_OFFERS ? (
            <BackgroundRecheck />
          ) : (
            <BackgroundCheck
              documentList={documentList}
              loading={loading1}
              reId={reId}
              processStatus={processStatus}
            />
          ),
        link: 'document-verification',
        // component:
        //   processStatus !== PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT &&
        //   processStatus !== PROCESS_STATUS.SENT_PROVISIONAL_OFFERS ? (
        //     !checkDocument ? null : (
        //       <BackgroundRecheck />
        //     )
        //   ) : (
        //     <BackgroundCheck
        //       documentList={documentList}
        //       loading={loading1}
        //       reId={reId}
        //       processStatus={processStatus}
        //     />
        //   ),
      },
      {
        id: 5,
        name: 'Offer Details',
        key: 'offerDetails',
        component: (
          <OfferDetail processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />
        ),
        link: 'offer-details',
      },
      {
        id: 6,
        name: 'Payroll Settings',
        key: 'payrollSettings',
        component: <Payroll processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />,
        link: 'payroll-settings',
      },
      {
        id: 7,
        name: 'Benefits',
        key: 'benefits',
        component: <Benefit processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />,
        link: 'benefits',
      },
      // {
      //   id: 8,
      //   name: 'Additional Question',
      //   key: 'additionalQuestion',
      //   component: <AdditionalQuestion processStatus={processStatus} reId={reId} />,
      // },
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
      additionalQuestion: false,
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
      <PageContainer>
        <div className={styles.containerFormTeamMember}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>{title}</p>
              {action === 'add' && (
                <div className={styles.titlePage__viewBtn}>
                  <Button type="primary" ghost onClick={this.handleFinishLater}>
                    Finish Later
                  </Button>
                  <Button danger onClick={this.handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Affix>
          {!check ? (
            <div className={styles.viewLoading}>
              <Spin size="large" />
            </div>
          ) : (
            <CommonLayout listMenu={formatListMenu} tabName={tabName} />
          )}
        </div>
      </PageContainer>
    );
  }
}

export default FormTeamMember;
