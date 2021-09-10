import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import { formatMessage, connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import s from './index.less';

@connect(({ loading, user: { permissions = {} } = {} } = {}) => ({
  permissions,
  loading: loading.effects['newCandidateForm/fetchCandidateInfo'],
}))
class Empty extends Component {
  handleAddTeamMember = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newCandidateForm/fetchCandidateInfo',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });
  };

  render() {
    const { loading, permissions = {} } = this.props;
    const checkPermissionAddTeamMember = permissions.addTeamMemberOnboarding !== -1;
    return (
      <div className={s.rootEmpty}>
        <img src="/assets/images/expand-your-team.png" alt="iconCheck" className={s.imgEmpty} />
        <div className={s.textEmpty}>No members have been onboarded yet. Expand your team!</div>
        {checkPermissionAddTeamMember && (
          <Button className={s.btnAddMember} onClick={this.handleAddTeamMember} loading={loading}>
            <>
              <img
                src="/assets/images/add-team-member.png"
                alt="add member icon"
                style={{ width: '20px', height: '20px', marginRight: '10px' }}
              />
              <span>{formatMessage({ id: 'component.onboardingOverview.addTeamMember' })}</span>
            </>
          </Button>
        )}
      </div>
    );
  }
}

export default Empty;
