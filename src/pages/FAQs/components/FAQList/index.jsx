import { Col, Collapse, Image as ImageTag, Menu, Row } from 'antd';
import React, { useEffect, useState } from 'react';
// import { SettingOutlined } from '@ant-design/icons';
import Parser from 'html-react-parser';
import { isEmpty } from 'lodash';
import { connect } from 'umi';
import closeViewAnswer from '@/assets/faqPage/closeViewAnswer.svg';
import viewQuestionContent from '@/assets/faqPage/viewQuestionContent.svg';
import { hashtagify, urlify } from '@/utils/homePage';
import ContactPage from '../ContactPage';
import styles from './index.less';

const { Panel } = Collapse;

const FAQList = (props) => {
  const {
    dispatch,
    location: { headQuarterAddress: { country = '' } } = {},
    listCategoryMainPage = [],
  } = props;
  const defaultSelect = !isEmpty(listCategoryMainPage) ? listCategoryMainPage[0]._id : '';
  const [key, setKey] = useState('');
  const [changeImg, setChangeImg] = useState('');
  const [isImg, setIsImg] = useState(false);

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

  const handleChange = (value) => {
    setKey(value);
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

    const renderMedia = (media) => {
      React.useCallback(() => {
        const { attachment: file, url: link } = media;
        const src = link || (file.length > 0 && file[0].url);
        const isImageLink = (imgLink) => {
          const img = new Image();
          img.src = imgLink;
          img.onload = () => setIsImg(true);
          img.onerror = () => setIsImg(false);
        };
        isImageLink(src);
        return (
          <div className={styles.media}>
            {isImg ? (
              <ImageTag.PreviewGroup>
                <ImageTag className={styles.media__image} src={src} alt="img" />
              </ImageTag.PreviewGroup>
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video className={styles.media__video} src={src} alt="video" controls />
            )}
          </div>
        );
      }, [media]);
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
                    {(obj?.attachment?.length > 0 || obj?.url) &&
                      renderMedia({ attachment: obj?.attachment, url: obj?.url })}
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
    faqs: { listCategoryMainPage = [] } = {},
    user: { currentUser: { employee: { location } = {} } = {} },
  }) => ({
    listCategoryMainPage,
    location,
  }),
)(FAQList);
