import React, { PureComponent } from 'react';
import { connect } from 'umi';
import SettingLayout from '@/components/SettingLayout';
import CompanySignatory from './components/CompanySignatory';
import CustomEmails from './components/CustomEmails';
import DocsTemplates from './components/DocsTemplates';

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
        component: <DocsTemplates />,
      },
      {
        id: 2,
        name: 'Forms',
        key: 'forms',
        // component: <NonExtempNotice />,
      },
      {
        id: 3,
        name: 'Company Signatory',
        key: 'companySignatory',
        component: <CompanySignatory />,
      },
      { id: 4, name: 'Custom Emails', key: 'customEmails', component: <CustomEmails /> },
      {
        id: 5,
        name: 'Approval & Permissions',
        key: 'aoprovalPermissions',
        // component: <CompanySignatory />,
      },
    ];
    return (
      <div>
        <SettingLayout listMenu={listMenu} currentPage="settings" />
      </div>
    );
  }
}

export default Settings;
