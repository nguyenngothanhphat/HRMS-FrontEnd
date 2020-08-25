import React from 'react';
import pathToRegexp from 'path-to-regexp';
import QALayoutContent from '@/layouts/QALayoutContent';

const Layout = props => {
  const {
    location: { pathname },
    children,
    route: { routes = [] },
  } = props;
  const regexp = pathToRegexp('/question-and-answer/:sub/:status?');
  let sub = '';
  let status = '';
  [, sub, status] = regexp.exec(pathname) || ['', 'userrole-approvalflow', 'userrole'];
  if (!status || status === '') status = sub;
  const headerName = routes.find(item => item.path === pathname);

  return (
    <QALayoutContent
      activeKey={status}
      activeSubMenukey={sub}
      itemContent={children}
      headerName={headerName && headerName.name}
      tabs={[
        {
          name: 'Web App',
          key: 'webapp',
          itemMenu: [
            {
              name: 'How to login?',
              key: 'howtologin',
              link: '/question-and-answer/webapp/howtologin',
            },
            {
              name: 'Adding a new expense',
              key: 'addinganewexpense',
              link: '/question-and-answer/webapp/addinganewexpense',
            },
            {
              name: 'Adding a mileage expense',
              key: 'addingamileageexpense',
              link: '/question-and-answer/webapp/addingamileageexpense',
            },
            {
              name: 'Adding new report',
              key: 'addingnewreport',
              link: '/question-and-answer/webapp/addingnewreport',
            },
            {
              name: 'Approving/Rejecting a report',
              key: 'approvingrejectingareport',
              link: '/question-and-answer/webapp/approvingrejectingareport',
            },
            {
              name: 'Commenting on a report',
              key: 'commentingonareport',
              link: '/question-and-answer/webapp/commentingonareport',
            },
            {
              name: 'Exporting Reports',
              key: 'exportingreports',
              link: '/question-and-answer/webapp/exportingreports',
            },
            {
              name: 'User Profile',
              key: 'userprofile',
              link: '/question-and-answer/webapp/userprofile',
            },
          ],
        },
        {
          name: 'Mobile App',
          key: 'mobileapp',
          itemMenu: [
            {
              name: 'How to install the Android App',
              key: 'installandroid',
              link: '/question-and-answer/mobileapp/installandroid',
            },
            {
              name: 'How to install the IOS App',
              key: 'installIOS',
              link: '/question-and-answer/mobileapp/installIOS',
            },
            {
              name: 'How to reinstall the IOS App',
              key: 'reinstallIOS',
              link: '/question-and-answer/mobileapp/reinstallIOS',
            },
            {
              name: 'How to login?',
              key: 'howtologinMobile',
              link: '/question-and-answer/mobileapp/howtologinMobile',
            },
            {
              name: 'Adding a new expense',
              key: 'newexpenseMobile',
              link: '/question-and-answer/mobileapp/newexpenseMobile',
            },
            {
              name: 'Adding a mileage expense',
              key: 'newmileageexpenseMobile',
              link: '/question-and-answer/mobileapp/newmileageexpenseMobile',
            },
            {
              name: 'Adding a new report',
              key: 'newreportMobile',
              link: '/question-and-answer/mobileapp/newreportMobile',
            },
            {
              name: 'Approving/Rejecting a report',
              key: 'approvalrejectreportMobile',
              link: '/question-and-answer/mobileapp/approvalrejectreportMobile',
            },
            {
              name: 'Commenting on a report',
              key: 'commentingreportMobile',
              link: '/question-and-answer/mobileapp/commentingreportMobile',
            },
            {
              name: 'User Profile',
              key: 'userprofileMobile',
              link: '/question-and-answer/mobileapp/userprofileMobile',
            },
          ],
        },
      ]}
    />
  );
};

export default Layout;
