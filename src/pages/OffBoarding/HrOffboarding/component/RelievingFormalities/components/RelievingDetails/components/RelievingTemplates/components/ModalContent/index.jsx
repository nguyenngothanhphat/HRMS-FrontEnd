/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Form, Input, Skeleton, Row, Col } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
@connect(({ offboarding: { relievingDetails: { _id = '' } }, offboarding }) => ({
  _id,
  offboarding,
}))
class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    const {
      template: { settings = [] },
    } = this.props;
    this.state = {
      settings,
    };
  }

  componentDidMount = () => {};

  handleSaveTemplate = () => {
    const { settings } = this.state;
    const { dispatch, _id, packageType, template, handleEditSave = () => {} } = this.props;
    dispatch({
      type: 'offboarding/saveOffBoardingPackage',
      payload: {
        settings,
        ticketId: _id,
        packageType,
        templateId: template.templateRelieving,
      },
    });
    handleEditSave();
  };

  renderContentModal = (mode) => {
    const { settings } = this.state;
    const onEditChange = (value, index) => {
      const items = [...settings];
      const setting = { ...items[index], question: value };
      items[index] = setting;
      this.setState({ settings: items });
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    };

    if (mode === 'View') {
      return (
        <>
          {settings?.map((item, index) => {
            return (
              <Row gutter={[8, 12]}>
                <Col span={6}>
                  <span className={styles.template__label}>Question {index + 1} : </span>
                </Col>
                <Col span={18}>{item.question}</Col>
              </Row>
            );
          })}
        </>
      );
    }
    if (mode === 'Edit') {
      const initValues = {};
      settings.map((item, index) => {
        initValues[index] = item.question;
        return null;
      });
      return (
        <Form
          name="templateSetting"
          {...formItemLayout}
          labelAlign="left"
          ref={this.formRef}
          onFinish={() => this.handleSaveTemplate()}
          id="relievingTemplates"
          initialValues={initValues}
        >
          {settings?.map((item, index) => {
            return (
              <Form.Item
                name={index}
                label={`Question ${index + 1}`}
                rules={[
                  {
                    required: true,
                    message: 'Input cannot be empty!',
                  },
                ]}
              >
                <TextArea
                  onChange={(e) => onEditChange(e.target.value, index)}
                  defaultValue={item.question}
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
