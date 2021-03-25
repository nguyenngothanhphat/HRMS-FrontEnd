import React, { Component } from 'react';
import logoDefault from '@/assets/companyDefault.png';
import { Button, Image } from 'antd';
import { connect } from 'umi';
import ModalUpload from '@/components/ModalUpload';
import s from './index.less';

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    companiesManagement: {
      originData: { companyDetails: { company: { logoUrl = '' } = {} } } = {},
    } = {},
  }) => ({
    currentUser,
    logoUrl,
    loadingUpdate: loading.effects['companiesManagement/updateCompany'],
  }),
)
class UploadLogoCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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
    const { dispatch, companyDetails: { _id: id = '' } = {} } = this.props;
    if (statusCode === 200) {
      const [first] = data;
      if (id) {
        dispatch({
          type: 'companiesManagement/updateCompany',
          payload: { id, logoUrl: first?.url },
          dataTempKept: {},
          isAccountSetup: true,
        }).then(({ statusCode: check }) => {
          if (check === 200) {
            this.handleCancel();
          }
        });
      } else {
        console.log('payload add new company', first?.url);
        dispatch({
          type: 'companiesManagement/addLogoReducer',
          payload: first?.url,
          dataTempKept: {},
          isAccountSetup: true,
        });
        this.handleCancel();
      }
    }
  };

  render() {
    const { visible } = this.state;
    const { logoUrl = '' } = this.props;
    console.log('logo', logoUrl);
    return (
      <>
        <div className={s.root}>
          {!logoUrl ? (
            <div className={s.logoDefault}>
              <div className={s.logoDefault__bg}>
                <img src={logoDefault} alt="logo" className={s.logoDefault__img} />
              </div>
            </div>
          ) : (
            <div className={s.viewLogo}>
              <Image width="100%" height="auto" src={logoUrl} />
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
