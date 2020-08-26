export default [
  {
    path: '/login',
    component: '../layouts/SignupLayout',
    routes: [{ path: '/login/', component: './Login/index' }],
  },
  {
    path: '/password/reset/:code',
    component: '../layouts/SignupLayout',
    routes: [{ path: '/password/reset/:code(\\d+)', component: './ResetPassword/index' }],
  },
  {
    path: '/change-password',
    component: '../layouts/SignupLayout',
    routes: [{ path: '/change-password/', component: './ChangePassword/index' }],
  },
  {
    path: '/sub-forgot-password',
    component: '../layouts/SignupLayout',
    routes: [{ path: '/sub-forgot-password/', component: './SubForgotPassWord/index' }],
  },
  {
    path: '/forgot-password',
    component: '../layouts/SignupLayout',
    routes: [{ path: '/forgot-password/', component: './ForgotPassword/index' }],
  },
  {
    path: '/terms-and-conditions',
    component: '../layouts/TermsLayout',
    routes: [{ path: '/terms-and-conditions/', component: './TermsAndConditions/index' }],
  },
  {
    path: '/privacy-policy',
    component: '../layouts/TermsLayout',
    routes: [{ path: '/privacy-policy/', component: './PrivacyPolicy/index' }],
  },
  {
    path: '/signup',
    name: 'signup',
    component: '../layouts/SignupLayout',
    routes: [{ path: '/signup/', component: './Signup/index' }],
  },
  {
    path: '/',
    Routes: ['src/pages/Authorized'],
    component: '../layouts/BasicLayout',
    authority: ['admin', 'user', 'finance', 'customer', 'employee'],
    routes: [
      {
        path: '/',
        name: 'dashboard',
        component: './Dashboard/index',
        hideInMenu: true,
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Dashboard/index',
        hideInBreadcrumb: true,
      },
      {
        path: '/profile',
        name: 'profile',
        position: 'right-menu',
        icon: '/assets/new-imgs/profile.svg',
        component: './Profile/index',
      },
      {
        path: '/profile',
        name: 'profile',
        icon: '/assets/new-imgs/profile.svg',
        component: './Profile/index',
      },
      {
        component: '404',
      },
    ],
  },
];
