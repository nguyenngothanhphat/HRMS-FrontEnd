import React, { PureComponent } from 'react';
import { connect } from 'umi';
import SettingLayout from '@/components/SettingLayout';
// import BackgroundChecks from './components/BackgroundChecks';
import CompanySignatory from './components/CompanySignatory';
import CustomEmails from './components/CustomEmails';
import DocumentsAndTemplates from './components/DocumentsAndTemplates';
import NonExtempNotice from './components/NonExtempNotice';
import OptionalOnboardingQuestions from './components/OptionalOnboardingQuestions';
import BenefitsManagement from './components/BenefitsManagement';

export const listMenu = [
  {
    id: 1,
    name: 'Documents and Templates',
    key: 'documentsAndTemplates',
    component: <DocumentsAndTemplates />,
    link: 'documents-templates',
  },
  {
    id: 2,
    name: 'Non-Extemp Notice',
    key: 'nonExtempNotice',
    component: <NonExtempNotice />,
    link: 'non-extemp-notice',
  },
  // {
  //   id: 3,
  //   name: 'Background Checks',
  //   key: 'backgroundChecks',
  //   component: <BackgroundChecks />,
  // },
  {
    id: 3,
    name: 'Optional Onboarding Questions',
    key: 'optionalOnboardingQuestions',
    component: <OptionalOnboardingQuestions />,
    link: 'optional-onboarding-questions',
  },
  {
    id: 4,
    name: 'Company Signatory',
    key: 'companySignatory',
    component: <CompanySignatory />,
    link: 'company-signatory',
  },
  {
    id: 5,
    name: 'Custom Emails',
    key: 'customEmails',
    component: <CustomEmails />,
    link: 'custom-emails',
  },
  {
    id: 6,
    name: 'Benefits Management ',
    key: 'benefitsManagement',
    component: <BenefitsManagement />,
    link: 'benefits-management',
  },
];
@connect(({ info: { currentStep = 0, displayComponent = {} } = {} }) => ({
  currentStep,
  displayComponent,
}))
class Settings extends PureComponent {
  render() {
    const { type = '' } = this.props;
    return (
      <div>
        <SettingLayout
          listMenu={listMenu}
          currentPage="settings"
          tabName={type}
          route="employee-onboarding"
        />
      </div>
    );
  }
}

export default Settings;
