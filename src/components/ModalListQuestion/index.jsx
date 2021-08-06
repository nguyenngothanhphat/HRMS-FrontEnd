import { Modal, Button, Row, Col } from 'antd';
import React from 'react';
import { formatMessage } from 'umi';
import QuestionItemView from '@/components/Question/QuestionItemView';
import AddIcon from '@/assets/add-symbols.svg';
import { MODE } from '@/components/Question/utils';
import styles from './index.less';

const ModalListQuestion = (props) => {
  const {
    openModalList,
    onCancel,
    onSave,
    openModalEdit,
    openModalRemove,
    openModalAdd,
    settings,
    action = 'Add New Page',
    mode = MODE.EDIT,
  } = props;
  // const [form] = Form.useForm();
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModalList}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      maskClosable={false}
      width={1000}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onCancel}>
          {formatMessage({ id: 'employee.button.cancel' })}
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={onSave}
          disabled={mode === MODE.VIEW || settings.length === 0}
          className={styles.btnSubmit}
        >
          {action}
        </Button>,
      ]}
    >
      <div className={styles.OptionalOnboardingQuestions}>
        <div className={styles.OptionalOnboardingQuestions__box}>
          <div className={styles.OptionalOnboardingQuestions_title}>
            {formatMessage({ id: 'component.optionalOnboardingQuestions.title' })}
          </div>
          <div className={styles.OptionalOnboardingQuestions_subTitle}>
            {formatMessage({ id: 'component.optionalOnboardingQuestions.subTitle' })}
          </div>
        </div>
        {mode === 'edit' && (
          <Row
            align="space-between"
            style={{ marginTop: '24px' }}
            className={styles.OptionalOnboardingQuestions__buttonAdd}
          >
            <Col>
              <Button
                type="link"
                style={{ display: 'flex', alignItems: 'left', paddingLeft: '0px' }}
                onClick={openModalAdd}
              >
                <img src={AddIcon} alt="Add icon" style={{ width: '18px', marginRight: '15px' }} />
                {formatMessage({ id: 'component.optionalOnboardingQuestions.addQuestion' })}
              </Button>
            </Col>
          </Row>
        )}
        {settings.map((question, keyQuestion) => {
          const questionItem = question;
          questionItem.index = keyQuestion;
          return (
            <QuestionItemView
              openModalEdit={openModalEdit}
              keyQuestion={keyQuestion}
              questionItem={questionItem}
              openModalRemove={openModalRemove}
              mode={mode}
            />
          );
        })}
      </div>
    </Modal>
  );
};
export default ModalListQuestion;
