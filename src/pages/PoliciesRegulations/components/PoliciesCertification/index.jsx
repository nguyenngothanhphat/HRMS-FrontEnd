import { Button, Col, Menu, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import PdfIcon from '@/assets/policiesRegulations/pdf-2.svg';
import IconContact from '@/assets/policiesRegulations/policies-icon-contact.svg';
import UnreadIcon from '@/assets/policiesRegulations/view.svg';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import SignatureModal from '@/components/SignatureModal';
import ModalImage from '@/assets/projectManagement/modalImage1.png';
import styles from './index.less';
import ActionModal from './components/ActionModal';

const PoliciesCertification = (props) => {
  const { dispatch, countryID = '', permissions = {}, listCategory = [], loadingGetList } = props;

  const [activeCategoryID, setActiveCategoryID] = useState('');
  const [showingFiles, setShowingFiles] = useState([]);
  const [isCertify, setIsCertify] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  useEffect(() => {
    const viewAllCountry = permissions.viewPolicyAllCountry !== -1;
    dispatch({
      type: 'policiesRegulations/getCountryListByCompany',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        const { data = [] } = res;
        let countryArr = [];
        if (viewAllCountry) {
          countryArr = data.map((item) => {
            return item.headQuarterAddress.country;
          });
          const newArr = removeDuplicate(countryArr, (item) => item._id);
          countryArr = newArr.map((val) => val._id);
          if (countryArr.length > 0) {
            dispatch({
              type: 'policiesRegulations/save',
              payload: {
                countryList: countryArr,
              },
            });
          }
          dispatch({
            type: 'policiesRegulations/fetchListCategory',
            payload: {
              country: countryArr,
            },
          });
        } else {
          dispatch({
            type: 'policiesRegulations/fetchListCategory',
            payload: {
              country: [countryID],
            },
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (listCategory.length > 0) {
      setActiveCategoryID(listCategory[0]._id);
    }
  }, [JSON.stringify(listCategory)]);

  useEffect(() => {
    if (activeCategoryID) {
      const { policyregulations = [] } = listCategory.find((x) => x._id === activeCategoryID) || {};
      setShowingFiles(policyregulations);
    }
  }, [activeCategoryID]);

  const handleViewDocument = (file) => {
    history.push(`/policies-regulations/certify/${activeCategoryID}/${file._id}`);
  };

  const handleChange = (key) => {
    setActiveCategoryID(key);
  };

  const getContent = () => {
    return showingFiles.map((val) => (
      <div key={val.attachment._id} className={styles.viewCenter__title}>
        <div className={styles.viewCenter__title__text}>
          <img src={PdfIcon} alt="pdf" />
          <span className={styles.viewCenter__title__text__category}>{val.attachment.name}</span>
        </div>
        <Button
          className={styles.viewCenter__title__view}
          icon={<img src={UnreadIcon} alt="view" />}
          onClick={() => handleViewDocument(val)}
        >
          <span className={styles.viewCenter__title__view__text}>View</span>
        </Button>
      </div>
    ));
  };

  const onFinish = (attachmentID) => {
    console.log('🚀 ~ onFinish ~ attachmentID', attachmentID);
    setIsCertify(false);
    setIsDone(true);
  };

  const renderFinalStep = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={12}>
            <span className={styles.describeText}>
              Sign this document to certify that you have read all the policy documents.
            </span>
          </Col>
          <Col span={12}>
            <div className={styles.bottomBar__button}>
              <Button
                type="primary"
                className={styles.bottomBar__button__primary}
                onClick={() => setIsCertify(true)}
              >
                Certify
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  if (loadingGetList || !activeCategoryID)
    return (
      <div className={styles.PoliciesCertification} style={{ padding: 24 }}>
        <Skeleton />
      </div>
    );
  return (
    <div className={styles.PoliciesCertification}>
      <Row>
        <Col sm={24} md={5} className={styles.viewLeft}>
          <div className={`${listCategory.length > 0 ? styles.viewLeft__menu : ''}`}>
            <Menu selectedKeys={[activeCategoryID]} onClick={(e) => handleChange(e.key)}>
              {listCategory.map((val) => {
                const { name, _id } = val;
                return <Menu.Item key={_id}>{name}</Menu.Item>;
              })}
            </Menu>
            <div className={styles.viewLeft__menu__btnPreviewOffer} />
          </div>
        </Col>
        <Col sm={24} md={10} xl={13} className={styles.viewCenter}>
          {getContent()}
          {renderFinalStep()}
        </Col>
        <Col sm={24} md={9} xl={6} style={{ padding: '24px 24px 24px 0' }}>
          <div className={styles.viewRight}>
            <div className={styles.viewRight__title}>
              <div className={styles.viewRight__title__container}>
                <div className={styles.viewRight__title__container__boder}>
                  <img src={IconContact} alt="Icon Contact" />
                </div>
              </div>
              <div className={styles.viewRight__title__text}>Instructions</div>
            </div>
            <div className={styles.viewRight__content}>
              Our support team is waiting to help you 24/7. Get an emailed response from our team.
            </div>
            <div className={styles.viewRight__btnContact}>
              <Button>Contact Us</Button>
            </div>
            <div />
          </div>
        </Col>
      </Row>
      <SignatureModal
        visible={isCertify}
        onClose={() => setIsCertify(false)}
        onFinish={onFinish}
        titleModal="Signature of the employee"
        loading={false}
      />

      <ActionModal
        visible={isDone}
        onClose={() => {
          setIsDone(false);
        }}
        buttonText="Okay"
        width={400}
      >
        <img src={ModalImage} alt="" />
        <span style={{ fontWeight: 'bold' }}>Thank you!</span>
      </ActionModal>
    </div>
  );
};

export default connect(
  ({
    loading,
    policiesRegulations: { listCategory = [] } = {},
    user: {
      permissions = {},
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      } = {},
    },
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
    listCategory,
    countryID,
    permissions,
  }),
)(PoliciesCertification);
