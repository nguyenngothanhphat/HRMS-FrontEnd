import React, { PureComponent } from 'react';
import { Row, Col, Checkbox, Button, notification } from 'antd';
import { formatMessage, connect } from 'umi';
import CustomModal from '@/components/CustomModal';
import Option from './components/Option';
import CustomFieldsContent from './components/CustomFieldsContent';
import OrderSavedContent from './components/OrderSavedContent';

import styles from './index.less';

@connect(({ loading, employeeSetting: { optionalQuestions = [] } = [] }) => ({
  loadingSaveQuestions: loading.effects['employeeSetting/saveOptionalQuestions'],
  optionalQuestions,
}))
class OptionalOnboardingQuestions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      currentModal: <CustomFieldsContent onNextModal={this.onNextModal} />,
      // optionData: [
      //   {
      //     title: 'Equal employee opportunity (EEO Information)',
      //     name: 'equalEmployeeOpportunity',
      //     link: 'abc',
      //     checked: true,
      //     description: 'Learn more about EEO',
      //   },
      //   {
      //     title: 'Preferred payment method',
      //     name: 'preferredPaymentMethod',
      //     link: '',
      //     checked: true,
      //     description: 'Check or direct deposit',
      //   },
      //   {
      //     title: 'T-shirt size',
      //     name: 'size',
      //     link: '',
      //     checked: true,
      //     description: 'XX small - xx large both for men and women',
      //   },
      //   {
      //     title: 'Dietary restrictions',
      //     name: 'dietaryRestrictions',
      //     link: '',
      //     checked: true,
      //     description: 'Vegetarian, Non vegitraian ',
      //   },
      // ],
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchOptionalQuestions',
      payload: {},
    });
  };

  _renderOptionList = () => {
    const { optionalQuestions = [] } = this.props;
    return optionalQuestions?.map((option) => {
      return <Option option={option} />;
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
      currentModal: <CustomFieldsContent onNextModal={this.onNextModal} />,
    });
  };

  openModal = () => {
    this.setState({
      openModal: true,
    });
  };

  onNextModal = () => {
    this.setState({
      currentModal: <OrderSavedContent closeModal={this.closeModal} />,
    });
  };

  onSaveQuestions = () => {
    const { dispatch, optionalQuestions } = this.props;
    dispatch({
      type: 'employeeSetting/saveOptionalQuestions',
      payload: {
        onboardingQuestions: optionalQuestions,
      },
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        notification.success({
          message: `Save questions successfully!`,
        });
      }
    });
  };

  render() {
    const { openModal, currentModal } = this.state;
    const { loadingSaveQuestions } = this.props;
    return (
      <div className={styles.OptionalOnboardingQuestions}>
        <CustomModal open={openModal} closeModal={this.closeModal} content={currentModal} />
        <div className={styles.OptionalOnboardingQuestions_title}>
          {formatMessage({ id: 'component.optionalOnboardingQuestions.title' })}
        </div>
        <div className={styles.OptionalOnboardingQuestions_subTitle}>
          {formatMessage({ id: 'component.optionalOnboardingQuestions.subTitle' })}
        </div>
        <Checkbox.Group className={styles.OptionalOnboardingQuestions_list}>
          {this._renderOptionList()}
        </Checkbox.Group>
        <Row align="space-between" className={styles.OptionalOnboardingQuestions_button}>
          <Col>
            <Button type="link" onClick={this.openModal}>
              {formatMessage({ id: 'component.optionalOnboardingQuestions.addCustomFields' })}
            </Button>
          </Col>
          <Col>
            <Button type="primary" loading={loadingSaveQuestions} onClick={this.onSaveQuestions}>
              Save
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default OptionalOnboardingQuestions;
