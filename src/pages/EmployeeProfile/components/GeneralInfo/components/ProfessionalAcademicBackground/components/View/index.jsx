import { Col, Row, Tag } from 'antd';
import React, { Fragment, useState } from 'react';
import { connect } from 'umi';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const View = (props) => {
  const { employeeProfile: { employmentData: { generalInfo = {} } = {} } = {} } = props;

  const {
    preJobTitle = '',
    skills = [],
    preCompany = '',
    totalExp = 0,
    qualification = '',
    certification = [],
    linkedIn = '',
  } = generalInfo;

  const [viewingUrl, setViewingUrl] = useState(null);

  const items = [
    { id: 1, label: 'Previous Job Title', value: preJobTitle },
    { id: 2, label: 'Previous Company', value: preCompany },
    { id: 3, label: 'Total Experience (in years)', value: totalExp },
    { id: 4, label: 'Highest Qualification', value: qualification },
    { id: 5, label: 'LinkedIn', value: <span className={styles.linkedIn}>{linkedIn}</span> },
  ];

  const listColors = [
    {
      bg: '#E0F4F0',
      colorText: '#00c598',
    },
    {
      bg: '#ffefef',
      colorText: '#fd4546',
    },
    {
      bg: '#f1edff',
      colorText: '#6236ff',
    },
    {
      bg: '#f1f8ff',
      colorText: '#006bec',
    },
    {
      bg: '#fff7fa',
      colorText: '#ff6ca1',
    },
  ];

  const formatListSkill = (arr, colors) => {
    let temp = 0;
    const listFormat = arr.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item.name,
        id: item._id,
      };
    });

    return [...listFormat];
  };

  const _renderListCertification = (list) => {
    return list.map((item, index) => {
      const { name = '', urlFile = '', _id = '' } = item;
      const nameFile = urlFile.split('/').pop();

      return (
        <div key={_id} className={styles.viewRow} style={{ marginBottom: '6px' }}>
          <div className={styles.textValue}>
            {index + 1} - {name}
          </div>
          {urlFile && (
            <div className={styles.viewRow}>
              <p onClick={() => setViewingUrl(urlFile)} className={styles.nameCertification}>
                {nameFile}
              </p>
              <img
                src="/assets/images/iconFilePNG.svg"
                alt="iconFilePNG"
                className={styles.iconCertification}
              />
            </div>
          )}
        </div>
      );
    });
  };

  const skillList = formatListSkill(skills, listColors) || [];
  return (
    <>
      <Row gutter={[0, 16]} className={styles.root}>
        {items.map((item) => (
          <Fragment key={item.id}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
            </Col>
          </Fragment>
        ))}
        <Col span={6} className={styles.textLabel}>
          Certifications
        </Col>
        <Col span={18}>{_renderListCertification(certification)}</Col>
        <Col span={6} className={styles.textLabel}>
          Skills
        </Col>
        <Col span={9} className={styles.tagSkill}>
          {skillList.map((item) => (
            <Tag
              style={{
                color: `${item.color.colorText}`,
                fontWeight: 500,
              }}
              key={item.id}
              color={item.color.bg}
            >
              {item.name}
            </Tag>
          ))}
        </Col>
      </Row>
      <ViewDocumentModal
        visible={!!viewingUrl}
        onClose={() => setViewingUrl(null)}
        url={viewingUrl}
      />
    </>
  );
};

export default connect(({ employeeProfile = {} }) => ({
  employeeProfile,
}))(View);
