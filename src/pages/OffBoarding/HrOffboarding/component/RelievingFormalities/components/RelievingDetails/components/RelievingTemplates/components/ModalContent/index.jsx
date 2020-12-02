/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Form, Input, Skeleton, Row, Col } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  componentDidMount = () => {};

  handleSaveTemplate = (values) => {
    console.log('values', values);
  };

  renderContentModal = (mode, template) => {
    const { settings } = template;
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
          {settings?.map((item) => {
            return (
              <Row gutter={[8, 12]}>
                <Col span={6}>
                  <span className={styles.template__label}>{item.description} : </span>
                </Col>
                <Col span={18}>{item.value}</Col>
              </Row>
            );
          })}
        </>
      );
    }
    if (mode === 'Edit') {
      return (
        <Form
          name="templateSetting"
          {...formItemLayout}
          labelAlign="left"
          ref={this.formRef}
          onFinish={(values) => this.handleSaveTemplate(values)}
          id="relievingTemplates"
        >
          {settings?.map((item) => {
            return (
              <Form.Item
                label={item.description}
                name={item.key}
                initialValue={item.value}
                rules={[
                  {
                    required: true,
                    message: 'Input cannot be empty!',
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            );
          })}
        </Form>
      );
    }
    return null;
  };

  render() {
    const { loadingTemplate, mode, template } = this.props;
    return (
      <div className={styles.modalContent}>
        {loadingTemplate ? (
          <Skeleton className={styles.spin} />
        ) : (
          this.renderContentModal(mode, template)
        )}
      </div>
    );
  }
}

export default ModalContent;
