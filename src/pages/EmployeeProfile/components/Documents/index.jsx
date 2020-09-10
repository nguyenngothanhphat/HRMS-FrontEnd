import { Layout, Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import InfoCollapseType2 from './InfoCollapseType2';

const data = [
  {
    title: 'Offer Letter',
    files: [
      {
        fileName: 'Abc.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      },
      {
        fileName: 'Cdf.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      }
    ]
  },
  {
    title: 'Tax Documents',
    files: [
      {
        fileName: 'aaaaaaaaaa.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      }
    ]
  },
  {
    title: 'Tax Documents',
    files: [
      {
        fileName: 'aaaaaaaaaa.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      }
    ]
  }
]

const data1 = [
  {
    title: 'Offer Letter',
    files: [
      {
        fileName: 'Abc.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      },
      {
        fileName: 'Cdf.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      },
      {
        fileName: 'Cdf.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      }
    ]
  },
  {
    title: 'Tax Documents',
    files: [
      {
        fileName: 'aaaaaaaaaa.txt',
        generatedBy: 'Terralogic',
        date: '20/12/2020'
      }
    ]
  }
]

class Documents extends PureComponent {
    render () {
        return (
          <Layout>
            <Row>
              <Col xs={24} lg={12}>
                <InfoCollapseType2 data={data} />
                <InfoCollapseType2 data={data1} />
                <InfoCollapseType2 data={data} />
              </Col>
              <Col xs={24} lg={12}>
                <InfoCollapseType2 data={data1} />
                <InfoCollapseType2 data={data} />
              </Col>
            </Row>
          </Layout>
        )
    }
}

export default Documents;