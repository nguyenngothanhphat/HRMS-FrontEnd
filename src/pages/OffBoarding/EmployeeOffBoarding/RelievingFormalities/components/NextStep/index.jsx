import React, { PureComponent } from 'react';
import Document from './Document';
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
                  <p className={styles.scheduleTime}>{scheduleTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isScheduled && (
          <div className={styles.submitDocuments}>
            <div className={styles.abovePart}>
              <span className={styles.title}>
                Please ensure that you fill the documents below and Submit them to the HR before
                your exit interview.
              </span>
            </div>
            <div className={styles.documentsRow}>
              <Document name="Exit interview form" onClick={this.onFileClick} percent={30} />
              <Document name="NOC form" onClick={this.onFileClick} percent={100} />
              <Document name="Offboarding checklist" onClick={this.onFileClick} percent={0} />
            </div>
            <div className={styles.submitFiles}>
              <span className={styles.submittedTime}>Submitted on 22.12.2020</span>
              <span className={styles.submitButton}>Submit to HR</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}
