import React, { PureComponent } from 'react';
import { Form, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import FormSignature from './components/FormSignature';
import s from './index.less';

@connect(({ loading, companiesManagement: { originData: { companyDetails } = {} } = {} }) => ({
  loading: loading.effects['companiesManagement/updateCompany'],
  companyDetails,
}))
class CompanySignatory extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  onFinish = ({ listSignature = [] }) => {
    const { dispatch, companyId } = this.props;
    const payload = { id: companyId, companySignature: listSignature };
    if (companyId) {
      dispatch({
        type: 'companiesManagement/updateCompany',
        payload,
        dataTempKept: {},
        isAccountSetup: true,
      });
    } else {
      // console.log('payload add new company', payload);
    }
  };

  render() {
    const { loading, companyDetails: { companySignature = [] } = {} } = this.props;
    const defaultList = companySignature.length === 0 ? [{}] : companySignature;
    return (
      <Form
        onFinish={this.onFinish}
        autoComplete="off"
        initialValues={{ listSignature: defaultList }}
        ref={this.formRef}
      >
        <div className={s.root}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Company Signatory</p>
            <p className={s.text}>
              Company Signatories are required for the approval of any policies, onboarding of
              employees, any finance, administration or business related decisions.
            </p>
          </div>
          <div className={s.content__viewBottom}>
            <Form.List name="listSignature">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <FormSignature
                      field={field}
                      key={field.name}
                      onRemove={() => remove(field.name)}
                      formRef={this.formRef}
                    />
                  ))}
                  <div className={s.viewAddNew} onClick={() => add()}>
                    <p className={s.viewAddNew__icon}>
                      <PlusOutlined />
                    </p>
                    <p className={s.viewAddNew__text}>Add New</p>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
        <div className={s.viewBtn}>
          <Button className={s.btnSubmit} htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default CompanySignatory;
