import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card, Button, Input, Divider } from 'antd';
// import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { connect, history } from 'umi';
import { ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import styles from './index.less';
import ReferenceForm from './components/ReferenceForm';

const References = (props) => {
  const { data, dispatch } = props;
  const { ticketID = '', _id: candidateId = '',references=null } = data;
  const [numReferences, setNumReferences] = useState(3);
  const [isFilled, setIsFilled] = useState(false);
  const [send,setSend] = useState(false);

  
  useEffect(() => {
    dispatch({
      type: 'newCandidateForm/fetchListReferences',
      payload: {
        candidateId,
      },
    });
  }, []);
  
  useEffect(() => {
    if (references && references.length > 0) {
      setNumReferences(references.length);
      setIsFilled(true);
    }
  }, [references]);

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION}`);
  };

  const onClickNext = () => {
    // eslint-disable-next-line no-unused-expressions
    !isFilled
      ? dispatch({
          type: 'newCandidateForm/sendNoReferenceEffect',
          payload: {
            numReferences,
            candidateId,
          },
        })&&setSend(true)
      : history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.SALARY_STRUCTURE}`);
  };

  const MentionContent = () => {
    return (
      <div className={styles.content}>
        <p>Please mention the no. of references needed to be filled out by the candidate</p>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="No. of references"
              name="noOfReferences"
              rules={[{ pattern: /^[0-9]*$/, message: 'Reference is invalid!' }]}
            >
              <Input
                placeholder="No. of references"
                className={styles.formInput}
                defaultValue={numReferences}
                disabled={send}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  setNumReferences(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  };

  const renderCardTitle = (title, description) => {
    return (
      <div className={styles.cardTitle}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    );
  };

  const _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    type="secondary"
                    onClick={onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={onClickNext}
                    className={`${styles.bottomBar__button__primary} ${
                      send ? styles.bottomBar__button__disabled : ''
                    }`}
                    disabled={send}
                    // className={styles.bottomBar__button__primary}
                  >
                    {isFilled ? 'Next' : 'Send'}
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
  return (
    <div className={styles.References}>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <Form
            wrapperCol={{ span: 24 }}
            name="references"
            initialValues={{}}
            // form={form}
            // onValuesChange={onValuesChange}
            // onFinish={onFinish}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card
                  className={styles.card}
                  title={renderCardTitle(
                    'References',
                    'Candidate needs to fill in the reference details',
                  )}
                >
                  {isFilled ? (
                    references.map((card, index) => (
                      <>
                        <ReferenceForm index={index + 1} data={card} />
                        {!(references.length - 1 === index) && <Divider className={styles.divider} />}
                      </>
                    ))
                  ) : (
                    <MentionContent />
                  )}
                </Card>
              </Col>

              <Col span={24}>{_renderBottomBar()}</Col>
            </Row>
          </Form>
        </Col>
        <Col className={styles.RightComponents} xs={24} xl={8}>
          <div className={styles.rightWrapper}>
            <Row>
              <Col span={24}>
                <NoteComponent />
              </Col>
              <Col span={24}>
                <MessageBox />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ newCandidateForm: { data } }) => ({ data }))(References);
