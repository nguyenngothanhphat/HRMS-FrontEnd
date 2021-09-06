import { Affix, Button, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import LayoutAddCandidateForm from '@/components/LayoutAddCandidateForm';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentTenant } from '@/utils/authority';
import BasicInformation from './components/BasicInformation';
import Benefit from './components/Benefits';
import DocumentVerificationNew from './components/DocumentVerificationNew';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
import PreviewOffer from './components/PreviewOffer';
import SalaryStructure from './components/SalaryStructure';
import styles from './index.less';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';

@connect(({ newCandidateForm = {}, user, loading }) => ({
  newCandidateForm,
  user,
  loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
}))
class NewCandidateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listMenu: [],
    };
  }

  componentDidMount = () => {
    const {
      match: { params: { action = '', reId } = {} },
      dispatch,
    } = this.props;

    // check action is add or review. If isReview fetch candidate by reID
    if (action === 'view' || action === 'candidate-detail') {
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
        this.renderListMenu();
        const { _id } = data;
        dispatch({
          type: 'optionalQuestion/save',
          payload: {
            candidate: _id,
            data: {},
          },
        });
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

  renderListMenu = () => {
    const {
      match: { params: { reId = '' } = {} },
      newCandidateForm,
      loadingFetchCandidate = false,
      // location: { state: { isAddNew = false } = {} } = {},
    } = this.props;

    const {
      tempData: {
        offerLetter: { _id: offerLetterId = '' } = {} || {},

        processStatus = '',
        locationList,
        employeeTypeList,
        valueToFinalOffer = 0,
      } = {},
    } = newCandidateForm;

    const listMenu = [
      {
        id: 1,
        name: 'Basic Information',
        key: 'basicInformation',
        component: (
          <BasicInformation
            reId={reId}
            loadingFetchCandidate={loadingFetchCandidate}
            processStatus={processStatus}
          />
        ),
        link: 'basic-information',
        statusToLock: [],
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
            loading={loadingFetchCandidate}
            processStatus={processStatus}
          />
        ),
        link: 'job-details',
        statusToLock: [],
      },
      {
        id: 3,
        name: 'Eligibility documents',
        key: 'backgroundCheck',
        // key: 'eligibilityDocuments',
        component: <DocumentVerificationNew />,
        link: 'document-verification',
        statusToLock: [],
      },
      {
        id: 4,
        name: 'Salary Structure',
        key: 'salaryStructure',
        component: (
          <SalaryStructure
            loading={loadingFetchCandidate}
            reId={reId}
            processStatus={processStatus}
          />
        ),
        link: 'salary-structure',
        statusToLock: [
          NEW_PROCESS_STATUS.DRAFT,
          NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
          NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
        ],
      },
      {
        id: 5,
        name: 'Benefits',
        key: 'benefits',
        component: <Benefit processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />,
        link: 'benefits',
        statusToLock: [
          NEW_PROCESS_STATUS.DRAFT,
          NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
          NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
        ],
      },
      {
        id: 6,
        name: 'Offer Details',
        key: 'offerDetails',
        component: (
          <OfferDetail processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />
        ),
        link: 'offer-details',
        statusToLock: [
          NEW_PROCESS_STATUS.DRAFT,
          NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
          NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
        ],
      },
      {
        id: 7,
        name: 'Preview Offer Letter',
        key: 'offerLetter',
        component: <PreviewOffer />,
        link: 'offer-letter',
        statusToLock: [
          NEW_PROCESS_STATUS.DRAFT,
          NEW_PROCESS_STATUS.PROFILE_VERIFICATION,
          NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION,
        ],
        isOfferLetter: !!offerLetterId,
      },
    ];

    this.setState({ listMenu });
  };

  resetFormMember = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newCandidateForm/clearState',
    });
    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        candidate: null,
        data: {},
      },
    });
  };

  handleCancel = async () => {
    const { dispatch, newCandidateForm: { data: { ticketID = '' } = {} } = {} } = this.props;
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
      history.push('/onboarding/list');
    }
  };

  handleFinishLater = async () => {
    history.push('/onboarding/list');
  };

  render() {
    const {
      match: { params: { action = '', reId = '', tabName = '' } = {} },
      loadingFetchCandidate = false,
      // location: { state: { isAddNew = false } = {} } = {},
    } = this.props;

    const { listMenu } = this.state;
    // const title = isAddNew ? `Add a team member [${reId}]` : `Review team member [${reId}]`;
    const title = `Add a team member`;

    if (listMenu.length === 0) return <Skeleton />;
    return (
      <PageContainer>
        <div className={styles.containerNewCandidateForm}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>{title}</p>
              {action === 'view' && (
                <div className={styles.titlePage__viewBtn}>
                  <Button type="primary" ghost onClick={this.handleFinishLater}>
                    Finish Later
                  </Button>
                </div>
              )}
            </div>
          </Affix>

          <LayoutAddCandidateForm
            listMenu={listMenu}
            tabName={tabName}
            reId={reId}
            loading={loadingFetchCandidate}
          />
        </div>
      </PageContainer>
    );
  }
}

export default NewCandidateForm;
