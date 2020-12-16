import React, { Component } from 'react';
import { formatMessage, connect } from 'umi';
import { Form, Input, Button, Skeleton, notification } from 'antd';
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
    const { dispatch, templateId } = this.props;
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
    const { dispatch, currentTemplate, closeModal, onReload } = this.props;
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
      onReload(type);
    });
  };

  _renderModal = () => {
    const { currentTemplate, loadingAddTemplate } = this.props;
    const { settings, title } = currentTemplate;
    const { TextArea } = Input;
    return (
      <>
        <Form
          name="templateSetting"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <h2>{`Questions for ${title}`}</h2>

          {settings?.map((template, index) => {
            return (
              <Form.Item
                label={`Question ${index + 1}`}
                // name={template.key}
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
            <Button loading={loadingAddTemplate} onClick={this.onNext} type="primary">
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
