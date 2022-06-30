import { Checkbox, Col, Divider, Row, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import Check from '@/assets/changePasswordCheck.svg';
import TooltipIcon from '@/assets/tooltip.svg';

import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';

const DocSubmissionContent = (props) => {
  const {
    dispatch,
    comment = true,
    data: {
      documentLayout = [],
      documentTypeA = [],
      documentTypeB = [],
      documentTypeC = [],
      documentTypeD = [],
      documentTypeE = [],
    },
  } = props;

  const renderContent = (type) => {
    type?.map((e) => {
      <Row gutter={[16, 16]} className={styles.content}>
        <Col span={7}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>{e.alias}</span>
        </Col>
        {e.resubmitComment ? (
          <Col className={styles.comment} span={17}>
            <div className={styles.candidateComment}>Candidate&apos;s Comments</div>
            {e.resubmitComment}
          </Col>
        ) : (
          <Col className={styles.noComment} span={17} />
        )}
      </Row>;
    });
  };

  const selectTitle = (type) => {
    const layout = documentLayout.find((x) => x.type === type);
    return `Type ${layout.type}: ${layout.name}`;
  };

  const docType = [
    {
      title: selectTitle('A'),
      data: documentTypeA,
      hasComment: documentTypeA.some((a) => a.resubmitComment.length > 0),
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
            <>
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
            </>
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
export default connect(
  ({
    onboard: { joiningFormalities: { listJoiningFormalities = [] } } = {},
    newCandidateForm: { data = {} },
  }) => ({
    listJoiningFormalities,
    data,
  }),
)(DocSubmissionContent);
