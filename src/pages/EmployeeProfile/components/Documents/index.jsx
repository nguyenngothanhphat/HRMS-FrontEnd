import { Layout, Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import InfoCollapseType2 from './InfoCollapseType2';
import styles from './index.less';

const data = [
  {
    title: 'Bank Detail',
    body: [
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
    ],
  },
  {
    title: 'Example 2',
    body: [
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
    ],
  },
  {
    title: 'Example 3',
    body: [
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
    ],
  },
  {
    title: 'Example 4',
    body: [
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
      {
        kind: 'Offer Letter',
        files: [
          {
            fileName: 'Abc.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
          {
            fileName: 'Cdf.txt',
            generatedBy: 'Terralogic',
            date: '20/12/2020',
          },
        ],
      },
    ],
  },
];

class Documents extends PureComponent {
  render() {
    return (
      <Layout className={styles.Documents}>
        <Row className={styles.documentRow}>
          <Col xs={24} lg={12} className={styles.documentCol}>
            {data.map((value, index) =>
              index % 2 === 0 ? <InfoCollapseType2 data={value} /> : '',
            )}
          </Col>
          <Col xs={24} lg={12} className={styles.documentCol}>
            {data.map((value, index) =>
              index % 2 !== 0 ? <InfoCollapseType2 data={value} /> : '',
            )}
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default Documents;
