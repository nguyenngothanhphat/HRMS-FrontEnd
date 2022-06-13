import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from 'umi';
import s from './index.less';

@connect(({ loading, adminSetting: { originData: { emailDomain = '' } = {} } = {} }) => ({
  loadingSave: loading.effects['adminSetting/saveDomain'],
  loadingData: loading.effects['adminSetting/getDomain'],
  emailDomain,
}))
class Domain extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/getDomain',
    });
  }

  onFinish = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/saveDomain',
      payload: {
        emailDomain: values.emailDomain,
      },
    });
  };

  render() {
    const { loadingSave, emailDomain } = this.props;
    return (
      <div className={s.Domain}>
        <div className={s.domainTitleContainer}>
          <p className={s.domainTitle}>Domain</p>
        </div>
        <div className={s.domainContent}>
          <p className={s.contentInside}>
            <span>
              All of the pages in your site will be published to the domain you create here.{' '}
            </span>
            <br />
            <span>Choose a domain name like “example.yourcompany.com”</span>
          </p>
          <Form
            className={s.formSetDomain}
            wrapperCol={{ span: 8 }}
            layout="vertical"
            onFinish={this.onFinish}
            initialValues={{
              emailDomain: emailDomain !== '' ? emailDomain : '',
            }}
          >
            <Form.Item label="Domain Name" name="emailDomain">
              <Input className={s.inpDomain} placeholder="Set domain" />
            </Form.Item>
            <Form.Item>
              <Button loading={loadingSave} className={s.btnSave} type="primary" htmlType="Submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default Domain;
