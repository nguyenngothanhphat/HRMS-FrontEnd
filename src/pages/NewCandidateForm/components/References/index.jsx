import { Button, Card, Col, Divider, Form, Input, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
// import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import ReferenceForm from './components/ReferenceForm';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

const References = (props) => {
  const [form] = Form.useForm();

  const { data, dispatch } = props;
  const {
    ticketID = '',
    _id: candidateId = '',
    references = [],
    processStatus = '',
    isFilledReferences = false,
    numReferences: numReferencesProp = null,
    currentStep = 0,
    loadingSendNoReference = false,
    loadingFetchReferences = false,
  } = data;
  const [numReferences, setNumReferences] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [JSON.stringify(references)]);

  useEffect(() => {
    goToTop();
    if (isFilledReferences) {
      dispatch({
        type: 'newCandidateForm/fetchListReferences',
        payload: {
          candidateId,
        },
      });
    }
  }, []);

  const getDisabled = () => {
    if (isFilledReferences) {
      setDisabled(false);
    }

    if (numReferencesProp && numReferencesProp > 0 && references.length === 0) {
      setDisabled(true);
    }
  };

  useEffect(() => {
    setNumReferences(numReferencesProp || 3);
    form.setFieldsValue({
      noOfReferences: numReferencesProp || 3,
    });
  }, [ticketID]);

  useEffect(() => {
    getDisabled();
  }, [processStatus, numReferencesProp, JSON.stringify(references)]);

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION}`);
  };

  const onClickNext = async () => {
    const nextStep =
      processStatus === NEW_PROCESS_STATUS.REFERENCE_VERIFICATION
        ? ONBOARDING_STEPS.SALARY_STRUCTURE
        : currentStep;

    const nextStatus =
      processStatus === NEW_PROCESS_STATUS.REFERENCE_VERIFICATION
        ? NEW_PROCESS_STATUS.SALARY_NEGOTIATION
        : processStatus;

    if (!isFilledReferences) {
      dispatch({
        type: 'newCandidateForm/sendNoReferenceEffect',
        payload: {
          numReferences,
          candidateId,
        },
      });
      setDisabled(true);
    } else {
      await dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          candidate: candidateId,
          currentStep: nextStep,
          processStatus: nextStatus,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          dispatch({
            type: 'newCandidateForm/save',
            payload: {
              currentStep: nextStep,
            },
          });
          dispatch({
            type: 'newCandidateForm/saveTemp',
            payload: {
              processStatus: nextStatus,
            },
          });
          history.push(
            `/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.SALARY_STRUCTURE}`,
          );
        }
      });
    }
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
                disabled={disabled}
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

  const getButtonText = () => {
    if (!isFilledReferences) {
      if (disabled) return 'Sent';
      return 'Send';
    }
    return 'Next';
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
                    className={[
                      styles.bottomBar__button__primary,
                      disabled ? styles.bottomBar__button__disabled : '',
                    ]}
                    loading={loadingSendNoReference}
                    disabled={disabled}
                  >
                    {getButtonText()}
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
        <Col span={24} xl={16}>
          <Spin spinning={loadingFetchReferences}>
            <Form
              wrapperCol={{ span: 24 }}
              name="references"
              initialValues={{
                references,
              }}
              form={form}
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
                    {isFilledReferences ? (
                      <Row gutter={[24, 24]}>
                        <Form.List name="references">
                          {(fields) => (
                            <>
                              {fields.map(({ key, name }, index) => (
                                <Col span={24} key={key}>
                                  <div>
                                    <ReferenceForm name={name} index={index} />
                                    {numReferences > index + 1 && (
                                      <Divider className={styles.divider} />
                                    )}
                                  </div>
                                </Col>
                              ))}
                            </>
                          )}
                        </Form.List>
                      </Row>
                    ) : (
                      <MentionContent />
                    )}
                  </Card>
                </Col>

                <Col span={24}>{_renderBottomBar()}</Col>
              </Row>
            </Form>
          </Spin>
        </Col>
        <Col span={24} xl={8}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <NoteComponent />
            </Col>
            <Col span={24}>
              <MessageBox />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ newCandidateForm: { data }, loading }) => ({
  data,
  loadingFetchReferences: loading.effects['newCandidateForm/fetchListReferences'],
  loadingSendNoReference: loading.effects['newCandidateForm/sendNoReferenceEffect'],
}))(References);
