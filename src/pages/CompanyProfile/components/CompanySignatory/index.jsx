import React, { PureComponent } from 'react';
import ItemSignature from './components/ItemSignature';
import s from './index.less';

const dummySignature = [1, 2, 3, 4];

export default class CompanySignatory extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.content__viewTop}>
          <p className={s.title}>Company Signatory</p>
          <p className={s.text}>
            Company Signatories are required for the approval of any policies, onboarding of
            employees, any finance, administration or business related decisions.
          </p>
        </div>
        <div className={s.content__viewBottom}>
          {dummySignature.map((item, index) => (
            <ItemSignature key={item} data={item} index={index} />
          ))}
        </div>
      </div>
    );
  }
}
