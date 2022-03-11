import React, { PureComponent } from 'react';
import { Row, Col, Menu, Collapse } from 'antd';
// import { SettingOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import ContactPage from '../ContactPage';
import viewQuestionContent from '@/assets/faqPage/viewQuestionContent.svg';
// import closeViewAnswer from '@/assets/faqPage/closeViewAnswer.svg';
import styles from './index.less';

const { Panel } = Collapse;
@connect(({ faqs: { listCategory = [] } = {} }) => ({
  listCategory,
}))
class FAQList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // open: false,
      key: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'faqs/fetchListFAQCategory',
    });
  }

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

  handleChange = (value) => {
    this.setState({ key: value });
  };

  render() {
    const { listCategory = [] } = this.props;
    const defaultSelect = !isEmpty(listCategory) ? listCategory[0]._id : '';

    const getContent = () => {
      const { key } = this.state;
      const expandIconPosition = 'right';
      const getListFAQ = listCategory.filter((val) => val._id.toString() === key.toString());
      let listFAQ = [];
      let nameCategory = '';
      if (isEmpty(getListFAQ)) {
        listFAQ = !isEmpty(listCategory) ? listCategory[0].listFAQs : [];
        nameCategory = !isEmpty(listCategory) ? listCategory[0].category : '';
      } else {
        listFAQ = getListFAQ[0].listFAQs;
        nameCategory = getListFAQ[0].category;
      }
      return (
        <div className={styles.viewCenter__title}>
          <div className={styles.viewCenter__title__category}>
            <p>{nameCategory}</p>
          </div>
          <div className={styles.viewCenter__title__text}>
            {listFAQ.map((obj) => {
              return (
                <span>
                  <Collapse
                    //   defaultActiveKey={['1']}
                    // onChange={(contentQuestion = obj) => this.onChange(contentQuestion)}
                    expandIconPosition={expandIconPosition}
                    bordered={false}
                    accordion
                    expandIcon={() => (
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
              <Menu defaultSelectedKeys={defaultSelect} onClick={(e) => this.handleChange(e.key)}>
                {!isEmpty(listCategory)
                  ? listCategory.map((val) => {
                      const { category, _id } = val;
                      return <Menu.Item key={_id}>{category}</Menu.Item>;
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
