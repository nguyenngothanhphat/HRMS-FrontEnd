import React, { PureComponent } from 'react';
import { Form, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormSignature from './components/FormSignature';
import s from './index.less';

const dummySignature = [
  {
    name: 'Phat Signature',
    position: 'CEO',
    upload:
      'http://api-stghrms.paxanimi.ai/api/attachments/600cec2854634a45594c4591/bigstock-Test-word-on-white-keyboard-27134336.jpg',
  },
];

class CompanySignatory extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  onFinish = (values) => {
    console.log('values', values);
  };

  render() {
    return (
      <Form
        onFinish={this.onFinish}
        autoComplete="off"
        initialValues={{ listSignature: dummySignature }}
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
          <Button className={s.btnSubmit} htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default CompanySignatory;
