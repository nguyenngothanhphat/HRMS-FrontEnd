import { Anchor, Button, Col, Collapse, Row, Typography } from 'antd';
import Parser from 'html-react-parser';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import HelpIcon from '@/assets/helpPage/ic_help.svg';
import MinusCircleIcon from '@/assets/helpPage/ic_minus_circle.svg';
import PlusCircleIcon from '@/assets/helpPage/ic_plus_circle.svg';
import EmptyComponent from '@/components/Empty';
import ModalFeedback from '@/components/ModalFeedback';
import { HELP_STR } from '@/constants/helpPage';
import { convertStr } from '@/utils/helpPage';
import { hashtagify, urlify } from '@/utils/homePage';
import MediaContent from './components/MediaContent';
import NoteComponent from './components/NoteComponent';
import styles from './index.less';

const { Panel } = Collapse;
const { Link } = Anchor;

const HelpList = (props) => {
  const {
    dispatch,
    user: { currentUser = {} },
    helpPage: { categoryList = [], helpData = [], helpType = '' } = {},
    loadingFetch = false,
  } = props;

  const { location: { headQuarterAddress: { country = '' } } = {} } = currentUser?.employee || {};
  const [menuList, setMenuList] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const onChangeTab = (k) => {
    history.push(`${HELP_STR.BASE_URL[helpType]}#${k}`);
  };

  useEffect(() => {
    if (helpType) {
      dispatch({
        type: 'helpPage/fetchHelpCategoryList',
        payload: {
          country: [country],
          type: helpType,
        },
      });
      dispatch({
        type: 'helpPage/fetchHelpData',
        payload: {
          country: [country],
          type: helpType,
        },
      });
    }
  }, [helpType]);

  useEffect(() => {
    if (!isEmpty(categoryList)) {
      const menuListTemp = categoryList.map((item) => ({
        key: item._id,
        href: convertStr(item.category),
        title: item.category,
      }));
      setMenuList(menuListTemp);
    }
  }, [categoryList]);

  const Note = {
    title: 'Still need our help?',
    icon: HelpIcon,
    data: (
      <>
        <Typography.Text>
          Our support team is waiting to help you 24/7. Get an emailed response from our team.
        </Typography.Text>
        <div className={styles.contactUsBtn}>
          <Button onClick={() => setFeedbackVisible(true)}>Contact Us</Button>
        </div>
      </>
    ),
  };

  const getContent = () => {
    const renderContent = (text) => {
      const temp = urlify(text);
      return hashtagify(temp);
    };

    return (
      <div className={styles.category}>
        {categoryList.map((obj) => {
          const href = convertStr(obj.category);
          return (
            <div
              key={obj.category}
              id={href}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => onChangeTab(href)}
            >
              <div className={styles.title}>
                <p>{obj.category}</p>
              </div>
              {isEmpty(obj.listFAQs) ? (
                <p>No data</p>
              ) : (
                <Row gutter={[16, 16]}>
                  {(obj.listFAQs || []).map((x) => {
                    const find = helpData.find((y) => y._id === x._id) || {};
                    return (
                      <Col span={24}>
                        <Collapse
                          expandIconPosition="right"
                          bordered={false}
                          accordion
                          destroyInactivePanel
                          expandIcon={({ isActive }) => {
                            if (isActive) return <img src={MinusCircleIcon} alt="minus" />;
                            return <img src={PlusCircleIcon} alt="plus" />;
                          }}
                          className={styles.collapse}
                        >
                          <Panel header={find.question} key={find._id}>
                            {find.answer ? Parser(renderContent(find.answer)) : ''}
                            <div
                              style={{
                                marginTop: 16,
                              }}
                            >
                              {find?.attachment && <MediaContent attachment={find?.attachment} />}
                            </div>
                          </Panel>
                        </Collapse>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!loadingFetch && isEmpty(helpData)) {
    return <EmptyComponent description="Please update data in the setting page" />;
  }

  return (
    <div className={styles.HelpList}>
      <Row>
        <Col xs={24} md={5} lg={5}>
          <div>
            <Anchor affix offsetTop={102}>
              {menuList.map((x) => {
                return <Link href={`#${x.href}`} title={x.title} />;
              })}
            </Anchor>
          </div>
        </Col>
        <Col xs={24} md={19} lg={19}>
          <div className={styles.container}>
            <Row gutter={24}>
              <Col span={16}>{getContent()}</Col>
              <Col span={8}>
                <NoteComponent note={Note} />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <ModalFeedback
        visible={feedbackVisible}
        handleCancelModal={() => setFeedbackVisible(false)}
        openFeedback={() => setFeedbackVisible(true)}
      />
    </div>
  );
};

export default connect(({ helpPage, user, loading }) => ({
  user,
  helpPage,
  loadingFetch:
    loading.effects['helpPage/fetchHelpCategoryList'] || loading.effects['helpPage/fetchHelpData'],
}))(HelpList);
