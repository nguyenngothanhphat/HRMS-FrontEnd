import React, { PureComponent } from 'react';
import s from './index.less';

export default class PlanInfo extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content__viewTop}>
          <p className={s.title}>Plan Info</p>
        </div>
        <div className={s.content__viewBottom}>
          <div className={s.viewPlanType}>
            <p className={s.viewPlanType__text1}>Plan Type</p>
            <p className={s.viewPlanType__text2}>Essentials Bundle billed monthly</p>
            <p className={s.viewPlanType__text3}>
              The essentials bundle contains benefits relating to: Lorem ipsum dolor sit amet,
              consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
              dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
              ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr. sed
              diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
              voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
              gubergren, no sea takimata sanctus est Lorem ipsum
            </p>
          </div>
          <div className={s.viewCustomerSupport}>
            For more information, contact{' '}
            <span className={s.viewCustomerSupport__text}>customer support</span>
          </div>
        </div>
      </div>
    );
  }
}
