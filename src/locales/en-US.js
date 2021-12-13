import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import newCandidateForm from './en-US/newCandidateForm';
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
import changePassword from './en-US/changePassword';
import frequentlyAskedQuestions from './en-US/frequentlyAskedQuestions';
// admin pages
import usersManagementPage from './en-US/usersManagementPage';
import documentsManagementPage from './en-US/documentsManagementPage';
import employeesManagementPage from './en-US/employeesManagementPage';
import companiesManagementPage from './en-US/companiesManagementPage';
import customerManagementPage from './en-US/customer';
import adminSetting from './en-US/adminSetting';
import footer from './en-US/footer';

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
  ...newCandidateForm,
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
  ...changePassword,
  ...frequentlyAskedQuestions,
  // admin pages
  ...usersManagementPage,
  ...documentsManagementPage,
  ...employeesManagementPage,
  ...companiesManagementPage,
  ...customerManagementPage,
  ...onBoardingCustomFields,
  ...adminSetting,
  ...footer,
};
