import { Affix, Button, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import LayoutAddCandidateForm from '@/components/LayoutAddCandidateForm';
import { PageContainer } from '@/layouts/layout/src';
import { getCurrentTenant } from '@/utils/authority';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import BasicInformation from './components/BasicInformation';
import Benefit from './components/Benefits';
import DocumentVerificationNew from './components/DocumentVerificationNew';
import JobDetails from './components/JobDetails';
import OfferDetail from './components/OfferDetail';
import PreviewOffer from './components/PreviewOffer';
import SalaryStructure from './components/SalaryStructure';
import styles from './index.less';

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

    // current step vs tab name
    const linkSet = [
      {
        id: 1,
        link: 'basic-information',
      },
      {
        id: 2,
        link: 'job-details',
      },
      {
        id: 3,
        link: 'document-verification',
      },
      {
        id: 4,
        link: 'salary-structure',
      },
      {
        id: 5,
        link: 'benefits',
      },
      {
        id: 6,
        link: 'offer-details',
      },
      {
        id: 7,
        link: 'offer-letter',
      },
    ];

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
        const { _id, currentStep = '' } = data;
        const link = this.getLink(currentStep);
        if (!tabName) {
          history.push(`/onboarding/list/view/${reId}/${link}`);
        }
        const find = linkSet.find((l) => l.link === tabName) || {};
        if (currentStep <= find.id - 1) {
          const currentComponent = linkSet.find((l) => l.id === currentStep + 1);
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

  getLink = (currentStep) => {
    switch (currentStep) {
      case 1:
        return 'job-details';
      case 2:
        return 'document-verification';
      case 3:
        return 'salary-structure';
      case 4:
        return 'benefits';
      case 5:
        return 'offer-details';

      default:
        return 'basic-information';
    }
  };

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
      },
      {
        id: 3,
        name: 'Eligibility Documents',
        key: 'backgroundCheck',
        // key: 'eligibilityDocuments',
        component: <DocumentVerificationNew />,
        link: 'document-verification',
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
      {
        id: 7,
        name: 'Preview Offer Letter',
        key: 'offerLetter',
        component: <PreviewOffer />,
        link: 'offer-letter',

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
    const wait = (delay, ...args) => {
      // eslint-disable-next-line compat/compat
      return new Promise((resolve) => {
        setTimeout(resolve, delay, ...args);
      });
    };

    this.setState({
      loadingFinishLater: true,
    });
    await wait(1000).then(() =>
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

    if (listMenu.length === 0) return <Skeleton />;
    return (
      <PageContainer>
        <div className={styles.containerNewCandidateForm}>
          <Affix offsetTop={30}>
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
                    {tabName === 'offer-letter' ? 'Cancel' : 'Finish Later'}
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
