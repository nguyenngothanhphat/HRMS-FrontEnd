import React, { PureComponent } from 'react';
import { Checkbox, Button } from 'antd';
import CustomModal from '@/components/CustomModal';
import Option from './components/Option';
import CustomFieldsContent from './components/CustomFieldsContent';
import OrderSavedContent from './components/OrderSavedContent';

import styles from './index.less';

class OptionalOnboardingQuestions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      currentModal: <CustomFieldsContent onNextModal={this.onNextModal} />,
      optionData: [
        {
          title: 'Equal employee opportunity (EEO Information)',
          name: 'equalEmployeeOpportunity',
          link: 'abc',
          checked: true,
          description: 'Learn more about EEO',
        },
        {
          title: 'Preferred payment method',
          name: 'preferredPaymentMethod',
          link: '',
          checked: true,
          description: 'Check or direct deposit',
        },
        {
          title: 'T-shirt size',
          name: 'size',
          link: '',
          checked: true,
          description: 'XX small - xx large both for men and women',
        },
        {
          title: 'Dietary restrictions',
          name: 'dietaryRestrictions',
          link: '',
          checked: true,
          description: 'Vegetarian, Non vegitraian ',
        },
      ],
    };
  }

  _renderOptionList = () => {
    const { optionData } = this.state;
    return optionData.map((option) => {
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

  render() {
    const { openModal, currentModal } = this.state;
    return (
      <div className={styles.OptionalOnboardingQuestions}>
        <CustomModal open={openModal} closeModal={this.closeModal} content={currentModal} />
        <div className={styles.OptionalOnboardingQuestions_title}>
          Optional Onboarding Questions
        </div>
        <div className={styles.OptionalOnboardingQuestions_subTitle}>
          During onboarding we will collect information from your new hires
        </div>

        <Checkbox.Group className={styles.OptionalOnboardingQuestions_list}>
          {this._renderOptionList()}
        </Checkbox.Group>
        <div className={styles.OptionalOnboardingQuestions_button}>
          <Button type="primary" onClick={this.openModal}>
            + Add custom fields
          </Button>
        </div>
      </div>
    );
  }
}

export default OptionalOnboardingQuestions;
