import { Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import TypeRow from './TypeRow';
import styles from './index.less';

// const data = [
//   {
//     title: 'PR Reports',
//     type: 1, // uploaded by
//     body: [
//       {
//         kind: 'Agreement',
//         files: [
//           {
//             id: 10,
//             fileName: 'PR Reports 2020',
//             generatedBy: 'Terralogic',
//             date: 'December 10th, 2018',
//             source: '/sample_2.pdf',
//           },
//           {
//             id: 11,
//             fileName: 'PR Report 2020',
//             generatedBy: 'Terralogic',
//             date: 'December 10th, 2018',
//             source: '/sample_1.pdf',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: 'Qualifications/Certification',
//     type: 2, // uploaded by
//     body: [
//       {
//         kind: 'Certificates',
//         files: [
//           {
//             id: 12,
//             fileName: 'HCI Certification',
//             generatedBy: 'Aditya Venkatesh',
//             date: 'December 10th, 2018',
//             source: '/sample_2.pdf',
//           },
//           {
//             id: 13,
//             fileName: 'Graduation',
//             generatedBy: 'Aditya Venkatesh',
//             date: 'December 10th, 2018',
//             source: '/sample_1.pdf',
//           },
//         ],
//       },
//     ],
//   },
// ];

class InfoCollapseType2 extends PureComponent {
  render() {
    const { data = [], onFileClick } = this.props;
    return (
      <div className={styles.InfoCollapseType2}>
        <div className={styles.tableTitle}>
          <span>{data.title}</span>
        </div>
        <div className={styles.tableContent}>
          <Row className={styles.columnName}>
            <Col span={8}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.type' })}
            </Col>
            <Col span={7}>
              {data.type === 1
                ? formatMessage({
                    id: 'pages.employeeProfile.documents.infoCollapseType2.generatedBy',
                  })
                : formatMessage({
                    id: 'pages.employeeProfile.documents.infoCollapseType2.uploadedBy',
                  })}
            </Col>
            <Col span={7}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.date' })}
            </Col>
            <Col className={styles.status} span={2}>
              {formatMessage({ id: 'pages.employeeProfile.documents.infoCollapseType2.status' })}
            </Col>
          </Row>
          <div className={styles.tableOfContents}>
            <TypeRow data={data.body} onFileClick={onFileClick} />
          </div>
        </div>
      </div>
    );
  }
}

export default InfoCollapseType2;
