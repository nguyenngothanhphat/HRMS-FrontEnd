import { DatePicker, Form, Input, Select } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
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

  return (
    <Form
      form={form}
      layout="vertical"
      name="advancedSearch"
      onFinish={onFinish}
      initialValues={documentAdvance}
    >
      <div className={styles.ResultContent}>
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
              <DatePicker placeholder="Enter created on" format={DATE_FORMAT_MDY} />
            </Form.Item>
          </div>
          <div className={styles.filterItem}>
            <Form.Item name="documentOwner" label="Document Owner">
              <Input placeholder="Enter document owner" />
            </Form.Item>
            <Form.Item name="modifiedOn" label="Modified On">
              <DatePicker placeholder="Enter modified on" format={DATE_FORMAT_MDY} />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className={styles.filterFooter}>
        <CustomSecondaryButton onClick={() => form.resetFields()}>Reset</CustomSecondaryButton>
        <CustomPrimaryButton htmlType="submit">Search</CustomPrimaryButton>
      </div>
    </Form>
  );
};
export default connect(({ searchAdvance: { documentAdvance = {} } }) => ({ documentAdvance }))(
  AdvancedSearchDocument,
);
