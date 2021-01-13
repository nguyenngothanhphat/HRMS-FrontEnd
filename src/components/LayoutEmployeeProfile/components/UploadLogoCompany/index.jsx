import React, { Component } from 'react';
import logoDefault from '@/assets/companyDefault.png';
import { Button, Image } from 'antd';
import ModalUpload from '@/components/ModalUpload';
import s from './index.less';

class UploadLogoCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      urlLogo: '',
    };
  }

  openModalUpload = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  getResponse = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      this.setState({ urlLogo: first.url }, this.handleCancel());
    }
  };

  render() {
    const { visible, urlLogo } = this.state;
    return (
      <>
        <div className={s.root}>
          {!urlLogo ? (
            <div className={s.logoDefault}>
              <div className={s.logoDefault__bg}>
                <img src={logoDefault} alt="logo" className={s.logoDefault__img} />
              </div>
            </div>
          ) : (
            <div className={s.viewLogo}>
              <Image width="100%" height="auto" src={urlLogo} />
            </div>
          )}

          <Button className={s.btnUpload} onClick={this.openModalUpload}>
            Upload company logo
          </Button>
        </div>
        <ModalUpload
          titleModal="Upload Logo"
          visible={visible}
          handleCancel={this.handleCancel}
          widthImage="40%"
          getResponse={this.getResponse}
        />
      </>
    );
  }
}

export default UploadLogoCompany;
