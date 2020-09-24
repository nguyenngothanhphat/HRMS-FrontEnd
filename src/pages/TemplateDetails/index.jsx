import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import PageContainer from '@/layouts/layout/src/PageContainer';
import CustomModal from '@/components/CustomModal';

import TemplateDetailsHeader from './components/TemplateDetailsHeader';
import TemplateDetailsForm from './components/TemplateDetailsForm';
import TemplateDetailsNote from './components/TemplateDetailsNote';
import styles from './index.less';

class TemplateDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: true,
    };
  }

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  render() {
    const { openModal } = this.state;

    return (
      <PageContainer>
        <div className={styles.TemplateDetails}>
          <TemplateDetailsHeader />
          <div className={styles.TemplateDetails_content}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} lg={17} xl={17}>
                <TemplateDetailsForm />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                <TemplateDetailsNote />
              </Col>
            </Row>
          </div>
        </div>
        <CustomModal open={openModal} closeModal={this.closeModal}>
          hi
        </CustomModal>
      </PageContainer>
    );
  }
}

export default TemplateDetails;
