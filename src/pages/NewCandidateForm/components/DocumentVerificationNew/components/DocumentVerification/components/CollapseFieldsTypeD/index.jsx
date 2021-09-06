/* eslint-disable no-nested-ternary */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Collapse } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { PROCESS_STATUS } from '@/utils/onboarding';
import Certification from './components/Certification';
import styles from './index.less';

const { Panel } = Collapse;
// const CheckboxGroup = Checkbox.Group;

@connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))
class CollapseFieldsTypeD extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      documentName: '',
    };
  }

  handleAddDocumentName = () => {
    const { documentName } = this.state;
    const { addDocumentName = () => {} } = this.props;
    addDocumentName(documentName);
    this.setState({
      documentName: '',
    });
  };

  handleRemoveDocumentName = (index) => {
    const { removeDocumentName = () => {} } = this.props;
    removeDocumentName(index);
  };

  renderHeader = () => {
    const { disabled = false, certifications = {} } = this.props;
    const title = `Type ${certifications.type}: ${certifications.name}`;

    return (
      <div className={styles.header}>
        <Checkbox
          checked
          disabled={disabled}
          // onClick={(event) => this.onCheckAllChange(event)}
        />
        <span className={styles.titleText}>{title}</span>
      </div>
    );
  };

  handleAddCertification = () => {
    const { addCertification = () => {} } = this.props;
    addCertification();
  };

  handleChangeCertification = (type, index, value) => {
    const { changeCertification = () => {} } = this.props;
    changeCertification({ type, index, value });
  };

  handleRemoveCertification = (index) => {
    const { removeCertification = () => {} } = this.props;
    removeCertification(index);
  };

  render() {
    const { processStatus = '', disabled = false, certifications = {} } = this.props;
    return (
      <div className={styles.CollapseFieldsTypeD}>
        {(certifications?.data?.length > 0 ||
          processStatus === PROCESS_STATUS.PROVISIONAL_OFFER_DRAFT) && (
          <Collapse
            accordion
            expandIconPosition="right"
            defaultActiveKey="1"
            expandIcon={(props) => {
              return props.isActive ? (
                <MinusOutlined className={styles.alternativeExpandIcon} />
              ) : (
                <PlusOutlined className={styles.alternativeExpandIcon} />
              );
            }}
          >
            <Panel header={this.renderHeader()} key="1">
              {certifications?.data?.length > 0 && (
                <>
                  {certifications.data.map((cer, index) => (
                    <Certification
                      disabled={disabled}
                      certification={cer}
                      length={certifications.data.length}
                      handleChange={this.handleChangeCertification}
                      remove={this.handleRemoveCertification}
                      index={index}
                    />
                  ))}
                </>
              )}
              <div
                className={disabled ? `${styles.disableButton} ${styles.addBtn}` : styles.addBtn}
                onClick={disabled ? () => {} : this.handleAddCertification}
              >
                <PlusOutlined className={styles.plusIcon} />
                <span className={styles.title}>Add other Certifications</span>
              </div>
            </Panel>
          </Collapse>
        )}
      </div>
    );
  }
}

export default CollapseFieldsTypeD;
