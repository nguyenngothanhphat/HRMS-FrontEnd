import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect, Link } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
// import ContactPage from './components/ContactPage';
// import ListQuestions from './components/ListQuestions';
import FAQList from './components/FAQList';
import styles from './index.less';

@connect(
  ({
    user: { currentUser = {}, permissions = {}, } = {},
    frequentlyAskedQuestions: { list = [], listDefault = {}, getListByCompany = {} } = {},
  }) => ({
    list,
    listDefault,
    currentUser,
    getListByCompany,
    permissions,
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
    const {
      permissions
    } = this.props;
    const checkRoleHrAndManager = permissions.viewFAQSetting !== -1;
    return (
      <PageContainer>
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
