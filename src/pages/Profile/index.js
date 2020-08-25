import React, { useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Row, Col, Spin } from 'antd';
import UpdateAvatar from '@/components/UpdateAvatar';
import EditableTab from './components/EditableTab';
import ReporterTab from './components/ReporterTab';
import styles from './index.less';

const Profile = props => {
  const { userInfo = {}, loadingAvatar = false, dispatch, listRate = {} } = props;
  const [visible, setVisible] = React.useState(false);
  const {
    avatarUrl = '',
    fullName = '',
    email = '',
    title = '',
    company = {},
    location = {},
    manager = {},
  } = userInfo;
  const [urlImage, setUrlImage] = React.useState(avatarUrl);

  const Id = location._id || '';
  useEffect(() => {
    dispatch({
      type: 'appSetting/fetchByLocation',
      payload: { location: Id },
    });
  }, []);

  const imagedefault = '/assets/img/Avatardefaut.svg';
  return (
    <div className={styles.profileContainer}>
      <Row className={styles.profileContainer}>
        <Col span={24}>
          <div className={styles.title}>{formatMessage({ id: 'profile.title' })}</div>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={24} lg={24}>
          <Spin spinning={loadingAvatar}>
            <EditableTab
              themeName="myprofile"
              name={fullName}
              title={title}
              email={email}
              avatarUrl={urlImage || imagedefault}
              company={company.name}
              companyCode={company && company.code ? company.code : ''}
              country={location && location.name}
              currency={location && location.currency._id}
              symbol={location && location.currency.symbol}
              listRate={listRate}
              button={
                <UpdateAvatar
                  title={formatMessage({ id: 'profile.upload-image' })}
                  visible={visible}
                  showModal={() => setVisible(true)}
                  handleCancel={() => setVisible(false)}
                  onChange={imageLink => {
                    setUrlImage(imageLink);
                    setVisible(false);
                  }}
                />
              }
            />
          </Spin>
          {manager.email && (
            <React.Fragment>
              <Row>
                <Col span={24}>
                  <div className={styles.subtitle}>
                    {formatMessage({ id: 'profile.reportingToTitle' })}
                  </div>
                </Col>
              </Row>
              <ReporterTab
                name={manager.fullName}
                title={manager.title ? manager.title : ''}
                email={manager.email}
                avatarUrl={imagedefault}
              />
            </React.Fragment>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default connect(
  ({
    appSetting: { mileageTypeRate: { dynamic: listRate = [] } = {} } = {},
    loading,
    user: { currentUser: userInfo },
  }) => ({
    listRate,
    userInfo,
    loadingImage: loading.effects['user/updateUserProfile'],
    loadingAvatar: loading.effects['setting/uploadAvatar'],
  })
)(Profile);
