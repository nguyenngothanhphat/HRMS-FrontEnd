import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default class View extends PureComponent {
  render() {
    const dummyData = [
      { label: 'Previous Job label', value: 'Senior UX Designer' },
      { label: 'Previous Company', value: 'Apple' },
      { label: 'Past Experience', value: '5 Years' },
      { label: 'Total Experience', value: '12 Years' },
      { label: 'Qualification', value: '12th PUC' },
    ];

    const listCertification = [
      {
        name: 'HCI Certification',
        urlFile: 'https://www.mariekuter.com/wp-content/uploads/2014/09/hci-coursera-statement.jpg',
      },
      {
        name: 'UX Academy Certification',
        urlFile: 'https://media.nngroup.com/media/editor/2019/02/13/ux-certificate-example.png',
      },
    ];
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
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
        <Col span={18}>
          {listCertification.map((item, index) => {
            const { name = '', urlFile = '' } = item;
            return (
              <div className={styles.viewRow} style={{ marginBottom: '6px' }}>
                <div className={styles.textValue}>{`${index + 1} - ${name}`}</div>
                <div className={styles.viewRow}>
                  <a
                    href={urlFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="img-certification"
                    className={styles.nameCertification}
                  >
                    {name}
                  </a>
                  <img
                    src="/assets/images/iconFilePNG.svg"
                    alt="iconFilePNG"
                    className={styles.iconCertification}
                  />
                </div>
              </div>
            );
          })}
        </Col>
      </Row>
    );
  }
}
