/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, notification } from 'antd';
import { connect, history } from 'umi';

import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import moment from 'moment';
import EditForm from '../EditForm';

import formOutlined from './assets/form-outlined.svg';

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
class CreateNewTemplateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

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
    this.setState({
      content,
    });
  };

  handleSubmit = () => {
    const { content } = this.state;
    const { currentTemplate: { title, settings = [] } = {}, type = '', dispatch } = this.props;
    const tenantId = getCurrentTenant();
    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        html: content,
        settings,
        type: type || 'ON_BOARDING',
        title,
        tenantId,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        notification.success({
          message: 'Create new template successfully',
        });
        setTimeout(() => {
          history.goBack();
        }, 500);
      }
    });
  };

  render() {
    const { loadingAddTemplate } = this.props;
    const date = new Date(moment());
    const companyLogo = this.getCompanyLogo();
    return (
      <div className={styles.CreateNewTemplateForm}>
        <div className={styles.CreateNewTemplateForm_header}>
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
        <div className={styles.CreateNewTemplateForm_template}>
          <div className={styles.CreateNewTemplateForm_template_header}>
            <img src={companyLogo} alt="brand-logo" />
            <p>{date.toLocaleDateString()}</p>
          </div>
          <hr />
          <div className={styles.CreateNewTemplateForm_template_content}>
            <EditForm handleHtmlContent={this.handleHtmlContent} />
          </div>
        </div>
        <div className={styles.CreateNewTemplateForm_button}>
          <Button
            type="primary"
            onClick={this.handleSubmit}
            loading={loadingAddTemplate}
            className={styles.CreateNewTemplateForm_button_primary}
          >
            {/* <img src={formOutlined} alt="form-outline" /> */}
            Save
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateNewTemplateForm;
