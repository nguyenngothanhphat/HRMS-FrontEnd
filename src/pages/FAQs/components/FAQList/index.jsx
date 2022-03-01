import React, { PureComponent } from 'react';
import { Row, Col, Menu, Collapse } from 'antd';
// import { SettingOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import ContactPage from '../ContactPage';
import viewQuestionContent from '@/assets/faqPage/viewQuestionContent.svg';
import closeViewAnswer from '@/assets/faqPage/closeViewAnswer.svg';
import styles from './index.less';

const { Panel } = Collapse;
class FAQList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  // handleChange = (value) => {
  //   console.log('value', value);
  // };

  genExtra = () => (
    <img
      src={viewQuestionContent}
      onClick={(event) => {
        event.stopPropagation();
      }}
      alt=""
    />
  );

  onChange = () => {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  };

  render() {
    const listCategory = [
      { name: 'General FAQs', _id: 'faq1' },
      { name: 'Employee Timeoff', _id: 'faq2' },
      { name: 'Employee Directory', _id: 'faq3' },
      { name: 'Employee Onboarding', _id: 'faq4' },
      { name: 'Employee Offboarding', _id: 'faq5' },
    ];
    const defaultSelect = !isEmpty(listCategory) ? listCategory[1]._id : '';
    const listFAQ = [
      {
        question: 'How can I request time off in #tool-name?',
        answer: 'answer',
      },
      {
        question: 'I need to change who sees/approves PTO requests',
        answer:
          'Any employee or contingent worker level requests will notify their direct managers specifically. If you need to change who receives and approves the PTO request, the direct manager will have to be updated.',
      },
      {
        question: 'How are workers notified that their time off request is approved or declined?',
        answer: 'answer question',
      },
    ];

    const getContent = () => {
      const { open } = this.state;
      const expandIconPosition = 'right';
      return (
        <div className={styles.viewCenter__title}>
          <div className={styles.viewCenter__title__category}>
            <p>Employee TimeOff</p>
          </div>
          <div className={styles.viewCenter__title__text}>
            {listFAQ.map((obj) => {
              return (
                <span>
                  <Collapse
                    //   defaultActiveKey={['1']}
                    onChange={(contentQuestion = obj) => this.onChange(contentQuestion)}
                    expandIconPosition={expandIconPosition}
                    bordered={false}
                    accordion
                    expandIcon={() =>
                      open ? (
                        <img
                          src={closeViewAnswer}
                          alt="close"
                          className={styles.viewCenter__title__text__img}
                        />
                      ) : (
                        <img
                          src={viewQuestionContent}
                          alt="open"
                          className={styles.viewCenter__title__text__img}
                        />
                      )}
                    className={styles.viewCenter__title__text__view}
                  >
                    <Panel header={obj.question} key={obj._id}>
                      <div>{obj.answer}</div>
                    </Panel>
                  </Collapse>
                  <br />
                </span>
              );
            })}
          </div>
        </div>
      );
    };
    return (
      <div className={styles.FAQList}>
        <Row>
          <Col sm={24} md={6} xl={5} className={styles.viewLeft}>
            <div className={styles.viewLeft__menu}>
              <Menu defaultSelectedKeys={[defaultSelect]} onClick={(e) => this.handleChange(e.key)}>
                {!isEmpty(listCategory)
                  ? listCategory.map((val) => {
                      const { name, _id } = val;
                      return <Menu.Item key={_id}>{name}</Menu.Item>;
                    })
                  : ''}
              </Menu>
              <div className={styles.viewLeft__menu__btnPreviewOffer} />
            </div>
          </Col>
          <Col sm={24} md={8} xl={13} className={styles.viewCenter}>
            {getContent()}
          </Col>
          <Col sm={24} md={10} xl={6} className={styles.viewRight}>
            <ContactPage />
          </Col>
        </Row>
      </div>
    );
  }
}

export default FAQList;
