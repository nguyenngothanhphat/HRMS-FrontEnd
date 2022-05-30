import { Button, Card, Col, Divider, Form, Row, Typography } from 'antd';
import React, { useEffect } from 'react';
import { connect, formatMessage, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import MessageBox from '../MessageBox';
import NoteComponent from '../NoteComponent';
import ReferenceForm from './components/ReferenceForm';
import styles from './index.less';

const References = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    candidatePortal: { data: { numReferences } = {}, candidate = '' },
  } = props;

  useEffect(() => {
    if (numReferences) {
      const arr = [];
      for (let i = 0; i < numReferences; i += 1) {
        arr.push({});
      }
      form.setFieldsValue({
        references: arr,
      });
    }
  }, [numReferences]);

  const onCancel = () => {
    history.push('/candidate-portal/dashboard');
  };

  const onFinish = async (values) => {
    const { references = [] } = values;

    const res = await dispatch({
      type: 'candidatePortal/addReference',
      payload: {
        candidateId: candidate,
        tenantId: getCurrentTenant(),
        references,
      },
    });
    if (res.statusCode === 200) {
      onCancel();
    }
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
                    onClick={onCancel}
                    className={styles.bottomBar__button__secondary}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    key="submit"
                    htmlType="submit"
                    form="references"
                    className={`${styles.bottomBar__button__primary}`}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const ReferencesHeader = () => {
    return (
      <div className={styles.cardTitle}>
        <p className={styles.title}>References</p>
        <p className={styles.description}>
          Please provide upto {numReferences} professional references
        </p>
      </div>
    );
  };

  const Note = {
    title: formatMessage({ id: 'component.noteComponent.title' }),
    data: (
      <Typography.Text>
        All the fields that are marked mandatory need to be filled. Please provide upto 3 references
      </Typography.Text>
    ),
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={24} md={16} xl={16}>
        <div className={styles.references}>
          <Form
            wrapperCol={{ span: 24 }}
            name="references"
            form={form}
            onFinish={(value) => onFinish(value)}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card className={styles.card} title={<ReferencesHeader />}>
                  <Row gutter={[24, 24]}>
                    <Form.List name="references">
                      {(fields) => (
                        <>
                          {fields.map(({ key, name }, index) => (
                            <Col span={24} key={key}>
                              <div>
                                <ReferenceForm name={name} index={index} />
                                {!(numReferences - 1 === index) && (
                                  <Divider className={styles.divider} />
                                )}
                              </div>
                            </Col>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </Row>
                </Card>
              </Col>

              <Col span={24}>{_renderBottomBar()}</Col>
            </Row>
          </Form>
        </div>
      </Col>
      <Col xs={24} sm={24} md={8} xl={8}>
        <div className={styles.RightComponents}>
          <Row>
            <NoteComponent note={Note} />
            <MessageBox />
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default connect(({ candidatePortal }) => ({ candidatePortal }))(References);
