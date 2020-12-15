import React, { PureComponent } from 'react';
import { Progress } from 'antd';
import FileIcon from '@/assets/fileFeedback.svg';
import styles from './index.less';

export default class NextStep extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isScheduled = true, scheduleTime = '24.09.2020 | 4:00 PM' } = this.props;
    return (
      <div className={styles.NextStep}>
        <div className={styles.abovePart}>
          <span className={styles.title}>Next steps....</span>
        </div>
        <div className={styles.stepBoxes}>
          <div className={styles.eachBox}>
            <div className={styles.indexNumber}>
              <span>1</span>
            </div>
            <div className={styles.content1}>
              <p>
                You will soon be receiving an exit interview package. Do go through the check list
                and submit it before the exit interview
              </p>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.eachBox}>
            <div className={styles.indexNumber}>
              <span>2</span>
            </div>
            <div className={styles.content2}>
              {!isScheduled && (
                <p>The HR will soon send an invitation for your final exit interview.</p>
              )}
              {isScheduled && (
                <div className={styles.scheduledBox}>
                  <p style={{ fontWeight: 'bold' }}>Your exit interview has been scheduled</p>
                  <p>{scheduleTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.submitDocuments}>
          <div className={styles.abovePart}>
            <span className={styles.title}>
              Please ensure that you fill the documents below and Submit them to the HR before your
              exit interview.
            </span>
          </div>
          <div className={styles.documentsRow}>
            <div className={styles.document}>
              <div className={styles.left}>
                <img src={FileIcon} alt="file" />
                <span className={styles.fileName}>Exit interview form</span>
              </div>
              <div className={styles.right}>
                <div>
                  <Progress type="circle" percent={30} width={30} strokeWidth={10} />
                </div>
              </div>
            </div>
            <div className={styles.document}>
              <div className={styles.left}>
                <img src={FileIcon} alt="file" />
                <span className={styles.fileName}>NOC form</span>
              </div>

              <div className={styles.right}>
                <div>
                  <Progress type="circle" percent={100} width={30} strokeWidth={10} />
                </div>
              </div>
            </div>
            <div className={styles.document}>
              <div className={styles.left}>
                <img src={FileIcon} alt="file" />
                <span className={styles.fileName}>Offboarding checklist</span>
              </div>
              <div className={styles.right}>
                <div>
                  <Progress type="circle" percent={0} width={30} strokeWidth={10} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
