import React, { PureComponent } from 'react';

import { Button } from 'antd';
import { Link } from 'umi';

import MenuItem from './components/MenuItem';

import styles from './index.less';

class OnboardingLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 1,
      pageTitle: '',
      displayComponent: null,
    };
  }

  componentDidMount() {
    const { listMenu = [] } = this.props;
    this.setState({
      pageTitle: listMenu[0].menuItem[0].name,
      selectedId: listMenu[0].menuItem[0].id,
      displayComponent: listMenu[0].menuItem[0].component,
    });
  }

  handleClick = (item) => {
    const { id = 1, component = null, name = '' } = item;
    this.setState({
      selectedId: id,
      displayComponent: component,
      pageTitle: name,
    });
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent = null, pageTitle = '' } = this.state;

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
              const { selectedId } = this.state;
              return (
                <div key={id}>
                  <MenuItem
                    selectedId={selectedId}
                    title={title}
                    menuItem={menuItem}
                    handleClick={this.handleClick}
                  />
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

        <div className={styles.viewRight}>
          <p className={styles.pageTitle}>{pageTitle}</p>
          {displayComponent}
        </div>
      </div>
    );
  }
}

export default OnboardingLayout;
