import React, { Component } from 'react';
import styles from './index.less';

class RuleFrom extends Component {
  onChange = () => {};

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.TimeoffRuleFrom}>
          <div className={styles.flex}>
            <div className={styles.from}>
              <div className={styles.type}>
                <div className={styles.header}>
                  <div className={styles.flex}>
                    <div>Type A: Paid Leaves</div>
                    <div>Add a new paid leave</div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div>Casual Leave (CL)*</div>
                    <div>Configure</div>
                  </div>
                  <div className={styles.flexText}>
                    <div> Sick Leave (SL)*</div>
                    <div>Configure</div>
                  </div>
                  <div className={styles.flexText}>
                    <div>Compensation leave (Co)</div>
                    <div>Configure</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.from}>
              <div className={styles.type}>
                <div className={styles.header}>
                  <div className={styles.flex}>
                    <div>Type A: Paid Leaves</div>
                    <div>Add a new paid leave</div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div>Leave without Pay (LWP)*</div>
                    <div>Configure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.TimeoffRuleFrom}>
          <div className={styles.flex}>
            <div className={styles.from}>
              <div className={styles.type}>
                <div className={styles.header}>
                  <div className={styles.flexText}>
                    <div>Type C: Paid Leaves</div>
                    <div>Add a new paid leave</div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div>Maternity Leave (ML)*</div>
                    <div>Configure</div>
                  </div>
                  <div className={styles.flexText}>
                    <div>Bereavement Leave (BL)</div>
                    <div>Configure</div>
                  </div>
                  <div className={styles.flexText}>
                    <div> Restricted Holiday (RH)</div>
                    <div>Configure</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.from}>
              <div className={styles.type}>
                <div className={styles.header}>
                  <div className={styles.flexText}>
                    <div>Type D: Unpaid Leaves</div>
                    <div>Add a new paid leave</div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div>Work from Client Place (WCP)*</div>
                    <div>Configure</div>
                  </div>
                  <div className={styles.flexText}>
                    <div>Work from Home (WFH)</div>
                    <div>Configure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RuleFrom;
