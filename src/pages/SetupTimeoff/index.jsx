import React, { PureComponent } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import TimeOffTypes from './components/TimeOffTypes';
import s from './index.less';

class SetupTimeoff extends PureComponent {
  render() {
    const routes = [
      { name: 'Getting Started', path: '/account-setup/get-started' },
      {
        name: 'Setup Employee Directory',
        path: '/account-setup/get-started/setup-employee-directory',
      },
    ];
    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={s.root}>
          <div className={s.titlePage}>Setup Timeoff</div>
          <div className={s.content}>
            {/* <div className={s.header}>
              <span className={s.title}>Select & Configure timeoff types</span>
              <p className={s.description}>
                You will find below a list of generic timeoffs which every company provides.
                Configure the rules for each timeoff as per your company norms. Also you can add
                timeoffs under each category as per your company requirements. This step will take
                about 80 minutes to complete.
              </p>
            </div> */}
            <TimeOffTypes />
          </div>
        </div>
      </>
    );
  }
}

export default SetupTimeoff;
