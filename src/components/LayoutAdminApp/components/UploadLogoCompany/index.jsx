import React, { Component } from 'react';
import { Button, Image, Spin } from 'antd';
import { connect } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import logoDefault from '@/assets/companyDefault.png';
import ModalUpload from '@/components/ModalUpload';
import { getCurrentTenant } from '@/utils/authority';
import s from './index.less';
import ModalRemoveLogo from './components/ModalRemoveLogo';

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
    loadingSave: loading.effects['companiesManagement/saveOrigin'],
  }),
)
class UploadLogoCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      openModal: false,
    };
  }

  openModalUpload = (key) => {
    if (key === 'remove') {
      this.setState({
        openModal: true,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  getResponse = (resp) => {
    const { statusCode, data = [] } = resp;
    const {
      dispatch,
      companyDetails = {},
      companyDetails: { company: { _id: id = '' } = {} } = {},
    } = this.props;
    const tenantId = getCurrentTenant();
    const [first] = data;

    if (statusCode === 200) {
      if (id) {
        dispatch({
          type: 'companiesManagement/updateCompany',
          payload: { id, logoUrl: first?.url, tenantId },
          // dataTempKept: {},
          // isAccountSetup: true,
        }).then(({ statusCode: check }) => {
          if (check === 200) {
            this.handleCancel();
          }
        });
      } else {
        dispatch({
          type: 'companiesManagement/saveCompanyDetails',
          payload: { ...companyDetails?.company, logoUrl: data?.url },
          // dataTempKept: {},
          // isAccountSetup: true,
        });
        this.handleCancel();
      }
    }
  };

  handleCancelModalRemove = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { visible, openModal } = this.state;
    const {
      companyDetails: { company: { _id: id = '' } = {} } = {},
      logoUrl = '',
      loadingSave = false,
    } = this.props;

    if (loadingSave)
      return (
        <div className={s.loadingSpin}>
          <Spin />
        </div>
      );
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
              <DeleteOutlined onClick={() => this.openModalUpload('remove')} />
            </div>
          )}

          <Button className={s.btnUpload} onClick={() => this.openModalUpload('open')}>
            {logoUrl ? 'Change Logo' : 'Upload company logo'}
          </Button>
        </div>
        <ModalRemoveLogo
          titleModal="Remove Logo"
          visible={openModal}
          handleCancel={this.handleCancelModalRemove}
          companyId={id}
        />
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
