import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { Row, Col, Button, Menu, Skeleton } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import IconContact from '@/assets/policiesRegulations/policies-icon-contact.svg';
import PdfIcon from '@/assets/policiesRegulations/pdf-2.svg';
import ViewIcon from '@/assets/policiesRegulations/view.svg';
import DocumentModal from './components/DocumentModal';
import styles from './index.less';

@connect(({ loading, policiesRegulations: { listCategory = [] } = {} }) => ({
  loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
  listCategory,
}))
class Policies extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      viewDocument: false,
      linkFile: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/fetchListCategory',
    });
  }

  handleCancel = () => {
    this.setState({
      viewDocument: false,
      linkFile: '',
    });
  };

  handleViewDocument = (value) => {
    this.setState({
      viewDocument: true,
      linkFile: value,
    });
  };

  handleChange = (key) => {
    this.setState({ content: key });
  };

  render() {
    const { viewDocument, linkFile } = this.state;
    const { listCategory = [], loadingGetList } = this.props;
    const defaultSelect = !isEmpty(listCategory) ? listCategory[0]._id : '';
    const getContent = () => {
      const { content } = this.state;
      const category = listCategory.filter((val) => val._id === content);
      if (isEmpty(category)) {
        const attachment = !isEmpty(listCategory) ? listCategory[0].policyregulations : '';
        if (attachment !== '') {
          return attachment.map((val) => {
            return (
              <div key={val.attachment._id} className={styles.viewCenter__title}>
                <div className={styles.viewCenter__title__text}>
                  <img src={PdfIcon} alt="pdf" />
                  <span className={styles.viewCenter__title__text__category}>
                    {val.attachment.name}
                  </span>
                </div>
                <Button
                  className={styles.viewCenter__title__view}
                  icon={<img src={ViewIcon} alt="view" />}
                  onClick={() => this.handleViewDocument(val.attachment.url)}
                >
                  <span className={styles.viewCenter__title__view__text}>View</span>
                </Button>
              </div>
            );
          });
        }
      }
      return !isEmpty(category)
        ? category[0].policyregulations.map((val) => {
            return (
              <div key={val.attachment._id} className={styles.viewCenter__title}>
                <div className={styles.viewCenter__title__text}>
                  <img src={PdfIcon} alt="pdf" />
                  <span className={styles.viewCenter__title__text__category}>
                    {val.attachment.name}
                  </span>
                </div>
                <Button
                  className={styles.viewCenter__title__view}
                  icon={<img src={ViewIcon} alt="view" />}
                  onClick={() => this.handleViewDocument(val.attachment.url)}
                >
                  <span className={styles.viewCenter__title__view__text}>View</span>
                </Button>
              </div>
            );
          })
        : '';
    };

    if (loadingGetList)
      return (
        <PageContainer>
          <div className={styles.PoliciesLayout}>
            <Skeleton />
          </div>
        </PageContainer>
      );
    return (
      <div className={styles.PoliciesLayout}>
        <Row>
          <Col sm={24} md={6} xl={5} className={styles.viewLeft}>
            <div className={styles.viewLeft__menu}>
              <Menu defaultSelectedKeys={defaultSelect} onClick={(e) => this.handleChange(e.key)}>
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
            <DocumentModal
              visible={viewDocument}
              handleCancel={this.handleCancel}
              link={linkFile}
            />
          </Col>
          <Col sm={24} md={10} xl={6} className={styles.viewRight}>
            <div className={styles.viewRight__title}>
              <div className={styles.viewRight__title__container}>
                <div className={styles.viewRight__title__container__boder}>
                  <img src={IconContact} alt="Icon Contact" />
                </div>
              </div>
              <div className={styles.viewRight__title__text}>Still need our help?</div>
            </div>
            <div className={styles.viewRight__content}>
              Our support team is waiting to help you 24/7. Get an emailed response from our team.
            </div>
            <div className={styles.viewRight__btnContact}>
              <Button>Contact Us</Button>
            </div>
            <div />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Policies;
