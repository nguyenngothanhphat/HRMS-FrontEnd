import React, { Component } from 'react';
import { Divider, Spin, Avatar } from 'antd';
import { connect } from 'umi';
import ModalUpload from '@/components/ModalUpload';
import noLogo from '@/assets/no-photo-available-icon.png';
import styles from '../../index.less';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: companyDetailsOrigin = {} },
      tempData: { companyDetails = {} },
    } = {},
  }) => ({ companyDetailsOrigin, companyDetails }),
)
class ViewInformation extends Component {
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
    const { dispatch, companyDetailsOrigin } = this.props;
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      this.handleCancel();
      const payload = {
        ...companyDetailsOrigin,
        id: companyDetailsOrigin._id,
        logoUrl: first.url,
      };
      delete payload._id;
      dispatch({
        type: 'companiesManagement/updateCompany',
        payload,
      });
    }
  };

  render() {
    const {
      loading,
      companyDetails: { logoUrl = '', name = '' },
    } = this.props;
    const { visible } = this.state;
    if (loading)
      return (
        <div className={styles.viewLoading}>
          <Spin />
        </div>
      );
    return (
      <div className={styles.viewRight__infoCompany}>
        <img
          src="/assets/images/img-cover.jpg"
          alt="img-cover"
          className={styles.infoCompany__imgCover}
        />
        <Avatar src={logoUrl || noLogo} size={96} className={styles.infoCompany__imgAvt} />
        <img
          src="/assets/images/iconUploadImage.svg"
          onClick={this.openModalUpload}
          alt="img-upload"
          className={styles.infoCompany__imgAvt__upload}
        />
        <div className={styles.infoCompany__textNameAndTitle}>
          <p className={styles.infoCompany__textNameAndTitle__name}>{name}</p>
        </div>
        <div className={styles.infoCompany__viewBottom}>
          <Divider />
          <div>
            <img src="/assets/images/iconLinkedin.svg" alt="img-arrow" />
            <img src="/assets/images/iconMail.svg" alt="img-arrow" style={{ marginLeft: '5px' }} />
          </div>
        </div>
        <ModalUpload
          titleModal="Update logo company"
          visible={visible}
          handleCancel={this.handleCancel}
          widthImage="40%"
          getResponse={this.getResponse}
        />
      </div>
    );
  }
}

export default ViewInformation;
