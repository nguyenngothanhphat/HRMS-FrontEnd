import { Modal, Button, Row, Col, Input, Radio, Space, Select } from 'antd';
import React from 'react';
import { formatMessage } from 'umi';
import { map } from 'lodash';
import { Option } from 'antd/lib/mentions';
import styles from './index.less';

const ModalAddNewPage = (props) => {
  const {
    openModal,
    onCancel,
    onSave,
    newPage: { name = '', moveTo = '', page = '' },
    listPage,
    onChangeNewPage,
  } = props;
  // const [form] = Form.useForm();
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      title="Add Page"
      maskClosable={false}
      width={600}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onCancel}>
          {formatMessage({ id: 'employee.button.cancel' })}
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={onSave}
          className={styles.btnSubmit}
        >
          Add
        </Button>,
      ]}
    >
      <Row className={styles.addPage}>
        <Col span={24} className={styles.col}>
          <div className={styles.label}>Name of the Page</div>
          <Input onChange={(e) => onChangeNewPage({ name: e.target.value })} value={name} />
        </Col>
        <Col span={24} style={{ borderTop: '1px solid #d6dce0' }} className={styles.col}>
          <div className={styles.label}>Choose Position</div>
          <Radio.Group onChange={(e) => onChangeNewPage({ moveTo: e.target.value })} value={moveTo}>
            <Space direction="horizontal">
              <Radio value="BEFORE">Before</Radio>
              <Radio value="AFTER">After</Radio>
            </Space>
          </Radio.Group>
        </Col>
        <Col span={24} style={{ borderTop: '1px solid #d6dce0' }} className={styles.col}>
          <div className={styles.label}>Select the Page</div>
          <Select
            onChange={(e) => onChangeNewPage({ page: e })}
            defaultValue={page}
            style={{ width: '100%' }}
          >
            {map(listPage, (pageName) => (
              <Option value={pageName}>{pageName}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Modal>
  );
};
export default ModalAddNewPage;
