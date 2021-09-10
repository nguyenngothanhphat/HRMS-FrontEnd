/* eslint-disable react/no-danger */
import { getCurrentCompany } from '@/utils/authority';
import { Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EditForm from '../EditForm';
import styles from './index.less';

@connect(
  ({
    loading,
    user: { companiesOfUser = [] } = {},
    employeeSetting: { currentTemplate = {} },
  }) => ({
    currentTemplate,
    companiesOfUser,
    loadingAddTemplate: loading.effects['employeeSetting/addCustomTemplate'],
  }),
)
class TemplateForm extends PureComponent {
  handleChangeInput = (e) => {
    const { dispatch } = this.props;
    const { target } = e;
    const { value } = target;

    dispatch({
      type: 'employeeSetting/saveCurrentTemplate',
      payload: {
        title: value,
      },
    });
  };

  getCompanyLogo = () => {
    const { companiesOfUser = [] } = this.props;
    const currentCompany = companiesOfUser.find((company) => company._id === getCurrentCompany());
    return currentCompany?.logoUrl;
  };

  handleHtmlContent = (content) => {
    const { handlePayload = () => {} } = this.props;
    handlePayload(content);
  };

  render() {
    const date = new Date(moment());
    const companyLogo = this.getCompanyLogo();
    return (
      <div className={styles.TemplateForm}>
        <div className={styles.TemplateForm_header}>
          <Form>
            <Form.Item
              label="Template Title"
              name="templateTitle"
              required={false}
              rules={[{ required: true, message: 'Please input template title!' }]}
            >
              <Row gutter={[24, 0]}>
                <Col span={16}>
                  <Input onChange={this.handleChangeInput} />
                </Col>
                <Col span={8}>
                  <Input disabled defaultValue="companyLogo.png" />
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.TemplateForm_template}>
          <div className={styles.TemplateForm_template_header}>
            <img src={companyLogo} alt="brand-logo" />
            <p>{date.toLocaleDateString()}</p>
          </div>
          <hr />
          <div className={styles.TemplateForm_template_content}>
            <EditForm handleHtmlContent={this.handleHtmlContent} />
          </div>
        </div>
      </div>
    );
  }
}

export default TemplateForm;
