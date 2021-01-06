import React, { PureComponent } from 'react';
import { Button } from 'antd';
import s from './index.less';

class UploadLogoCompany extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <Button className={s.btnUpload}>Upload company logo</Button>
      </div>
    );
  }
}

export default UploadLogoCompany;
