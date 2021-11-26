import React, { PureComponent } from 'react';
import { Affix, Row, Col } from 'antd';
import { formatMessage, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
// import ContactPage from './components/ContactPage';
// import ListQuestions from './components/ListQuestions';
import styles from './index.less';

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
class PoliciesRegulations extends PureComponent {
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
    const { location: { query = {} } = {}, getListByCompany = {} } = this.props;
    const { faq = [] } = getListByCompany;
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <div className={styles.titlePage__text}>
                {formatMessage({ id: 'pages.frequentlyAskedQuestions.title' })}
              </div>
            </div>
          </Affix>
          <Row>
            <Col span={17}>{/* <ListQuestions list={faq} idQuestion={query} /> */}</Col>
            <Col span={7} className={styles.contactPage}>
              {/* <ContactPage /> */}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default PoliciesRegulations;
