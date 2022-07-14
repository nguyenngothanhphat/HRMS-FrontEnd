import React, { PureComponent } from 'react';
import SettingLayout from '@/components/SettingLayout';
// import BackgroundChecks from './components/BackgroundChecks';
import CompanySignatory from './components/CompanySignatory';
import CustomEmails from './components/CustomEmails';
import DocumentsAndTemplates from './components/DocumentsAndTemplates';
// import NonExtempNotice from './components/NonExtempNotice';
import OptionalOnboardingQuestions from './components/OptionalOnboardingQuestions';
import BenefitsManagement from './components/BenefitsManagement';
import DocumentsChecklist from './components/DocumentsChecklist';
import SalaryStructure from './components/SalaryStructure/index';
import JoiningFormalities from './components/JoiningFormalities/index';

export const listMenu = [
  {
    id: 1,
    name: 'Documents and Templates',
    key: 'documentsAndTemplates',
    component: <DocumentsAndTemplates />,
    link: 'documents-templates',
  },
  // {
  //   id: 2,
  //   name: 'Non-Extemp Notice',
  //   key: 'nonExtempNotice',
  //   component: <NonExtempNotice />,
  //   link: 'non-extemp-notice',
  // },
  // {
  //   id: 3,
  //   name: 'Background Checks',
  //   key: 'backgroundChecks',
  //   component: <BackgroundChecks />,
  // },
  {
    id: 2,
    name: 'Optional Onboarding Questions',
    key: 'optionalOnboardingQuestions',
    component: <OptionalOnboardingQuestions />,
    link: 'optional-onboarding-questions',
  },
  {
    id: 3,
    name: 'Company Signatory',
    key: 'companySignatory',
    component: <CompanySignatory />,
    link: 'company-signatory',
  },
  {
    id: 4,
    name: 'Custom Emails',
    key: 'customEmails',
    component: <CustomEmails />,
    link: 'custom-emails',
  },
  {
    id: 5,
    name: 'Salary Structure',
    key: 'salaryStructure',
    component: <SalaryStructure />,
    link: 'salary-structure',
  },
  {
    id: 6,
    name: 'Benefits Management',
    key: 'benefitsManagement',
    component: <BenefitsManagement />,
    link: 'benefits-management',
  },
  {
    id: 7,
    name: 'Joining Formalities',
    key: 'joiningFormalities',
    component: <JoiningFormalities />,
    link: 'joining-formalities',
  },
  {
    id: 8,
    name: 'Documents Checklist',
    key: 'documentsChecklist',
    component: <DocumentsChecklist />,
    link: 'documents-checklist',
  },
];

class Settings extends PureComponent {
  render() {
    const { type = '' } = this.props;
    return (
      <div>
        <SettingLayout
          listMenu={listMenu}
          currentPage="settings"
          tabName={type}
          route="onboarding"
        />
      </div>
    );
  }
}

export default Settings;
