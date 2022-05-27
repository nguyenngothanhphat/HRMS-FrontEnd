import { Button, Col, Form, Card, Row, Typography, Divider } from 'antd';
import React, { useState } from 'react';
import { connect, formatMessage, history } from 'umi';
import styles from './index.less';
import NoteComponent from '../NoteComponent';
import MessageBox from '../MessageBox';
import ReferenceForm from './components/ReferenceForm';
import AddIcon from '@/assets/add-symbols.svg';
import { getCurrentTenant } from '@/utils/authority';

const References = (props) => {
  const {dispatch, numReferences = 4 ,processStatus='',candidate} = props;
  const [card, setCard] = useState([]);

  const objToArr=(value)=>{
    const arr = []
    Object.keys(value).forEach( i => {
      const myArray = i.split("")
      const number = Number (myArray.pop(0))
      const name = i.split(number)[0]
      if(!arr[number-1]) {
        arr[number-1] = {}
      }
      arr[number-1][name] = value[i]
    })
    return arr
  }

  const onFinish = (value) => {
    const arr= objToArr(value)
    dispatch({
      type: 'candidatePortal/addReference',
      payload: {
        candidateId: candidate,
        tenantId: getCurrentTenant(),
        references:arr,
      },
    });
    history.push(`/candidate-portal/dashboard`);
  };


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
                    // onClick={onFinish}
                    key='submit'
                    htmlType='submit'
                    form='references'
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
        <p className={styles.description}>Please provide upto {numReferences} professional references</p>
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
            onFinish={(value)=>onFinish(value)}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card className={styles.card} title={<ReferencesHeader />}>
                  {card.length > 0 &&
                    card.map((item, index) => {
                      return (
                        <>
                          <ReferenceForm index={index + 1} />
                          {!(numReferences - 1 === index) && (
                            <Divider className={styles.divider} />
                          )}
                        </>
                      );
                    })}
                  {card.length < numReferences && (
                    <div className={card.length > 0 ? styles.addBtn__left : styles.addBtn__center}>
                      <Button
                        type="text"
                        className={styles.addBtn}
                        onClick={() => setCard([...card, 'add references'])}
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

              {card.length === numReferences && <Col span={24}>{_renderBottomBar()}</Col>}
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

export default connect((
  {candidatePortal: {
    data: { processStatus = '' ,numReferences} = {},
    data = {},
    candidate = '',
  } = {},}
) => ({data,candidate,processStatus,numReferences}))(References);
