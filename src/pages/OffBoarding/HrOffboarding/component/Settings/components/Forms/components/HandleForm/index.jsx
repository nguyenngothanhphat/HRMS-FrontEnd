import PageContainer from '@/layouts/layout/src/PageContainer';
import { Button, Divider, Input, notification, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import HandleQuestion from '../HandleQuestion';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeSetting: {
      departmentList = [],
      currentFormOffBoarding: {
        settings: questionList = [],
        name: nameOfForm = '',
        description = '',
        department = '',
      },
      currentFormOffBoarding,
    },
  }) => ({
    loading: loading.effects['employeeSetting/addFormOffBoarding'],
    departmentList,
    department,
    questionList,
    currentFormOffBoarding,
    nameOfForm,
    description,
  }),
)
class HandleForm extends PureComponent {
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

    // fetch departmentList
    dispatch({
      type: 'employeeSetting/fetchDepartmentList',
    }).then(async (data) => {
      if (id) {
        // edit form
        const response = await dispatch({
          type: 'employeeSetting/getFormOffBoardingById',
          payload: {
            id,
          },
        });
        if (!response) {
          this.setState({
            isFormNotFound: true,
          });
        }
      } else {
        await dispatch({
          type: 'employeeSetting/save',
          payload: {
            currentFormOffBoarding: {
              settings: [],
              name: '',
              description: '',
              department: data[0]._id,
            },
          },
        });
      }
    });
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

  onChangeDescriptionForm = ({ target: { value = '' } }) => {
    const { dispatch, currentFormOffBoarding } = this.props;
    return dispatch({
      type: 'employeeSetting/save',
      payload: {
        currentFormOffBoarding: {
          ...currentFormOffBoarding,
          description: value,
        },
      },
    });
  };

  onChangeDepartmentForm = (value) => {
    const { dispatch, currentFormOffBoarding } = this.props;
    return dispatch({
      type: 'employeeSetting/save',
      payload: {
        currentFormOffBoarding: {
          ...currentFormOffBoarding,
          department: value,
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
      });
    } else {
      // add new custom form
      dispatch({
        type: 'employeeSetting/addFormOffBoarding',
        payload: currentFormOffBoarding,
      });
    }
  };

  render() {
    const {
      questionList,
      loading,
      nameOfForm,
      description,
      departmentList,
      department,
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.newForm}>
          {/* <EmailReminderHeader /> */}
          <div className={styles.formItem}>
            <div className={styles.formItem__header}>
              <div className={styles.formItem__header__title}>
                {id ? 'Edit' : 'Add Custom'} Form
              </div>
              <Button
                type="primary"
                loading={loading}
                onClick={this.onSaveForm}
                className={styles.formItem__header__saveBtn}
              >
                Save Form
              </Button>
            </div>
            <Divider />
            <div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Name of form:</strong>
              </div>
              <Input
                style={{ marginBottom: '24px' }}
                value={nameOfForm}
                onChange={this.onChangeNameOfForm}
                placeholder=""
              />
            </div>
            <div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Description:</strong>
              </div>
              <Input
                style={{ marginBottom: '24px' }}
                value={description}
                onChange={this.onChangeDescriptionForm}
                placeholder=""
              />
            </div>
            <div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Department:</strong>
              </div>
              {department && (
                <Select
                  defaultValue={department}
                  style={{ marginBottom: '24px', width: '50%' }}
                  onChange={this.onChangeDepartmentForm}
                >
                  {departmentList.map((item) => (
                    <Option value={item._id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </div>
            <HandleQuestion
              changeQuestionList={this.changeQuestionList}
              questionList={questionList}
            />
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default HandleForm;
