import { Layout, Row, Col } from 'antd';
import React, { PureComponent } from 'react';
import InfoCollapseType2 from './InfoCollapseType2';

class Documents extends PureComponent {
    render () {
        return (
          <Layout>
            <Row>
              <Col span={12}>
                <InfoCollapseType2 />
              </Col>
              <Col span={12}>
                <InfoCollapseType2 />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <InfoCollapseType2 />
              </Col>
              <Col span={12}>
                <InfoCollapseType2 />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <InfoCollapseType2 />
              </Col>
            </Row>
          </Layout>
        )
    }
}

export default Documents;