import React, { PureComponent } from 'react';
// import { Affix, Row, Col, Button, Link } from 'antd';
// import { formatMessage, connect } from 'umi';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
// import ContactPage from './components/ContactPage';
// import ListQuestions from './components/ListQuestions';
import FAQList from './components/FAQList';
import styles from './index.less';

const HR_MANAGER = 'HR-MANAGER';
@connect(
  ({
    user: { currentUser = {} } = {},
    frequentlyAskedQuestions: { list = [], listDefault = {}, getListByCompany = {} } = {},
  }) => ({
    list,
    listDefault,
    currentUser,
    getListByCompany,
  }),
)
class FAQs extends PureComponent {
  componentDidMount() {
    const { dispatch, currentUser: { company: { _id: idCompany = '' } = {} } = {} } = this.props;
    if (dispatch) {
      dispatch({
        type: 'frequentlyAskedQuestions/getListByCompany',
        payload: { company: idCompany },
      });
    }
  }

  render() {
    // const { location: { query = {} } = {}, getListByCompany = {}, currentUser: { roles = [] } } = this.props;
    const {
      currentUser: { roles = [] },
    } = this.props;
    // const { faq = [] } = getListByCompany;
    const checkRoleHrAndManager = roles.includes(HR_MANAGER);
    return (
      <PageContainer>
        {/* <div className={styles.root}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <div className={styles.titlePage__text}>
                {formatMessage({ id: 'pages.frequentlyAskedQuestions.title' })}
              </div>
            </div>
          </Affix>
          <Row>
            <Col span={17}>
              <ListQuestions list={faq} idQuestion={query} />
            </Col>
            <Col span={7} className={styles.contactPage}>
              <ContactPage />
            </Col>
          </Row>
        </div> */}
        <Row className={styles.FAQs}>
          <Col span={24}>
            <div className={styles.header}>
              <div className={styles.header__left}>FAQs</div>
              <div className={styles.header__right}>
                {checkRoleHrAndManager ? (
                  <Button>
                    <Link to="/faqpage/settings">
                      <span className={styles.buttonSetting__text}>Settings</span>
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </Col>
          <Col span={24} />
          <Col span={24}>
            <div className={styles.containerPolicies}>
              <FAQList />
            </div>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default FAQs;
