import React, { PureComponent } from 'react';
import s from './index.less';

export default class Integrations extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content__viewTop}>
          <p className={s.title}>Integrations</p>
          <p className={s.text}>
            You can now integrate APIs from 3rd party vendors to make the most out of Terramind and
            optimise the workflow of your organization.
          </p>
        </div>
        <div className={s.content__viewBottom} />
      </div>
    );
  }
}
