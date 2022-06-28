import React, { PureComponent } from 'react';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import exportToCSV from '@/utils/exportAsExcel';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
import styles from './index.less';
import NewJoinees from './components/NewJoinees/index';
import { goToTop } from '@/utils/utils';

@connect(({ user: { permissions = [] } = {}, onboarding: { onboardingOverview = {} } = {} }) => ({
  permissions,
  onboardingOverview,
}))
class Onboarding extends PureComponent {
  componentDidMount = () => {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    if (!tabName) {
      history.replace(`/onboarding/list`);
    }
    goToTop();
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboarding/save',
      payload: {},
    });
  };

  checkPathLocation = () => {
    const {
      onboardingOverview: {
        dataAll = [],
        drafts = [],
        profileVerifications = [],
        documentVerifications = [],
        salaryNegotiations = [],
        awaitingApprovals = [],
        offerReleased = [],
        offerAccepted = [],
        needsChanges = [],
        rejectedOffers = [],
        withdrawnOffers = [],
        joinedOffers = [],
        currentStatus,
        referenceVerification = [],
        checkListVerification = [],
      } = {},
    } = this.props;

    let data = '';

    switch (currentStatus) {
      case NEW_PROCESS_STATUS.DRAFT:
        data = drafts;
        break;
      case NEW_PROCESS_STATUS.PROFILE_VERIFICATION:
        data = profileVerifications;
        break;
      case NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION:
        data = documentVerifications;
        break;
      case NEW_PROCESS_STATUS.SALARY_NEGOTIATION:
        data = salaryNegotiations;
        break;
      case NEW_PROCESS_STATUS.AWAITING_APPROVALS:
        data = awaitingApprovals;
        break;
      case NEW_PROCESS_STATUS.NEEDS_CHANGES:
        data = needsChanges;
        break;
      case NEW_PROCESS_STATUS.OFFER_RELEASED:
        data = offerReleased;
        break;
      case NEW_PROCESS_STATUS.OFFER_ACCEPTED:
        data = offerAccepted;
        break;
      case NEW_PROCESS_STATUS.OFFER_REJECTED:
        data = rejectedOffers;
        break;
      case NEW_PROCESS_STATUS.OFFER_WITHDRAWN:
        data = withdrawnOffers;
        break;
      case NEW_PROCESS_STATUS.JOINED:
        data = joinedOffers;
        break;
      case NEW_PROCESS_STATUS.REFERENCE_VERIFICATION:
        data = referenceVerification;
        break;
      case NEW_PROCESS_STATUS.DOCUMENT_CHECKLIST_VERIFICATION:
        data = checkListVerification;
        break;
      default:
        // all
        data = dataAll;
        break;
    }
    return data;
  };

  downloadTemplate = () => {
    const data = this.checkPathLocation();
    exportToCSV(this.processData(data), 'DataOnboarding.xlsx');
  };

  processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      const {
        generalInfo: { firstName },
      } = item.assignTo;
      const {
        generalInfo: { firstName: name },
      } = item.assigneeManager;
      return {
        //      'Candidate Id': item.candidateId,
        Candidate: item.candidate,
        //      'Candidate Name': item.candidateName,
        'First Name': item.firstName,
        'Middle Name': item.middleName,
        'Last Name': item.lastName,
        'Person Email': item.personEmail,
        Position: item.position,
        Location: item.location,
        Classification: item.employeeType,
        Grade: item.grade,
        Department: item.department,
        'Previous years of experience': item.previousExperience,
        'Reporting Manager': item.reportingManager,
        Reportees: item.reportees,
        'Date of Join': item.dateJoin,
        'Assign to': firstName,
        'HR Manager': name,
        Status: item.processStatus,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  onUploadDocument = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        uploadDocumentModalVisible: true,
      },
    });
  };

  renderActionButton = (tabName, type) => {
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          {tabName !== 'settings' && (
            <Col>
              <Button
                icon={<DownloadOutlined />}
                className={styles.generate}
                type="text"
                onClick={this.downloadTemplate}
              >
                {formatMessage({ id: 'component.employeeOnboarding.generate' })}
              </Button>
            </Col>
          )}

          {tabName === 'settings' && (type === '' || type === 'documents-templates') && (
            <Col>
              <Button
                icon={<UploadOutlined />}
                className={styles.generate}
                type="text"
                onClick={this.onUploadDocument}
              >
                Upload
              </Button>
            </Col>
          )}
          <Col>
            <Button className={styles.view} type="link">
              {formatMessage({ id: 'component.employeeOnboarding.viewActivityLogs' })} (15)
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { permissions = [] } = this.props;
    const { TabPane } = Tabs;

    const viewOnboardingSettingTab = permissions.viewOnboardingSettingTab !== -1;
    const viewOnboardingOverviewTab = permissions.viewOnboardingOverviewTab !== -1;
    const viewOnboardingNewJoinees = permissions.viewOnboardingNewJoinees !== -1;

    const {
      match: { params: { tabName = '', type = '' } = {} },
    } = this.props;

    if (!tabName) return '';
    return (
      <PageContainer>
        <div className={styles.containerOnboarding}>
          <div className={styles.tabs}>
            <Tabs
              activeKey={tabName || 'list'}
              onChange={(key) => {
                history.push(`/onboarding/${key}`);
              }}
              tabBarExtraContent={this.renderActionButton(tabName, type)}
            >
              {viewOnboardingOverviewTab && (
                <TabPane
                  tab={formatMessage({ id: 'component.employeeOnboarding.onboardingOverview' })}
                  key="list"
                >
                  <OnboardingOverview type={type} />
                </TabPane>
              )}
              {viewOnboardingSettingTab ? (
                <>
                  <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.settings' })}
                    key="settings"
                  >
                    <Settings type={type} />
                  </TabPane>
                </>
              ) : null}
              {viewOnboardingNewJoinees ? (
                <>
                  <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.newJoinees' })}
                    key="newJoinees"
                  >
                    <NewJoinees type={type} />
                  </TabPane>
                </>
              ) : null}
            </Tabs>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default Onboarding;
