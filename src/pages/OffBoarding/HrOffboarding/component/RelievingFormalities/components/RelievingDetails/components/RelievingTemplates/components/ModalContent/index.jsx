import React, { Component } from 'react';
import { connect } from 'umi';
import { Form, Input, Skeleton, notification, Row, Col } from 'antd';
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
    this.state = {};
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

  renderContentModal = (mode) => {
    const { currentTemplate } = this.props;
    const { settings } = currentTemplate;
    if (mode === 'View') {
      return (
        <>
          {settings?.map((template) => {
            return (
              <Row gutter={[8, 12]}>
                <Col span={6}>
                  <span className={styles.template__label}>{template.description} : </span>
                </Col>
                <Col span={18}>{template.value}</Col>
              </Row>
            );
          })}
        </>
      );
    }
    if (mode === 'Edit') {
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
    }
    return null;
  };

  render() {
    const { loadingTemplate, mode } = this.props;
    return (
      <div className={styles.modalContent}>
        {loadingTemplate ? <Skeleton className={styles.spin} /> : this.renderContentModal(mode)}
      </div>
    );
  }
}

export default ModalContent;
