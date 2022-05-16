import { Button, Col, Form, Card, Row, Typography, Divider } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage, history } from 'umi';
import styles from './index.less';
import NoteComponent from '../NoteComponent';
import MessageBox from '../MessageBox';
import ReferenceForm from './components/ReferenceForm';
import AddIcon from '@/assets/add-symbols.svg';

const References = (props) => {
  const { numberOfReferences = 3 } = props;
  const [card, setCard] = useState([]);

  const onFinish = () => {};

  const _renderBottomBar = () => {
    // const handleDisabled = () => {
    //   return true;
    // };

    const onCancel = () => {
      history.push('/candidate-portal/dashboard');
    };

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
                    onClick={onFinish}
                    className={`${styles.bottomBar__button__primary}`}
                    // disabled={handleDisabled()}
                    // loading={loadingUpdateCandidate}
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
        <p className={styles.description}>Please provide upto 3 professional references</p>
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
    <Row gutter={[24, 0]}>
      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
        <div className={styles.references}>
          <Form
            wrapperCol={{ span: 24 }}
            name="references"
            initialValues={{}}
            // onValuesChange={onValuesChange}
            // onFinish={onFinish}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card className={styles.card} title={<ReferencesHeader />}>
                  {card.length > 0 &&
                    card.map((item, index) => {
                      return (
                        <>
                          <ReferenceForm index={index + 1} />
                          {!(numberOfReferences - 1 === index) && (
                            <Divider className={styles.divider} />
                          )}
                        </>
                      );
                    })}
                  {card.length < numberOfReferences && (
                    <div className={card.length > 0 ? styles.addBtn__left : styles.addBtn__center}>
                      <Button
                        type="text"
                        className={styles.addBtn}
                        onClick={() => setCard([...card, 'hihi'])}
                      >
                        <img
                          src={AddIcon}
                          alt="Add icon"
                          style={{ width: '16px', marginRight: '15px' }}
                        />
                        Add References
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>

              {card.length === numberOfReferences && <Col span={24}>{_renderBottomBar()}</Col>}
            </Row>
          </Form>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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

export default connect(() => ({}))(References);
