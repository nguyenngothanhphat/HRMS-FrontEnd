import { Card, Col, Form, Radio, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
import styles from './index.less';

const LOP = () => {
  return (
    <Card title="LOP/Sabbatical Leave Accrual Policy" className={styles.LOP}>
      <Row gutter={[24, 24]} align="middle">
        <Col sm={10}>
          <span className={styles.label}>Leave accrues during LOP / Sabbatical ?</span>
        </Col>
        <Col sm={8}>
          <div className={styles.viewTypeSelector}>
            <Form.Item name={FORM_ITEM_NAME.LOP_LEAVE_ACCRUAL_POLICY} valuePropName="value">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value>Yes</Radio.Button>
                <Radio.Button value={false}>No</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </Col>
        <Col sm={6} />
      </Row>
    </Card>
  );
};
export default connect(() => ({}))(LOP);
