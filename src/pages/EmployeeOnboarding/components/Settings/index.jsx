import React, { PureComponent } from 'react';
import { connect } from 'umi';
import CommonLayout from '@/components/CommonLayout';

import BackgroundChecks from './components/BackgroundChecks';
import CompanySignatory from './components/CompanySignatory';
import CustomEmails from './components/CustomEmails';
import DocumentsAndTemplates from './components/DocumentsAndTemplates';
import NonExtempNotice from './components/NonExtempNotice';
import OptionalOnboardingQuestions from './components/OptionalOnboardingQuestions';

@connect(({ info: { currentStep = 0, displayComponent = {} } = {} }) => ({
  currentStep,
  displayComponent,
}))
class Settings extends PureComponent {
  render() {
    const listMenu = [
      {
        id: 1,
        name: 'Documents and Templates',
        key: 'documentsAndTemplates',
        component: <DocumentsAndTemplates />,
      },
      {
        id: 2,
        name: 'Non-Extemp Notice',
        key: 'nonExtempNotice',
        component: <NonExtempNotice />,
      },
      {
        id: 3,
        name: 'Background Checks',
        key: 'backgroundChecks',
        component: <BackgroundChecks />,
      },
      {
        id: 4,
        name: 'Optional Onboarding Questions',
        key: 'optionalOnboardingQuestions',
        component: <OptionalOnboardingQuestions />,
      },
      {
        id: 5,
        name: 'Company Signatory',
        key: 'companySignatory',
        component: <CompanySignatory />,
      },
      { id: 6, name: 'Custom Emails', key: 'customEmails', component: <CustomEmails /> },
    ];
    return (
      <div>
        <CommonLayout listMenu={listMenu} currentPage="settings" />
      </div>
    );
  }
}

export default Settings;
