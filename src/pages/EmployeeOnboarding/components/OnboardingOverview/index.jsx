import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { Link } from 'umi';
import { SearchOutlined } from '@ant-design/icons';

import styles from './index.less';

const AddMemberIcon = (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xlink="http://www.w3.org/1999/xlink"
  >
    <title>69AE2599-C487-48EA-9EC0-0097AB0E237A</title>
    <g id="New-Updated" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="h16" transform="translate(-130.000000, -226.000000)" fill="#FFA100">
        <g id="Group-21" transform="translate(78.687500, 191.000000)">
          <g id="Group-5" transform="translate(25.312500, 24.000000)">
            <g id="add-user-user" transform="translate(24.000000, 9.000000)">
              <path
                d="M17.8849,6.95001 C17.8849,8.57007 17.095,10.01 15.8749,10.89 C19.0449,11.8201 21.9149,15.17 21.9149,18.36 C21.9149,19.01 21.3849,19.54 20.7449,19.54 L11.4348,19.54 C10.5449,20.9901 8.95483,21.95 7.13489,21.95 C4.35498,21.95 2.08496,19.6901 2.08496,16.91 C2.08496,14.1201 4.35498,11.86 7.13489,11.86 C7.40491,11.86 7.66492,11.8801 7.92493,11.9301 C8.61499,11.47 9.35498,11.11 10.115,10.89 C8.8949,10.01 8.09497,8.57007 8.09497,6.95001 C8.09497,4.25006 10.2949,2.05005 12.9949,2.05005 C15.6948,2.05005 17.8849,4.25006 17.8849,6.95001 Z M12.9949,3.25006 C10.9548,3.25006 9.29492,4.91003 9.29492,6.95001 C9.29492,8.99005 10.9548,10.64 12.9949,10.64 C15.0249,10.64 16.6848,8.99005 16.6848,6.95001 C16.6848,4.91003 15.0249,3.25006 12.9949,3.25006 Z M7.13489,20.7501 C8.23486,20.7501 9.23486,20.28 9.93481,19.54 C10.2649,19.2 10.5249,18.79 10.7048,18.35 C10.8849,17.9 10.9849,17.42 10.9849,16.91 C10.9849,15.15 9.80493,13.67 8.19482,13.21 C7.86499,13.11 7.50488,13.0601 7.13489,13.0601 C6.91492,13.0601 6.69482,13.08 6.48486,13.1201 C4.66492,13.4301 3.28491,15.0001 3.28491,16.91 C3.28491,19.03 5.01489,20.7501 7.13489,20.7501 Z M12.1848,16.91 C12.1848,17.41 12.115,17.89 11.9749,18.35 L20.7148,18.34 C20.6948,15.2401 17.2949,11.84 14.1948,11.84 L11.7849,11.84 C11.0049,11.84 10.2048,12.05 9.44482,12.4301 C11.075,13.26 12.1848,14.96 12.1848,16.91 Z M7.73486,16.306 L9.20654,16.306 C9.5376,16.306 9.80615,16.5746 9.80615,16.9056 C9.80615,17.2367 9.5376,17.5052 9.20654,17.5052 L7.73486,17.5052 L7.73486,18.9769 C7.73486,19.308 7.46631,19.5765 7.13525,19.5765 C6.8042,19.5765 6.53564,19.308 6.53564,18.9769 L6.53564,17.5052 L5.06396,17.5052 C4.73291,17.5052 4.46436,17.2367 4.46436,16.9056 C4.46436,16.5746 4.73291,16.306 5.06396,16.306 L6.53564,16.306 L6.53564,14.8344 C6.53564,14.5033 6.8042,14.2347 7.13525,14.2347 C7.46631,14.2347 7.73486,14.5033 7.73486,14.8344 L7.73486,16.306 Z"
                id="Shape"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

class OnboardingOverview extends PureComponent {
  render() {
    return (
      <div className={styles.overviewContainer}>
        {/* <p>Onboarding overview</p> */}
        <div className={styles.left}>
          <Link to="/employee-onboarding/add">
            <Button className={styles.addMember} type="primary">
              <div className={styles.icon}>
                <img src="/assets/images/addMemberIcon.svg" alt="add member icon" />
                <span>Add Team Member</span>
              </div>
            </Button>
          </Link>

          <div className={styles.divider} />

          <div className={styles.leftMenu}>
            <header>phase 1</header>
            <span className={`${styles.menuItem} ${styles.active}`}>
              Pending Eligibility Checks (14)
            </span>
          </div>

          {/* <Link
            to="/employee-onboarding/review/16003134"
            style={{ marginTop: '1rem', display: 'block' }}
          >
            Link review member by rookieId =16003134
          </Link> */}
        </div>

        <div className={styles.right} />
      </div>
    );
  }
}

export default OnboardingOverview;
