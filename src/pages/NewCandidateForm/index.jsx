import { Affix, Button, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CommonLayout from '@/components/CommonLayout';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentTenant } from '@/utils/authority';
// import { PROCESS_STATUS } from '@/utils/onboarding';
import BasicInformation from './components/BasicInformation';
import Benefit from './components/Benefit';
import DocumentVerification from './components/DocumentVerification';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
import SalaryStructure from './components/SalaryStructure';
import styles from './index.less';
// import BackgroundRecheck from './components/BackgroundRecheck';
// import Payroll from './components/Payroll';

@connect(({ newCandidateForm = {}, user, loading }) => ({
  newCandidateForm,
  user,
  loading1: loading.effects['newCandidateForm/fetchCandidateByRookie'],
}))
class NewCandidateForm extends PureComponent {
  componentDidMount = () => {
    const {
      match: { params: { action = '', reId } = {} },
      dispatch,
    } = this.props;

    // check action is add or review. If isReview fetch candidate by reID
    // console.log(newCandidateForm.currentStep);
    if (action === 'review' || action === 'add' || action === 'candidate-detail') {
      dispatch({
        type: 'newCandidateForm/fetchCandidateByRookie',
        payload: {
          rookieID: reId,
          tenantId: getCurrentTenant(),
        },
      }).then(({ data }) => {
        if (!data) {
          return;
        }
        const {
          // currentStep = 0,
          _id,
        } = data;
        dispatch({
          type: 'optionalQuestion/save',
          payload: {
            candidate: _id,
            data: {},
          },
        });
        // if (currentStep >= 4) {
        //   dispatch({
        //     type: 'newCandidateForm/saveTemp',
        //     payload: {
        //       valueToFinalOffer: 1,
        //     },
        //   });
        // }
      });

      dispatch({
        type: 'newCandidateForm/fetchEmployeeTypeList',
      });
      dispatch({
        type: 'newCandidateForm/fetchDocumentList',
      });
      dispatch({
        type: 'newCandidateForm/fetchDefaultTemplateList',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
      dispatch({
        type: 'newCandidateForm/fetchCustomTemplateList',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
    }
  };

  componentWillUnmount() {
    this.resetFormMember();
  }

  resetFormMember = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        candidate: null,
        data: {},
      },
    });
  };

  handleCancel = async () => {
    const {
      dispatch,
      history,
      newCandidateForm: { data: { ticketID = '' } = {} } = {},
    } = this.props;
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
      // dispatch({
      //   type: 'newCandidateForm/saveTemp',
      //   payload: {
      //     cancelCandidate: true,
      //   },
      // });
      // this.resetFormMember();
      history.push('/onboarding/list');
    }
  };

  handleFinishLater = async () => {
    const { newCandidateForm: { data } = {}, dispatch, history } = this.props;
    const response = await dispatch({
      type: 'newCandidateForm/updateByHR',
      payload: {
        ...data,
        tenantId: getCurrentTenant(),
        // candidate: data.id
      },
    });
    const { statusCode = 1 } = response;
    if (statusCode === 200) {
      history.push('/onboarding/list');
    }
  };

  render() {
    const {
      match: { params: { action = '', reId = '', tabName = '' } = {} },
      newCandidateForm,
      loading1 = false,
      newCandidateForm: {
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
    } = newCandidateForm;

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
        component: (
          // processStatus !== PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT &&
          // processStatus !== PROCESS_STATUS.SENT_PROVISIONAL_OFFERS ? (
          //   <BackgroundRecheck />
          // ) :
          <DocumentVerification
            documentList={documentList}
            loading={loading1}
            reId={reId}
            processStatus={processStatus}
          />
        ),
        link: 'document-verification',
      },
      {
        id: 5,
        name: 'Benefits',
        key: 'benefits',
        component: <Benefit processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />,
        link: 'benefits',
      },
      {
        id: 6,
        name: 'Offer Details',
        key: 'offerDetails',
        component: (
          <OfferDetail processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />
        ),
        link: 'offer-details',
      },
    ];

    const candidateProcess = {
      basicInformation: false,
      jobDetails: false,
      salaryStructure: false,
      documentVerification: false,
      benefits: false,
      offerDetails: false,
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
        <div className={styles.containerNewCandidateForm}>
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
              <Skeleton active />
            </div>
          ) : (
            <CommonLayout listMenu={formatListMenu} tabName={tabName} />
          )}
        </div>
      </PageContainer>
    );
  }
}

export default NewCandidateForm;
