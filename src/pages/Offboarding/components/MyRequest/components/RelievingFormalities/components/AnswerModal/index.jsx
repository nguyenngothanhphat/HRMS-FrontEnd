import React, { PureComponent } from 'react';
import { Modal, Button, Form, Row, Col, Checkbox, Input } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
@connect(
  ({
    offboarding: {
      relievingDetails: { _id = '', isSent, exitPackage: { waitList = [] } = {} } = {},
    } = {},
    loading,
  }) => ({
    _id,
    waitList,
    isSent,
    loadingSavePackage: loading.effects['offboarding/saveOffBoardingPackage'],
  }),
)
class AnswerModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      packageName: '',
      settings: [],
      templateRelieving: '',
    };
  }

  componentDidMount = () => {
    const { waitList = [], selectedDocument = -1 } = this.props;
    if (waitList.length > 0) {
      const item = waitList[selectedDocument];
      const { packageName = '', settings = [], templateRelieving = '' } = item;
      this.setState({
        packageName,
        settings,
        templateRelieving,
      });

      const originalAnswers = settings.map((ans) => {
        const { employeeAnswers = [] } = ans;
        return employeeAnswers;
      });
      this.formRef.current.setFieldsValue({
        questions: originalAnswers,
      });
    }
  };

  renderFormItem = (defaultAnswers, question, answerType, indexOfQuestion, isExitInterviewForm) => {
    const options = [
      {
        label: (
          <div>
            <span style={{ fontWeight: 'bold', paddingRight: '8px' }}>
              Question {indexOfQuestion + 1}:
            </span>
            {question}
          </div>
        ),
        value: question,
      },
    ];

    return (
      <>
        <Row key={`${indexOfQuestion + 1}`} align="top" gutter={['10', '10']}>
          {isExitInterviewForm ? (
            <>
              <Col span={12}>
                <span style={{ fontWeight: 'bold', paddingRight: '8px' }}>
                  Question {indexOfQuestion + 1}:
                </span>
                {question}
              </Col>
              <Col span={12}>
                {answerType === 'FIELD' && (
                  <>
                    <Form.Item name={[indexOfQuestion]} fieldKey={[indexOfQuestion]}>
                      <TextArea />
                    </Form.Item>
                  </>
                )}

                {answerType === 'BULLET' && (
                  <>
                    <Form.Item name={[indexOfQuestion]} fieldKey={[indexOfQuestion]}>
                      <Checkbox.Group options={defaultAnswers} />
                    </Form.Item>
                  </>
                )}
              </Col>
            </>
          ) : (
            <>
              <Col span={24}>
                <Form.Item name={[indexOfQuestion]}>
                  <Checkbox.Group options={options} />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </>
    );
  };

  renderForm = () => {
    const { settings } = this.state;
    const { isExitInterviewForm } = this.props;

    return (
      <>
        <Form
          name="basic"
          ref={this.formRef}
          id="myForm"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.List name="questions">
            {() => (
              <>
                {settings.map((data, index) => {
                  const { defaultAnswers = [], question = '', answerType = '' } = data;
                  return this.renderFormItem(
                    defaultAnswers,
                    question,
                    answerType,
                    index,
                    isExitInterviewForm,
                  );
                })}
              </>
            )}
          </Form.List>
        </Form>
      </>
    );
  };

  onFinish = (values) => {
    const { questions = [] } = values;
    const { settings, templateRelieving } = this.state;
    const { dispatch, _id = '', onClose = () => {} } = this.props;

    const newSettings = [...settings];
    questions.forEach((value, index) => {
      let setting = { ...settings[index] };
      if (value.length > 0) {
        if (value[0] === '') setting = { ...newSettings[index], employeeAnswers: [] };
        else if (typeof value === 'string' || value instanceof String) {
          const employeeAnswers = [];
          employeeAnswers.push(value);
          setting = { ...newSettings[index], employeeAnswers };
        } else {
          setting = { ...newSettings[index], employeeAnswers: value };
        }
      } else setting = { ...newSettings[index], employeeAnswers: [] };
      newSettings[index] = setting;
    });

    const payload = {
      packageType: 'EXIT-PACKAGE',
      ticketId: _id,
      settings: newSettings,
      templateId: templateRelieving,
    };

    dispatch({
      type: 'offboarding/saveOffBoardingPackage',
      payload,
    }).then((statusCode) => {
      if (statusCode === 200) {
        onClose('submit');
      }
    });
  };

  render() {
    const { visible, onClose = () => {}, submitText = '', loadingSavePackage } = this.props;
    const { packageName } = this.state;

    return (
      <Modal
        className={styles.AnswerModal}
        onCancel={() => onClose()}
        destroyOnClose
        width={700}
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <p className={styles.title}>{packageName}</p>
          <div className={styles.formContainer}>{this.renderForm()}</div>
          <div className={styles.footer}>
            <Button
              loading={loadingSavePackage}
              key="submit"
              type="primary"
              form="myForm"
              htmlType="submit"
            >
              {submitText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AnswerModal;
