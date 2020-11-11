import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import { formatMessage, connect } from 'umi';
import s from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['candidateInfo/fetchCandidateInfo'],
}))
class Empty extends Component {
  handleAddTeamMember = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'candidateInfo/fetchCandidateInfo',
    });
  };

  render() {
    const { loading } = this.props;
    return (
      <div className={s.rootEmpty}>
        <img src="/assets/images/expand-your-team.png" alt="iconCheck" className={s.imgEmpty} />
        <div className={s.textEmpty}>No members have been onboarded yet. Expand your team!</div>
        <Button className={s.btnAddMember} onClick={this.handleAddTeamMember} loading={loading}>
          <Fragment>
            <img
              src="/assets/images/add-team-member.png"
              alt="add member icon"
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            <span>{formatMessage({ id: 'component.onboardingOverview.addTeamMember' })}</span>
          </Fragment>
        </Button>
      </div>
    );
  }
}

export default Empty;
