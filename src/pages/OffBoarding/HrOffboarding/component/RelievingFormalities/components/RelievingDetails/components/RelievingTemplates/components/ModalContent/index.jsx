import React, { Component } from 'react';
import { connect } from 'umi';
import { Form, Input, Skeleton, notification } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
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
    const { dispatch, templateId } = this.props;
    console.log('templateId', templateId);
    dispatch({
      type: 'offboarding/fetchTemplateById',
      payload: {
        id: templateId,
      },
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
    const { dispatch, currentTemplate, closeModal } = this.props;
    const { settings, type, title, htmlContent } = currentTemplate;

    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        title,
        type,
        html: htmlContent,
        settings,
      },
    }).then(() => {
      notification.success({ message: `Upload file successfully!` });
      closeModal();
    });
  };

  renderContentModal = () => {
    const { currentTemplate, loadingAddTemplate } = this.props;
    const { settings } = currentTemplate;
    return (
      <Form name="templateSetting" onFinish={this.onFinish}>
        {settings?.map((template) => {
          return (
            <Form.Item
              label={template.description}
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
                defaultValue={template.value}
                rows={2}
              />
            </Form.Item>
          );
        })}
      </Form>
    );
  };

  render() {
    const { loadingTemplate } = this.props;
    // console.log(urlImage);
    return (
      <div className={styles.ModalContent}>
        {loadingTemplate ? <Skeleton className={styles.spin} /> : this.renderContentModal()}
      </div>
    );
  }
}

export default ModalContent;
