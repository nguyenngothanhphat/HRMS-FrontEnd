import React, { Component } from 'react';
import { formatMessage, connect } from 'umi';
import { Form, Input, Button, Skeleton, notification } from 'antd';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';

@connect(({ loading, offboarding: { currentTemplate = {} } }) => ({
  loadingTemplate: loading.effects['offboarding/fetchTemplateById'],
  loadingAddTemplate: loading.effects['employeeSetting/addCustomTemplate'],
  currentTemplate,
}))
class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAbleToSubmit: false,
    };
  }

  componentDidMount = () => {
    const { dispatch, templateId, isDefault } = this.props;
    let payload = null;
    if (isDefault) {
      payload = {
        id: templateId,
      };
    } else {
      payload = {
        id: templateId,
        company: getCurrentCompany(),
      };
    }

    dispatch({
      type: 'offboarding/fetchTemplateById',
      payload,
    });
  };

  handleChange = (e, template) => {
    const {
      target: { value = {} },
    } = e;
    const { dispatch, currentTemplate } = this.props;
    const newCurrentTemplateSettings = [...currentTemplate.settings];
    const { key } = template;
    const setting = {
      key: template.key,
      description: template.description,
      value,
      isEdited: false,
    };

    const index = newCurrentTemplateSettings.findIndex((item) => item.key === key);

    newCurrentTemplateSettings[index] = setting;
    dispatch({
      type: 'offboarding/saveCurrentTemplateSetting',
      payload: {
        settings: newCurrentTemplateSettings,
      },
    });
    // alert(key);
  };

  onNext = () => {
    const { dispatch, currentTemplate, closeModal, onReload } = this.props;
    const { settings, packageType, name } = currentTemplate;
    // console.log('settings', settings);
    dispatch({
      type: 'offboarding/addCustomTemplate',
      payload: {
        name,
        packageType,
        // html: htmlContent,
        settings,
        company: getCurrentCompany(),
      },
    }).then(() => {
      notification.success({ message: `Upload file successfully!` });
      closeModal();
      onReload(packageType);
    });
  };

  _renderModal = () => {
    const { currentTemplate, loadingAddTemplate } = this.props;
    const { settings, name } = currentTemplate;
    const { TextArea } = Input;
    return (
      <>
        <Form
          name="templateSetting"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onNext}
        >
          <h2>{`Questions for ${name}`}</h2>

          {settings?.map((template, index) => {
            return (
              <Form.Item
                label={`Question ${index + 1}`}
                name={template.key}
                rules={[
                  {
                    required: true,
                    message: 'Input cannot be empty!',
                  },
                ]}
              >
                <TextArea
                  onChange={(e) => this.handleChange(e, template)}
                  defaultValue={template.question}
                  rows={2}
                />
              </Form.Item>
            );
          })}
          <Form.Item>
            <Button loading={loadingAddTemplate} htmlType="submit" type="primary">
              Save
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };

  render() {
    const { loadingTemplate } = this.props;
    // console.log(urlImage);
    return (
      <div className={styles.ModalContent}>
        {loadingTemplate ? <Skeleton className={styles.spin} /> : this._renderModal()}
      </div>
    );
  }
}

export default ModalContent;
