import React, { PureComponent } from 'react';
import { Form, Checkbox } from 'antd';
import Option from './components/Option';
import styles from './index.less';

class OptionalOnboardingQuestions extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      optionData: [
        {
          title: 'Equal employee opportunity (EEO Information)',
          name: 'Equal employee opportunity (EEO Information)',
          link: 'Learn more about EEO',
          description: '',
        },
        {
          title: 'Preferred payment method',
          name: 'Preferred payment method',
          link: '',
          description: 'Check or direct deposit',
        },
        {
          title: 'T-shirt size',
          name: 'T-shirt size',
          link: '',
          description: 'XX small - xx large both for men and women',
        },
        {
          title: 'Dietary restrictions',
          name: 'Dietary restrictions',
          link: '',
          description: 'Vegetarian, Non vegitraian ',
        },
      ],
    };
  }

  handleChange = (e, name) => {
    const { target } = e;
    // const { name } = target;
    const { value } = target;

    console.log(name);
  };

  _renderOptionList = () => {
    const { optionData } = this.state;
    return optionData.map((option) => {
      return (
        <Form.Item onChange={(e) => this.handleChange(e, option.name)}>
          <Option option={option} />
        </Form.Item>
      );
    });
  };

  render() {
    return (
      <div className={styles.OptionalOnboardingQuestions}>
        <div className={styles.OptionalOnboardingQuestions_title}>
          Optional Onboarding Questions
        </div>
        <div className={styles.OptionalOnboardingQuestions_subTitle}>
          During onboarding we will collect information from your new hires
        </div>
        <div className={styles.OptionalOnboardingQuestions_list}>
          <Form>
            <Checkbox.Group>{this._renderOptionList()}</Checkbox.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default OptionalOnboardingQuestions;
