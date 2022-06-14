import { Card, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import styles from './index.less';

const UploadDocument = () => {
  return (
    <Row className={styles.UploadDocument}>
      <Col span={16}>
        <Card title="Upload Document" className={styles.container}>
          <Form>
            <Row>
              <Col span={8}>Document Type</Col>
              <Col span={16}>
                <Form.Item>
                  <Select placeholder="Select type of document">
                    <Select.Option>Eletronically Sign</Select.Option>
                    <Select.Option>Scan and Upload</Select.Option>
                    <Select.Option>Hard Coppy</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>Title</Col>
              <Col span={16}>
                <Form.Item>
                  <Input placeholder="Title" />
                </Form.Item>
              </Col>

              <Col span={8}>Author</Col>
              <Col span={16}>
                <Form.Item>
                  <Input placeholder="Author" />
                </Form.Item>
              </Col>

              <Col span={8}>Date Created</Col>
              <Col span={16}>
                <Form.Item>
                  <Input placeholder="Date Created" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default UploadDocument;
