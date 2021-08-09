import React, { Component } from 'react';
import { Divider, Spin, Avatar, Tooltip } from 'antd';
import { connect } from 'umi';
import ModalUpload from '@/components/ModalUpload';
import noLogo from '@/assets/no-photo-available-icon.png';
import { getCurrentTenant } from '@/utils/authority';
import styles from '../../index.less';

@connect(
  ({
    companiesManagement: {
      originData: {
        companyDetails: originCompanyDetails = {},
        companyDetails: { company: companyDetailsOrigin = {} } = {},
      },
      tempData: { companyDetails: { company: companyDetails = {} } = {} },
    } = {},
  }) => ({ companyDetailsOrigin, companyDetails, originCompanyDetails }),
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
    const {
      dispatch,
      originCompanyDetails = {},
      originCompanyDetails: { company: { _id: id = '' } = {} } = {},
    } = this.props;
    const { statusCode, data = [] } = resp;
    const tenantId = getCurrentTenant();

    if (statusCode === 200) {
      const [first] = data;
      if (id) {
        const payload = {
          id,
          logoUrl: first?.url,
          tenantId,
        };
        delete payload._id;
        dispatch({
          type: 'companiesManagement/updateCompany',
          payload,
        }).then(({ statusCode: check }) => {
          if (check === 200) {
            this.handleCancel();
          }
        });
      } else {
        dispatch({
          type: 'companiesManagement/saveCompanyDetails',
          payload: { ...originCompanyDetails?.company, logoUrl: first?.url },
          // dataTempKept: {},
          // isAccountSetup: true,
        });
        this.handleCancel();
      }
    }
  };

  render() {
    const {
      loading,
      companyDetailsOrigin: { logoUrl = '', name = '' },
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
          <div className={styles.infoCompany__viewBottom__iconLinks}>
            <Tooltip title="Linkedin">
              <img
                src="/assets/images/iconLinkedin.svg"
                alt="img-arrow"
                onClick={() => window.open('https://www.linkedin.com/')}
              />
            </Tooltip>
            <Tooltip title="Mail">
              <img
                src="/assets/images/iconMail.svg"
                alt="img-arrow"
                style={{ marginLeft: '8px' }}
                onClick={() => window.open('http://gmail.com/')}
              />
            </Tooltip>
          </div>
        </div>
        <ModalUpload
          titleModal="Update Logo Company"
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
