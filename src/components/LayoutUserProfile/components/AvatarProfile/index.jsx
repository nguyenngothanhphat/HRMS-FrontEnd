import React, { Component } from 'react';
import { Image, Button } from 'antd';
import { connect } from 'umi';

import ModalUpload from '@/components/ModalUpload';
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
      newAvatar: '',
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

  getResponse = async (resp) => {
    const { dispatch, currentUser: { _id: currentUserId = '', firstName = '' } = {} } = this.props;
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      if (statusCode === 200 && data.length > 0) {
        await dispatch({
          type: 'adminApp/updateAdmins',
          payload: {
            id: currentUserId,
            firstName,
            avatar: data[0].id, // id of attachment
          },
          isUpdateAvatar: true,
        }).then((res) => {
          if (res.statusCode === 200) {
            this.setState(
              {
                newAvatar: data[0].url,
                visible: false,
              },
              () => {
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              },
            );
          }
        });
      }
    } else {
      this.handleCancel();
    }
  };

  render() {
    const { visible, newAvatar } = this.state;
    const { currentUser: { avatar: { url = '' } = {} } = {} } = this.props;
    return (
      <div className={styles.root}>
        {!url ? (
          <div className={styles.logoDefault}>
            <div className={styles.logoDefault__bg}>
              <img src={logoDefault} alt="logo" className={styles.logoDefault__img} />
            </div>
          </div>
        ) : (
          <Image width={150} src={newAvatar || url} className={styles.avatar} />
        )}
        <div className={styles.uploadAvatar}>
          <Button className={styles.btnUpload} onClick={this.openModalUpload}>
            Upload avatar
          </Button>
        </div>
        <ModalUpload
          titleModal="Upload Avatar"
          visible={visible}
          handleCancel={this.handleCancel}
          widthImage="40%"
          getResponse={this.getResponse}
        />
      </div>
    );
  }
}

export default AvatarProfile;
