import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import formTeamMember from './en-US/formTeamMember';
import commonLayout from './en-US/commonLayout';
import authLayout from './en-US/authLayout';
import notFoundPage from './en-US/notFoundPage';
import dashboardPage from './en-US/dashboardPage';
import directoryPage from './en-US/directoryPage';
import employeeProfilePage from './en-US/employeeProfilePage';
import forgotPasswordPage from './en-US/forgotPasswordPage';
import loginPage from './en-US/loginPage';
import signUpPage from './en-US/signUpPage';
import resetPasswordPage from './en-US/resetPasswordPage';
import employeeOnboarding from './en-US/employeeOnboarding';
import templateDetails from './en-US/templateDetails';
import offBoarding from './en-US/offBoarding';
import onBoardingCustomFields from './en-US/onBoardingCustomFields';
// admin pages
import usersManagementPage from './en-US/usersManagementPage';
import documentsManagementPage from './en-US/documentsManagementPage';
import employeesManagementPage from './en-US/employeesManagementPage';
import companiesManagementPage from './en-US/companiesManagementPage';
import adminSetting from './en-US/adminSetting';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...formTeamMember,
  ...commonLayout,
  ...authLayout,
  ...notFoundPage,
  ...dashboardPage,
  ...directoryPage,
  ...employeeProfilePage,
  ...forgotPasswordPage,
  ...loginPage,
  ...signUpPage,
  ...resetPasswordPage,
  ...employeeOnboarding,
  ...templateDetails,
  ...offBoarding,
  // admin pages
  ...usersManagementPage,
  ...documentsManagementPage,
  ...employeesManagementPage,
  ...companiesManagementPage,
  ...onBoardingCustomFields,
  ...adminSetting,
};
