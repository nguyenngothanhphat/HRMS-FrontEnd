import React, { PureComponent } from 'react';
import { connect } from 'umi';
import SettingLayout from '@/components/SettingLayout';
import CompanySignatory from '@/pages/Onboarding/components/Settings/components/CompanySignatory';
import CustomEmails from './components/CustomEmails';
import DocsTemplates from './components/DocsTemplates';
import Forms from './components/Forms';

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
        link: 'documents-templates',
      },
      {
        id: 2,
        name: 'Forms',
        key: 'forms',
        component: <Forms />,
        link: 'forms',
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
        name: 'Approval & Permissions',
        key: 'aoprovalPermissions',
        link: 'approval-permissions',
        // component: <CompanySignatory />,
      },
    ];
    const { type = '' } = this.props;
    return (
      <div>
        <SettingLayout
          listMenu={listMenu}
          currentPage="settings"
          tabName={type}
          route="offboarding"
        />
      </div>
    );
  }
}

export default Settings;
