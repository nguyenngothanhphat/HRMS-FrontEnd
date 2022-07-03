import { Checkbox, Col, Divider, Row, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import TooltipIcon from '@/assets/tooltip.svg';
import Check from '@/assets/changePasswordCheck.svg';

import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const DocSubmissionContent = (props) => {
  const {
    tempData: {
      documentLayout = [],
      documentTypeA = [],
      documentTypeB = [],
      documentTypeC = [],
      documentTypeD = [],
      documentTypeE = [],
    },
    setDocSubCheckList,
    docSubCheckList,
    setCallback,
  } = props;

  const renderContent = (type) => {
    return type?.map((e) => (
      <Row gutter={[16, 16]} className={styles.content}>
        <Col span={8} className={styles.comment__flex}>
          <Checkbox value={e._id} />
          <span className={styles.comment__text}>{e.alias}</span>
        </Col>
        {e.resubmitComment.length > 0 ? (
          <Col className={styles.comment} span={16}>
            <div className={styles.candidateComment}>Candidate&apos;s Comments</div>
            {e.resubmitComment}
          </Col>
        ) : (
          <Col className={styles.noComment} span={16} />
        )}
      </Row>
    ));
  };

  const selectTitle = (type) => {
    const layout = documentLayout.find((x) => x?.type === type);
    return `Type ${layout?.type}: ${layout?.name}`;
  };

  const docType = [
    {
      title: selectTitle('A'),
      data: documentTypeA,
    },
    {
      title: selectTitle('B'),
      data: documentTypeB,
    },
    {
      title: selectTitle('C'),
      data: documentTypeC,
    },
    {
      title: selectTitle('D'),
      data: documentTypeD,
    },
    {
      title: selectTitle('E'),
      data: documentTypeE,
    },
  ];

  const comment = docType.some((e) => e.data.some((a) => a.resubmitComment.length > 0));
  const allValues = docType.reduce((c, i) => c + i.data.length, 0);

  useEffect(() => {
    setCallback(allValues);
  }, [allValues]);

  useEffect(() => {
    comment === false && setCallback(0);
  }, [comment]);

  return (
    <>
      {comment ? (
        <>
          <div className={styles.headerContent}>
            The below documents have either not been submitted or need to be resubmitted. Please
            ensure that all the documents are submitted before converting the candidate to an
            employee. If in case there is any document not possible to submit, please remind the
            candidate submit later.
          </div>
          <div className={classNames(styles.pageBottom, styles.pageBottom__fixed)}>
            <Checkbox.Group onChange={setDocSubCheckList} value={docSubCheckList}>
              {docType?.map(
                (i) =>
                  i.data?.length > 0 && (
                    <>
                      <div className={styles.doctype}>{i.title}</div>
                      <Divider />
                      {renderContent(i.data)}
                    </>
                  ),
              )}
            </Checkbox.Group>
          </div>
        </>
      ) : (
        <>
          <div>
            <span>Documents Verification</span>
            <Tooltip
              title={
                <div className={styles.contentTooltip}>
                  Ensure that all the documents have been verified beforehand
                </div>
              }
              color="#fff"
              placement="right"
              overlayClassName={styles.tooltipOverlay}
            >
              <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
            </Tooltip>
          </div>

          <div className={styles.pageNotice}>
            <img className={styles.check} alt="check" src={Check} height="20px" />
            <div className={styles.pageNotice__text}>
              All the required documents have been submitted and verified
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default connect(({ newCandidateForm: { tempData = {} } }) => ({
  tempData,
}))(DocSubmissionContent);
