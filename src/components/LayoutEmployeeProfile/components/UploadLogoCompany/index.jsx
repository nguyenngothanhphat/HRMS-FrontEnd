import React, { Component } from 'react';
import { Button, Image } from 'antd';
import { connect } from 'umi';
import logoDefault from '@/assets/companyDefault.png';
import ModalUpload from '@/components/ModalUpload';
import s from './index.less';

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    companiesManagement: {
      originData: { companyDetails = {}, companyDetails: { company: { logoUrl = '' } = {} } } = {},
    } = {},
  }) => ({
    currentUser,
    logoUrl,
    companyDetails,
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
    const { dispatch, companyDetails: { company: { _id: id = '', tenant = '' } = {} } = {} } =
      this.props;
    if (statusCode === 200) {
      const [first] = data;
      if (id) {
        dispatch({
          type: 'companiesManagement/updateCompany',
          payload: { id, tenantId: tenant, logoUrl: first?.url },
          dataTempKept: {},
          isAccountSetup: true,
        }).then(({ statusCode: check }) => {
          if (check === 200) {
            dispatch({
              type: 'companiesManagement/saveCompanyDetails',
              payload: { logoUrl: first?.url },
            });
            this.handleCancel();
          }
        });
      } else {
        dispatch({
          type: 'companiesManagement/saveCompanyDetails',
          payload: { logoUrl: first?.url },
          // dataTempKept: {},
          // isAccountSetup: true,
        });
        this.handleCancel();
      }
    }
  };

  render() {
    const { visible } = this.state;
    const { logoUrl = '' } = this.props;
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
            {!logoUrl ? 'Upload company logo' : 'Change logo'}
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
