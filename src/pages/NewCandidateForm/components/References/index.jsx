import React from 'react';
import { Row, Col, Form, Card, Button, Input, Divider } from 'antd';
// import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { connect } from 'umi';
import MessageBox from '../MessageBox';
import NoteComponent from '../NewNoteComponent';
import styles from './index.less';
import ReferenceForm from './components/ReferenceForm';

const References = (props) => {
  const { isFilled = false, cards = [] } = props;

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
                defaultValue={3}
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
                    // onClick={this.onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    // onClick={this.onClickNext}
                    // className={`${styles.bottomBar__button__primary} ${
                    //   !filledJobDetail ? styles.bottomBar__button__disabled : ''
                    // }`}
                    className={styles.bottomBar__button__primary}
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
                    cards.map((card, index) => (
                      <>
                        <ReferenceForm index={index + 1} />
                        {!(cards.length - 1 === index) && <Divider className={styles.divider} />}
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

export default connect(() => ({}))(References);
