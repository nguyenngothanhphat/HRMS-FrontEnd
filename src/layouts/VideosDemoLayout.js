import React from 'react';
import pathToRegexp from 'path-to-regexp';
import QALayoutContent from '@/layouts/QALayoutContent';

const Layout = props => {
  const {
    location: { pathname },
    children,
    route: { routes = [] },
  } = props;
  const regexp = pathToRegexp('/videos-demo/:sub/:status?');
  let sub = '';
  let status = '';
  [, sub, status] = regexp.exec(pathname) || ['', 'webapp', 'test1'];
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
          name: 'Demo Web App',
          key: 'webapp',
          itemMenu: [
            {
              name: 'Add A New Expense',
              key: 'addanewexpense',
              link: '/videos-demo/webapp/addanewexpense',
            },
            {
              name: 'Add A New Mileage',
              key: 'addanewmileage',
              link: '/videos-demo/webapp/addanewmileage',
            },
            {
              name: 'Delete Update An Expense',
              key: 'deleteupdateexpense',
              link: '/videos-demo/webapp/deleteupdateexpense',
            },
            {
              name: 'Add A New Report',
              key: 'addanewreport',
              link: '/videos-demo/webapp/addanewreport',
            },
            {
              name: 'Approve A Report',
              key: 'approveareport',
              link: '/videos-demo/webapp/approveareport',
            },
            {
              name: 'Comment A Report',
              key: 'commentareport',
              link: '/videos-demo/webapp/commentareport',
            },
            {
              name: 'Ask For More Info A Report',
              key: 'askformoreinfo',
              link: '/videos-demo/webapp/askformoreinfo',
            },
            {
              name: 'Reject A Report',
              key: 'rejectareport',
              link: '/videos-demo/webapp/rejectareport',
            },
          ],
        },
        {
          name: 'Demo Mobile App',
          key: 'mobile',
          itemMenu: [
            {
              name: 'Add A New Expense',
              key: 'add-a-new-expense',
              link: '/videos-demo/mobile/add-a-new-expense',
            },
            {
              name: 'Add A New Mileage',
              key: 'add-a-new-mileage',
              link: '/videos-demo/mobile/add-a-new-mileage',
            },
            {
              name: 'Delete Update An Expense',
              key: 'delete-update-expense',
              link: '/videos-demo/mobile/delete-update-expense',
            },
            {
              name: 'Add A New Report',
              key: 'add-a-new-report',
              link: '/videos-demo/mobile/add-a-new-report',
            },
            {
              name: 'Approve A Report',
              key: 'approve-a-report',
              link: '/videos-demo/mobile/approve-a-report',
            },
            {
              name: 'Comment A Report',
              key: 'comment-a-report',
              link: '/videos-demo/mobile/comment-a-report',
            },
            {
              name: 'Reject A Report',
              key: 'reject-a-report',
              link: '/videos-demo/mobile/reject-a-report',
            },
          ],
        },
        // {
        //   isMenu: true,
        //   itemMenu: [
        //     {
        //       name: 'Contact Us',
        //       key: 'contactus',
        //       link: '/question-and-answer/contactus',
        //     },
        //   ],
        // },
      ]}
    />
  );
};

export default Layout;
