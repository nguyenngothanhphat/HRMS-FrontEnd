/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Skeleton } from 'antd';
import { formatMessage, connect } from 'umi';
import CustomModal from '@/components/CustomModal/index';

import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import EditForm from '../EditForm';
import ModalContent from '../ModalContent';

import formOutlined from './assets/form-outlined.svg';

import styles from './index.less';

@connect(
  ({
    loading,
    user: { companiesOfUser = [] } = {},
    employeeSetting: { currentTemplate = {} },
  }) => ({
    currentTemplate,
    companiesOfUser,
    loadingTemplate:
      loading.effects['employeeSetting/fetchTemplateById'] ||
      loading.effects['employeeSetting/addCustomTemplate'],
  }),
)
class TemplateDetailsForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      currentModal: 1,
    };
  }

  componentDidMount = () => {
    const { dispatch, templateId } = this.props;
    const tenantId = getCurrentTenant();
    dispatch({
      type: 'employeeSetting/fetchTemplateById',
      payload: {
        id: templateId,
        tenantId,
      },
    });
  };

  onNext = () => {
    const { currentModal } = this.state;
    // const value = ;
    this.setState({
      currentModal: currentModal + 1,
      openModal: currentModal !== 3,
    });
  };

  onClickEdit = () => {
    this.setState({
      openModal: true,
      currentModal: 1,
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
    });
  };

  handleChangeInput = (e) => {
    const { dispatch } = this.props;
    const { target } = e;
    const { value } = target;

    dispatch({
      type: 'employeeSetting/saveCurrentTemplate',
      payload: {
        title: value,
      },
    });
  };

  _renderModal = () => {
    const { currentModal, openModal } = this.state;
    const { currentTemplate } = this.props;
    switch (currentModal) {
      case 1:
        return (
          <CustomModal
            open={openModal}
            closeModal={this.closeModal}
            width="70%"
            content={
              <EditForm
                currentTemplate={currentTemplate}
                onNext={this.onNext}
                onClose={this.closeModal}
              />
            }
          />
        );
      case 2:
        return (
          <CustomModal
            open={openModal}
            closeModal={this.closeModal}
            content={<ModalContent onNext={this.onNext} content={0} />}
          />
        );
      case 3:
        return (
          <CustomModal
            open={openModal}
            closeModal={this.closeModal}
            content={<ModalContent onNext={this.onNext} content={1} />}
          />
        );
      default:
        return null;
    }
  };

  _renderLoading = () => {
    const { loadingTemplate } = this.props;
    return <Skeleton loading={loadingTemplate} active />;
  };

  getCompanyLogo = () => {
    const { companiesOfUser = [] } = this.props;
    const currentCompany = companiesOfUser.find((company) => company._id === getCurrentCompany());
    return currentCompany?.logoUrl;
  };

  render() {
    const { currentTemplate, loadingTemplate } = this.props;
    const { title = '', htmlContent = '', updatedAt = '' } = currentTemplate;
    const date = new Date(updatedAt);
    const companyLogo = this.getCompanyLogo();
    return (
      <div className={styles.TemplateDetailsForm}>
        {currentTemplate !== undefined && (
          <>
            <div className={styles.TemplateDetailsForm_header}>
              <Form>
                <Form.Item
                  label={formatMessage({ id: 'component.templateDetails.inputName' })}
                  name="templateTitle"
                  required={false}
                  rules={[{ required: true, message: 'Please input template title!' }]}
                >
                  <Row gutter={[24, 0]}>
                    <Col span={16}>
                      <Input value={title} onChange={this.handleChangeInput} />
                    </Col>
                    <Col span={8}>
                      <Input disabled defaultValue="companyLogo.png" />
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </div>
            <div className={styles.TemplateDetailsForm_template}>
              <div className={styles.TemplateDetailsForm_template_header}>
                <img src={companyLogo} alt="brand-logo" />
                <p>{date.toLocaleDateString()}</p>
              </div>
              <hr />
              <div className={styles.TemplateDetailsForm_template_content}>
                {loadingTemplate ? (
                  this._renderLoading()
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
                )}
              </div>
              <div className={styles.TemplateDetailsForm_template_button}>
                {' '}
                <Button
                  type="primary"
                  onClick={this.onClickEdit}
                  className={styles.TemplateDetailsForm_template_button_primary}
                >
                  <img src={formOutlined} alt="form-outline" />
                  Edit
                </Button>
              </div>
            </div>
          </>
        )}

        {this._renderModal()}
      </div>
    );
  }
}

export default TemplateDetailsForm;
