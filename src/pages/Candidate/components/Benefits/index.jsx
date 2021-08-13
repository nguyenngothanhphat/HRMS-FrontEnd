import React, { useState, useEffect } from 'react';

import { formatMessage, connect } from 'umi';
import FileIcon from '@/assets/pdf_icon.png';
import { Row, Col, Typography, Button } from 'antd';
import CustomModal from '@/components/CustomModal/index';
import AnswerQuestion from '@/components/Question/AnswerQuestion';
import { TYPE_QUESTION, SPECIFY } from '@/components/Question/utils';
import { every } from 'lodash';
import NoteComponent from '../NoteComponent';
import FileContent from '../FileContent';
import mockFiles from './components/utils';
import { Page } from '../../../FormTeamMember/utils';
import s from './index.less';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Note = {
  title: 'Note',
  data: (
    <Typography.Text style={{ marginTop: '24px' }}>
      The candidate <span>must sign</span> the confidentiality document as part of acceptance of
      employment with Terralogic Private Limited..
    </Typography.Text>
  ),
};

const Benefits = (props) => {
  const { checkCandidateMandatory, localStep, dispatch, question } = props;
  const [fileUrl, setFileUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [allFieldFilled, setAllFieldFilled] = useState(false);
  const { filledBenefits = false } = checkCandidateMandatory;

  useEffect(() => {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
    // dispatch({
    //   type: 'optionalQuestion/save',
    //   payload: {
    //     pageName: Page.Benefits,
    //     // candidate: data.candidate,
    //     data: {},
    //   },
    // });
    setAllFieldFilled(true);
  }, []);

  useEffect(() => {
    if (!dispatch) {
      return;
    }
    if (allFieldFilled) {
      dispatch({
        type: 'candidateProfile/save',
        payload: {
          checkCandidateMandatory: {
            ...checkCandidateMandatory,
            filledBenefits: true,
          },
        },
      });
    }
  }, [allFieldFilled]);

  const _renderFile = (url) => {
    return <FileContent url={url} />;
  };

  const { medical, dental, vision, life, disablity, fund } = mockFiles;

  const handleClick = (url) => {
    // setFileUrl(
    //   'http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff',
    // );
    setFileUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const _renderFiles = (list) => {
    return list.map((item, index) => {
      const { name, url } = item;
      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`${index} + a`} className={s.file} onClick={() => handleClick(url)}>
          <span className={s.fileName}>{name}</span>
          <img src={FileIcon} alt="file icon" />
        </div>
      );
    });
  };

  const _renderStatus = () => {
    return !filledBenefits ? (
      <div className={s.normalText}>
        <div className={s.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={s.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  const checkAllFieldsValidate = () => {
    const valid = question?.settings?.map((item) => {
      const employeeAnswers = item.employeeAnswers.filter((answer) => answer);

      if (question.isRequired) {
        if (question.answerType === TYPE_QUESTION.MULTIPLE_CHOICE.key) {
          const { specify = {}, num } = item?.multiChoice || {};
          switch (specify) {
            case SPECIFY.AT_LEAST.key:
              return employeeAnswers.length >= num
                ? null
                : `This question must have at least ${num} answer`;
            case SPECIFY.AT_MOST.key:
              return employeeAnswers.length <= num
                ? null
                : `This question must have at most ${num} answer`;
            case SPECIFY.EXACTLY.key:
              return employeeAnswers.length !== num
                ? null
                : `This question must have exactly ${num} answer`;
            default:
              break;
          }
        }
        if (item.answerType === TYPE_QUESTION.MULTI_RATING_CHOICE.key) {
          const { rows = [] } = item?.rating || {};
          return employeeAnswers.length === rows.length ? null : 'You must rating all';
        }
        return employeeAnswers.length > 0 ? null : 'You must answer this question';
      }
      return null;
    });

    dispatch({
      type: 'optionalQuestion/save',
      payload: {
        messageErrors: valid,
      },
    });
    return valid;
  };

  const onClickNext = () => {
    if (!dispatch) {
      return;
    }
    const messageErr = checkAllFieldsValidate();
    if (!every(messageErr, (message) => message === null)) return;
    if (question._id !== '' && question.settings && question.settings.length) {
      dispatch({
        type: 'optionalQuestion/updateQuestionByCandidate',
        payload: {
          id: question._id,
          settings: question.settings,
        },
      });
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep + 1,
      },
    });
  };

  const onClickPrevious = () => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: localStep - 1,
      },
    });
  };

  const renderBottomBar = () => {
    return (
      <div className={s.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={s.bottomBar__status}>{_renderStatus()}</div>
          </Col>
          <Col span={8}>
            <div className={s.bottomBar__button}>
              <Button type="secondary" onClick={onClickPrevious}>
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={onClickNext}
                className={`${s.bottomBar__button__primary} ${
                  !allFieldFilled ? s.bottomBar__button__disabled : ''
                }`}
                disabled={!allFieldFilled}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className={s.benefitContainer}>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className={s.benefits}>
            <header>
              <h2>Benefits</h2>
              <p>The list of benefits the candidate is eligible for is populated below.</p>
            </header>

            <main>
              <div className={s.global}>
                <h2>For Global employees</h2>

                {/* Medical */}
                <h3>Medical</h3>
                <p>Coverage will take effect on 20/04/2021</p>
                {_renderFiles(medical)}

                {/* Dental */}
                <h3>Dental</h3>
                <p>Coverage will take effect on 20/04/2021</p>
                {_renderFiles(dental)}

                {/* Vision */}
                <h3>Vision</h3>
                <p>Coverage will take effect on 20/04/2021</p>
                {_renderFiles(vision)}

                {/* Life */}
                <h3>Life</h3>
                <p>Coverage will take effect on 20/04/2021</p>
                {_renderFiles(life)}

                {/* Disability */}
                <h3>Short-term disability</h3>
                <p>Coverage will take effect on 20/04/2021</p>
                {_renderFiles(disablity)}
              </div>

              <div className={s.nation}>
                <h2>For India employees</h2>

                <h3>Paytm Wallet</h3>
                <p>Coverage will take effect on 20/04/2021</p>

                <h3>Employee Provident Fund</h3>
                <p>Coverage will take effect on 20/04/2021</p>
                {_renderFiles(fund)}
              </div>
            </main>
            <Row style={{ margin: '32px' }}>
              <AnswerQuestion page={Page.Benefits} />
            </Row>
          </div>

          {renderBottomBar()}
        </Col>

        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <NoteComponent note={Note} />
        </Col>
      </Row>

      <CustomModal
        width={700}
        open={modalVisible}
        closeModal={closeModal}
        content={_renderFile(fileUrl)}
      />
    </div>
  );
};

export default connect(
  ({
    optionalQuestion: { data: question },
    candidateProfile: { localStep = 5, checkCandidateMandatory = {} } = {},
  }) => ({
    question,
    checkCandidateMandatory,
    localStep,
  }),
)(Benefits);
