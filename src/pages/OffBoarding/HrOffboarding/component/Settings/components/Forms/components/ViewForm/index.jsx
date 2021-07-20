import QuestionItemView from '@/components/Question/QuestionItemView';
import PageContainer from '@/layouts/layout/src/PageContainer';
import { Button, Col, Divider, notification, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeSetting: {
      currentFormOffBoarding: {
        settings: questionList = [],
        name: nameOfForm = '',
        description = '',
        departmentName,
      },
      currentFormOffBoarding,
    },
  }) => ({
    loading: loading.effects['employeeSetting/addFormOffBoarding'],
    questionList,
    currentFormOffBoarding,
    nameOfForm,
    description,
    departmentName,
  }),
)
class ViewForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFormNotFound: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (id) {
      // get current form
      dispatch({
        type: 'employeeSetting/getFormOffBoardingById',
        payload: {
          id,
        },
      }).then((statusCode) => {
        if (!statusCode)
          this.setState({
            isFormNotFound: true,
          });
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isFormNotFound } = this.state;
    if (prevState.isFormNotFound !== isFormNotFound && isFormNotFound === true) {
      history.push('/error404');
    }
  }

  changeQuestionList = async (payload) => {
    const { dispatch, currentFormOffBoarding } = this.props;
    return dispatch({
      type: 'employeeSetting/save',
      payload: {
        currentFormOffBoarding: {
          ...currentFormOffBoarding,
          settings: payload,
        },
      },
    });
  };

  onChangeNameOfForm = ({ target: { value = '' } }) => {
    const { dispatch, currentFormOffBoarding } = this.props;
    return dispatch({
      type: 'employeeSetting/save',
      payload: {
        currentFormOffBoarding: {
          ...currentFormOffBoarding,
          name: value,
        },
      },
    });
  };

  onSaveForm = () => {
    const {
      questionList,
      currentFormOffBoarding,
      nameOfForm,
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    if (questionList.length === 0) {
      notification.error({
        message: 'The form must have at least one question.',
      });
    } else if (nameOfForm === '') {
      notification.error({
        message: 'The form name cannot be left blank.',
      });
    } else if (id) {
      // update form
      dispatch({
        type: 'employeeSetting/updateFormOffBoarding',
        payload: { ...currentFormOffBoarding, id },
      }).then((statusCode) => {
        if (statusCode === 200) {
          notification.success({
            message: 'Update form successfully',
          });
        }
      });
    } else {
      // add new custom form
      dispatch({
        type: 'employeeSetting/addFormOffBoarding',
        payload: currentFormOffBoarding,
      }).then((statusCode) => {
        if (statusCode === 200) {
          notification.success({
            message: 'Add new custom form successfully',
          });
        }
      });
    }
  };

  render() {
    const {
      questionList,
      loading,
      nameOfForm,
      description,
      departmentName,
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.newForm}>
          <div className={styles.formItem}>
            <div className={styles.formItem__header}>
              <div className={styles.formItem__header__title}>View Form</div>
              <Button
                type="primary"
                loading={loading}
                onClick={() => history.push(`/offboarding/settings/forms/${id}/edit`)}
                className={styles.formItem__header__saveBtn}
              >
                Edit Form
              </Button>
            </div>
            <Divider />
            <Row style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <span>
                  <strong>Name of form:</strong>
                </span>
              </Col>
              <Col>
                <div> {nameOfForm} </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <span>
                  <strong>Description of form:</strong>
                </span>
              </Col>
              <Col>
                <div> {description} </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <span>
                  <strong>Department: </strong>
                </span>
              </Col>
              <Col>
                <div> {departmentName} </div>
              </Col>
            </Row>
            {questionList.map((question, keyQuestion) => (
              <QuestionItemView keyQuestion={keyQuestion} questionItem={question} control={false} />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default ViewForm;
