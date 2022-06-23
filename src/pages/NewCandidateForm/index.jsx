import { Affix, Button, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import LayoutAddCandidateForm from '@/components/LayoutAddCandidateForm';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentTenant } from '@/utils/authority';
import { ONBOARDING_FORM_LINK, ONBOARDING_FORM_STEP_LINK } from '@/utils/onboarding';
import BasicInformation from './components/BasicInformation';
import Benefit from './components/Benefits';
import DocumentVerificationNew from './components/DocumentVerificationNew';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
import PreviewOffer from './components/PreviewOffer';
import SalaryStructure from './components/SalaryStructure';
import styles from './index.less';
import { goToTop } from '@/utils/utils';
import References from './components/References';
import DocumentCheckList from './components/DocumentCheckList';

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
      loadingFinishLater: false,
    };
  }

  componentDidMount = () => {
    const {
      match: { params: { action = '', reId, tabName = '' } = {} },
      dispatch,
    } = this.props;

    if (action === 'view' || action === 'candidate-detail') {
      goToTop();
      // check action is add or review. If isReview fetch candidate by reID
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
        const { _id, currentStep = '' } = data;

        const find = ONBOARDING_FORM_STEP_LINK.find((l) => l.link === tabName) || {};
        if (currentStep <= find.id) {
          const currentComponent = ONBOARDING_FORM_STEP_LINK.find((l) => l.id === currentStep);
          if (currentComponent) {
            history.push(`/onboarding/list/view/${reId}/${currentComponent.link}`);
          }
        }
        this.renderListMenu();
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
        link: ONBOARDING_FORM_LINK.BASIC_INFORMATION,
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
        link: ONBOARDING_FORM_LINK.JOB_DETAILS,
      },
      {
        id: 3,
        name: 'Document Verification',
        key: 'backgroundCheck',
        // key: 'eligibilityDocuments',
        component: <DocumentVerificationNew />,
        link: ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION,
      },
      {
        id: 4,
        name: 'References',
        key: 'references',
        component: <References />,
        link: ONBOARDING_FORM_LINK.REFERENCES,
      },
      {
        id: 5,
        name: 'Salary Structure',
        key: 'salaryStructure',
        component: (
          <SalaryStructure
            loading={loadingFetchCandidate}
            reId={reId}
            processStatus={processStatus}
          />
        ),
        link: ONBOARDING_FORM_LINK.SALARY_STRUCTURE,
      },
      {
        id: 6,
        name: 'Benefits',
        key: 'benefits',
        component: <Benefit processStatus={processStatus} valueToFinalOffer={valueToFinalOffer} />,
        link: ONBOARDING_FORM_LINK.BENEFITS,
      },
      {
        id: 7,
        name: 'Offer Details',
        key: 'offerDetails',
        component: (
          <OfferDetail
            reId={reId}
            processStatus={processStatus}
            valueToFinalOffer={valueToFinalOffer}
          />
        ),
        link: ONBOARDING_FORM_LINK.OFFER_DETAILS,
      },
      {
        id: 8,
        name: 'Preview Offer Letter',
        key: 'offerLetter',
        component: <PreviewOffer />,
        link: ONBOARDING_FORM_LINK.OFFER_LETTER,

        isOfferLetter: !!offerLetterId,
      },
      {
        id: 9,
        name: 'Documents Checklist',
        key: 'documentsChecklist',
        // key: 'eligibilityDocuments',
        component: <DocumentCheckList />,
        link: ONBOARDING_FORM_LINK.DOCUMENT_CHECKLIST_VERIFICATION,
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
    const wait = (delay, ...args) => {
      // eslint-disable-next-line compat/compat
      return new Promise((resolve) => {
        setTimeout(resolve, delay, ...args);
      });
    };

    this.setState({
      loadingFinishLater: true,
    });
    await wait(500).then(() =>
      this.setState({
        loadingFinishLater: false,
      }),
    );
    history.push('/onboarding/list');
  };

  render() {
    const {
      match: { params: { action = '', reId = '', tabName = '' } = {} },
      loadingFetchCandidate = false,
      // location: { state: { isAddNew = false } = {} } = {},
    } = this.props;

    const { listMenu, loadingFinishLater } = this.state;
    // const title = isAddNew ? `Add a team member [${reId}]` : `Review team member [${reId}]`;
    const title = `Add a team member`;

    return (
      <PageContainer>
        <div className={styles.containerNewCandidateForm}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>{title}</p>
              {action === 'view' && (
                <div className={styles.titlePage__viewBtn}>
                  <Button
                    type="primary"
                    ghost
                    loading={loadingFinishLater}
                    onClick={this.handleFinishLater}
                  >
                    {tabName === ONBOARDING_FORM_LINK.OFFER_LETTER ? 'Cancel' : 'Finish Later'}
                  </Button>
                </div>
              )}
            </div>
          </Affix>

          {listMenu.length === 0 ? (
            <div style={{ padding: 24 }}>
              <Skeleton />
            </div>
          ) : (
            <LayoutAddCandidateForm
              listMenu={listMenu}
              tabName={tabName}
              reId={reId}
              loading={loadingFetchCandidate}
            />
          )}
        </div>
      </PageContainer>
    );
  }
}

export default NewCandidateForm;
