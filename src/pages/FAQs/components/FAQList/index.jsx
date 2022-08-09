import { Button, Col, Collapse, Image as ImageTag, Menu, Row } from 'antd';
import React, { useEffect, useState } from 'react';
// import { SettingOutlined } from '@ant-design/icons';
import Parser from 'html-react-parser';
import { isEmpty } from 'lodash';
import { connect } from 'umi';
import closeViewAnswer from '@/assets/faqPage/closeViewAnswer.svg';
import viewQuestionContent from '@/assets/faqPage/viewQuestionContent.svg';
import { hashtagify, urlify } from '@/utils/homePage';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import ContactPage from '../ContactPage';
import styles from './index.less';
import MediaContent from './components/MediaContent';

const { Panel } = Collapse;

const FAQList = (props) => {
  const {
    dispatch,
    location: { headQuarterAddress: { country = '' } } = {},
    listCategoryMainPage = [],
    totalListFAQ = '',
  } = props;
  const defaultSelect = !isEmpty(listCategoryMainPage) ? listCategoryMainPage[0]._id : '';
  const [key, setKey] = useState('');
  const [changeImg, setChangeImg] = useState('');
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch({
      type: 'faqs/fetchListFAQCategoryMainPage',
      payload: {
        country: [country],
      },
    });
  }, []);

  // genExtra = () => (
  //   <img
  //     src={viewQuestionContent}
  //     onClick={(event) => {
  //       event.stopPropagation();
  //     }}
  //     alt=""
  //   />
  // );

  // onChange = () => {
  //   this.setState((prevState) => ({
  //     open: !prevState.open,
  //   }));
  // };

  const fetchListFAQs = () => {
    return dispatch({
      type: 'faqs/fetchListFAQ',
      payload: {
        country,
        page: 1,
        limit,
      },
    });
  };

  const handleChange = (value) => {
    setKey(value);
    fetchListFAQs();
  };

  const handleChangePanel = (k) => {
    setChangeImg(k);
  };

  const getContent = () => {
    const expandIconPosition = 'right';
    const getListFAQ = listCategoryMainPage.filter((val) => val._id.toString() === key.toString());
    const renderContent = (text) => {
      const temp = urlify(text);
      return hashtagify(temp);
    };
    let listFAQ = [];
    let categoryName = '';
    if (isEmpty(getListFAQ)) {
      listFAQ = !isEmpty(listCategoryMainPage) ? listCategoryMainPage[0].listFAQs : [];
      categoryName = !isEmpty(listCategoryMainPage) ? listCategoryMainPage[0].category : '';
    } else {
      listFAQ = getListFAQ[0].listFAQs;
      categoryName = getListFAQ[0].category;
    }

    useEffect(() => {
      fetchListFAQs();
    }, [limit]);

    const renderShowMoreBtn = () => {
      const showMore = listFAQ.length < totalListFAQ;
      if (!showMore) return null;
      return (
        <Col span={24}>
          <div className={styles.loadMore}>
            <Button
              onClick={() => {
                setLimit(limit + 5);
              }}
            >
              Show more
              <img src={ShowMoreIcon} alt="" />
            </Button>
          </div>
        </Col>
      );
    };

    return (
      <div className={styles.viewCenter__title}>
        <div className={styles.viewCenter__title__category}>
          <p>{categoryName}</p>
        </div>
        <div className={styles.viewCenter__title__text}>
          {listFAQ.map((obj) => {
            let isClick = '';
            if (obj._id === changeImg) {
              isClick = (
                <img
                  src={closeViewAnswer}
                  alt="close"
                  className={styles.viewCenter__title__text__img}
                />
              );
            } else {
              isClick = (
                <img
                  src={viewQuestionContent}
                  alt="open"
                  className={styles.viewCenter__title__text__img}
                />
              );
            }
            return (
              <span>
                <Collapse
                  //   defaultActiveKey={['1']}
                  // onChange={(contentQuestion = obj) => this.onChange(contentQuestion)}
                  onChange={handleChangePanel}
                  expandIconPosition={expandIconPosition}
                  bordered={false}
                  accordion
                  expandIcon={() => isClick}
                  className={styles.viewCenter__title__text__view}
                >
                  <Panel header={obj.question} key={obj._id}>
                    {obj.answer ? Parser(renderContent(obj.answer)) : ''}
                    {obj?.attachment?.length > 0 && <MediaContent attachment={obj?.attachment} />}
                  </Panel>
                </Collapse>
                <br />
              </span>
            );
          })}
          {renderShowMoreBtn()}
        </div>
      </div>
    );
  };
  return (
    <div className={styles.FAQList}>
      <Row>
        <Col sm={24} md={6} xl={5} className={styles.viewLeft}>
          <div className={styles.viewLeft__menu}>
            <Menu defaultSelectedKeys={defaultSelect} onClick={(e) => handleChange(e.key)}>
              {!isEmpty(listCategoryMainPage)
                ? listCategoryMainPage.map((val) => {
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
};

export default connect(
  ({
    faqs: { listCategoryMainPage = [], totalListFAQ = '' } = {},
    user: { currentUser: { employee: { location } = {} } = {} },
  }) => ({
    totalListFAQ,
    listCategoryMainPage,
    location,
  }),
)(FAQList);
