import React, { PureComponent } from 'react';

import AwaitingApprovalsFromHR from '@/pages/EmployeeOnboarding/components/OnboardingOverview/components/AwaitingApprovalsFromHR';

import { Button } from 'antd';
import { Link } from 'umi';
import { SearchOutlined } from '@ant-design/icons';

import styles from './index.less';

// const MenuItem = (props) => {
//     const
//     return (
//         <p className={`${styles.menuItem} ${styles.active}`}>
//         Pending Eligibility Checks <span>(14)</span>
//       </p>
//     )
// }
// const PHASE_DATA = [];

const Phase = (props) => {
  const { title, menuItem = [] } = props;
  const { handleClick } = props;
  // const {id, name, key, component} = menuItem;

  return (
    <div className={styles.phase}>
      <h3>{title}</h3>
      {menuItem.map((item) => {
        const { id, name, quantity, key, component } = item;
        return (
          <p key={id} className={styles.menuItem} onClick={() => handleClick(item)}>
            {name} <span>({quantity})</span>
          </p>
        );
      })}
    </div>
  );
};

class OnboardingLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    const { listMenu: { menuItem = [] } = [] } = this.props;
    this.setState({
      //   selectedItemId: 0,
      displayComponent: menuItem[0].component,
    });
  }

  handleClick = (item) => {
    // const { id, component } = item;
    // console.log(id, component);
    // this.setState({
    //   selectedId: id,
    //   displayComponent: component,
    // });
    console.log('HANDLE CLICK');
  };

  render() {
    const { listMenu } = this.props;
    const { displayComponent } = this.state;

    console.log(displayComponent);

    return (
      <div className={styles.overviewContainer}>
        <div className={styles.viewLeft}>
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
            {listMenu.map((phase) => {
              const { id, title, menuItem } = phase;
              return (
                <div key={id}>
                  <Phase title={title} menuItem={menuItem} handleClick={this.handleClick} />
                </div>
              );
            })}
          </div>

          {/* <Link
            to="/employee-onboarding/review/16003134"
            style={{ marginTop: '1rem', display: 'block' }}
          >
            Link review member by rookieId =16003134
          </Link> */}
        </div>

        <div className={styles.viewRight}>{displayComponent}</div>
      </div>
    );
  }
}

export default OnboardingLayout;
