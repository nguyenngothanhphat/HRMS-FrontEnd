import React, { Component } from 'react';
import addIcon from '@/assets/addTicket.svg';
import icon from '@/assets/delete.svg';
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
                    <div className={styles.title}>Type A: Paid Leaves</div>
                    <div className={styles.buttonRequest}>
                      <img src={addIcon} alt="" style={{ margin: '5px' }} />
                      <span>Add a new paid leave</span>
                    </div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Casual Leave (CL)*</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                    </div>
                  </div>
                  <div className={styles.flexText}>
                    <div className={styles.text}> Sick Leave (SL)*</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                    </div>
                  </div>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Compensation leave (Co)</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                      <img src={icon} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.from}>
              <div className={styles.type}>
                <div className={styles.header}>
                  <div className={styles.flex}>
                    <div className={styles.title}> Type B: Unpaid Leaves</div>
                    <div className={styles.buttonRequest}>
                      <img src={addIcon} alt="" style={{ margin: '5px' }} />
                      <span>Add a new paid leave</span>
                    </div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Leave without Pay (LWP)*</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                    </div>
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
                    <div className={styles.title}>Type C: Paid Leaves</div>
                    <div className={styles.buttonRequest}>
                      <img src={addIcon} alt="" style={{ margin: '5px' }} />
                      <span>Add a new paid leave</span>
                    </div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Maternity Leave (ML)*</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                    </div>
                  </div>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Bereavement Leave (BL)</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                      <img src={icon} alt="" />
                    </div>
                  </div>
                  <div className={styles.flexText}>
                    <div className={styles.text}> Restricted Holiday (RH)</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                      <img src={icon} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.from}>
              <div className={styles.type}>
                <div className={styles.header}>
                  <div className={styles.flexText}>
                    <div className={styles.title}>Type D: Unpaid Leaves</div>
                    <div className={styles.buttonRequest}>
                      <img src={addIcon} alt="" style={{ margin: '5px' }} />
                      <span>Add a new paid leave</span>
                    </div>
                  </div>
                </div>
                <div className={styles.strang} />
                <div className={styles.body}>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Work from Client Place (WCP)*</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                    </div>
                  </div>
                  <div className={styles.flexText}>
                    <div className={styles.text}>Work from Home (WFH)</div>
                    <div className={styles.Configure}>
                      <span> Configure</span>
                      <img src={icon} alt="" />
                    </div>
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
