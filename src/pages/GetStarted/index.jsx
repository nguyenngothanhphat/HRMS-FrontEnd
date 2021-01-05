import { Button } from 'antd';
import React, { PureComponent } from 'react';
import ItemSetup from './components/ItemSetup';
import s from './index.less';

export default class GetStarted extends PureComponent {
  render() {
    const dummyListSetup = [
      { id: '1', name: 'Setup Company profile', description: '15 minutes' },
      {
        id: '2',
        name: 'Setup Employee Directory',
        description: 'Setup company profile to unlock',
        status: 'lock',
      },
    ];
    return (
      <div className={s.root}>
        <div className={s.content}>
          <p className={s.title}>Get Started</p>
          <p className={s.text}>
            We’ve got a list of tasks to get you set up. We’ll walk you through everything and you
            will be done in no time!
          </p>
          {dummyListSetup.map((item) => (
            <ItemSetup key={item.id} item={item} />
          ))}
        </div>
        <div className={s.viewBtn}>
          <Button disabled className={s.btnGoToDashboard}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}
