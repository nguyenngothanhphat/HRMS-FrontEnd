import React from 'react';
import { Input, Form, Button, Select, DatePicker } from 'antd';
import { connect, history } from 'umi';
import styles from '../../index.less';

const AdvancedSearchDocument = (props) => {
  const { documentAdvance, dispatch } = props;
  const [form] = Form.useForm();

  const onFinish = (obj) => {
    dispatch({
      type: 'searchAdvance/save',
      payload: {
        isSearch: true,
        isSearchAdvance: true,
        documentAdvance: { ...obj },
      },
    });
    history.push('/search-result/documents');
  };
  const dateFormat = 'DD/MM/YY';
  return (
    <Form
      form={form}
      layout="vertical"
      name="advancedSearch"
      onFinish={onFinish}
      initialValues={documentAdvance}
    >
      <div className={styles.resultContent}>
        <div className={styles.headerFilter}>
          <div className={styles.headerFilter__title}>Documents</div>
          <div className={styles.headerFilter__description}>
            Search document name, type, owner, size, created on...
          </div>
        </div>
        <div className={styles.containFilter}>
          <div className={styles.filterItem}>
            <Form.Item name="documentName" label="Document Name">
              <Input placeholder="Enter document name" />
            </Form.Item>
            <Form.Item name="documentSize" label="Document Size (KB/MB/GB)">
              <Input placeholder="Enter document size" />
            </Form.Item>
            <Form.Item name="modifiedBy" label="Modified By">
              <Input placeholder="Enter modified by" />
            </Form.Item>
          </div>

          <div className={styles.filterItem}>
            <Form.Item name="documentType" label="Document Type">
              <Select placeholder="Enter document type">
                <Select.Option value="ON_BOARDING">ON BOARDING</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="createdOn" label="Created On">
              <DatePicker placeholder="Enter created on" format={dateFormat} />
            </Form.Item>
          </div>
          <div className={styles.filterItem}>
            <Form.Item name="documentOwner" label="Document Owner">
              <Input placeholder="Enter document owner" />
            </Form.Item>
            <Form.Item name="modifiedOn" label="Modified On">
              <DatePicker placeholder="Enter modified on" format={dateFormat} />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className={styles.filterFooter}>
        <Button
          type="link"
          htmlType="button"
          className={styles.btnReset}
          onClick={() => form.resetFields()}
        >
          Reset
        </Button>
        <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
          Search
        </Button>
      </div>
    </Form>
  );
};
export default connect(({ searchAdvance: { documentAdvance = {} } }) => ({ documentAdvance }))(
  AdvancedSearchDocument,
);
