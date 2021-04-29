import React, { Component } from 'react';
import { Image, Button } from 'antd';
import { connect } from 'umi';

import ModalUpload from '@/components/ModalUpload';
import { getCurrentTenant } from '@/utils/authority';
import logoDefault from '@/assets/companyDefault.png';

import styles from './index.less';

@connect(({ user: { currentUser = {} } = {} }) => ({
  currentUser,
}))
class AvatarProfile extends Component {
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
    const {
      dispatch,
      companyDetails = {},
      companyDetails: { company: { _id: id = '' } = {} } = {},
    } = this.props;
    const tenantId = getCurrentTenant();

    if (statusCode === 200) {
      const [first] = data;
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
        // console.log('payload add new company', first?.url);
        dispatch({
          type: 'companiesManagement/saveCompanyDetails',
          payload: { ...companyDetails?.company, logoUrl: first?.url },
          // dataTempKept: {},
          // isAccountSetup: true,
        });
        this.handleCancel();
      }
    }
  };

  render() {
    const { visible } = this.state;
    const { currentUser: { avatar: { url = '' } = {} } = {} } = this.props;
    return (
      <div className={styles.root}>
        {!url ? (
          <div className={styles.logoDefault}>
            <div className={styles.logoDefault__bg}>
              <img src={logoDefault} alt="logo" className={s.logoDefault__img} />
            </div>
          </div>
        ) : (
          <Image width={150} src={url} className={styles.avatar} />
        )}
        <div className={styles.uploadAvatar}>
          <Button className={styles.btnUpload} onClick={this.openModalUpload}>
            Upload company logo
          </Button>
        </div>
        <ModalUpload
          titleModal="Upload Avatar"
          visible={visible}
          handleCancel={this.handleCancel}
          widthImage="40%"
          //   getResponse={this.getResponse}
        />
      </div>
    );
  }
}

export default AvatarProfile;
