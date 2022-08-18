import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import CustomBlueButton from '@/components/CustomBlueButton';
import { ONBOARDING_TABS } from '@/constants/onboarding';
import { PageContainer } from '@/layouts/layout/src';
import { exportArrayDataToCsv } from '@/utils/exportToCsv';
import { goToTop } from '@/utils/utils';
import NewJoinees from './components/NewJoinees/index';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
import styles from './index.less';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';

@connect(
  ({
    user: { permissions = [] } = {},
    onboarding: { onboardingOverview = {}, joiningFormalities = {} } = {},
  }) => ({
    permissions,
    onboardingOverview,
    joiningFormalities,
  }),
)
class Onboarding extends PureComponent {
  componentDidMount = () => {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    if (!tabName) {
      history.replace(`/onboarding/list/all`);
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

  downloadTemplate = (tabName) => {
    if (tabName === ONBOARDING_TABS.OVERVIEW) {
      const { onboardingOverview: { onboardingData = [] } = {} } = this.props;
      exportArrayDataToCsv('OnboardingData', this.processData(onboardingData, tabName));
    } else {
      const { joiningFormalities: { listNewComer = [] } = {} } = this.props;
      exportArrayDataToCsv('NewJoineesData', this.processData(listNewComer, tabName));
    }
  };

  processData = (array = [], tabName) => {
    // Uppercase first letter
    let capsPopulations = [];
    if (tabName === ONBOARDING_TABS.OVERVIEW) {
      capsPopulations = array.map((item) => {
        const { workLocation, clientLocation, workFromHome } = item;
        const location = workLocation
          ? workLocation.name
          : clientLocation || (workFromHome && 'Work From Home');

        const reportingManager = [
          item.reportingManager?.generalInfo?.firstName,
          item.reportingManager?.generalInfo?.middleName,
          item.reportingManager?.generalInfo?.lastName,
        ]
          .filter(Boolean)
          .join(' ');
        return {
          Candidate: item.ticketID,
          'First Name': item.firstName,
          'Middle Name': item.middleName,
          'Last Name': item.lastName,
          'Person Email': item.privateEmail,
          Position: item.title?.name,
          Location: location,
          Classification: item.employeeType?.name,
          Grade: item.grade?.name,
          Department: item.department?.name,
          'Previous years of experience': item.previousExperience,
          'Reporting Manager': reportingManager,
          // Reportees: item.reportees,
          'Date of Join': item.dateOfJoining && moment(item.dateOfJoining).format(DATE_FORMAT_MDY),
          'Assign to': item.assignTo?.generalInfo?.legalName,
          'HR Manager': item.assigneeManager?.generalInfo?.legalName,
          Status: item.processStatus,
        };
      });
    } else {
      capsPopulations = array.map((item) => {
        const {
          title: { name: titleName = '' } = {},
          hrEmployee: { generalInfoInfo: { legalName: hrPOCName = '' } = {} } = {},
          hrManager: { generalInfoInfo: { legalName: hrManagerName = '' } = {} } = {},
        } = item;
        return {
          Candidate: item.ticketId,
          'Full Name': item.candidateFullName,
          'Joining Date': item.joiningDate && moment(item.joiningDate).format(DATE_FORMAT_MDY),
          'Years of Experience': item.yearsOfExp,
          'Job Title': titleName,
          'HR POC': hrPOCName,
          'HR Manager': hrManagerName,
        };
      });
    }

    // Get keys, header csv
    const keys = Object.keys(!isEmpty(capsPopulations) ? capsPopulations[0] : []);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('__')}`.split('__');
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
                onClick={() => this.downloadTemplate(tabName)}
              >
                {formatMessage({ id: 'component.employeeOnboarding.generate' })}
              </Button>
            </Col>
          )}

          {tabName === ONBOARDING_TABS.SETTINGS && (type === '' || type === 'documents-templates') && (
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
            <CustomBlueButton>View activity log</CustomBlueButton>
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
                  key={ONBOARDING_TABS.OVERVIEW}
                >
                  <OnboardingOverview type={type} />
                </TabPane>
              )}
              {viewOnboardingSettingTab ? (
                <>
                  <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.settings' })}
                    key={ONBOARDING_TABS.SETTINGS}
                  >
                    <Settings type={type} />
                  </TabPane>
                </>
              ) : null}
              {viewOnboardingNewJoinees ? (
                <>
                  <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.newJoinees' })}
                    key={ONBOARDING_TABS.NEW_JOINEES}
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
