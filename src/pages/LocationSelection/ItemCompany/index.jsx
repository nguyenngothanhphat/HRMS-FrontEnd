import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { setCurrentLocation } from '@/utils/authority';
import { history, connect } from 'umi';
import s from './index.less';

@connect(({ employee }) => ({
  employee,
}))
class ItemCompany extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countActiveEmp: 0,
    };
  }

  componentDidMount = async () => {
    const { dispatch, locationId = '' } = this.props;
    const countActiveEmp = await dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        location: [locationId],
      },
    });
    this.setState({
      countActiveEmp: countActiveEmp.length,
    });
  };

  handleGetStarted = (locationId) => {
    setCurrentLocation(locationId);
    history.push('/');
  };

  render() {
    const {
      company: { logoUrl = '', name = '' } = {},
      location = '',
      locationId = '',
    } = this.props;
    const { countActiveEmp } = this.state;
    return (
      <div className={s.root}>
        <img
          src={logoUrl || logoDefault}
          alt="logo"
          className={s.logoCompany}
          style={logoUrl ? {} : { opacity: 0.8 }}
        />
        <div className={s.viewInfo}>
          <p className={s.viewInfo__name}>{name}</p>
          <p className={s.viewInfo__location}>
            {location} ({countActiveEmp})
          </p>
        </div>
        <div className={s.viewAction}>
          <Button className={s.btnOutline} onClick={() => this.handleGetStarted(locationId)}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}
export default ItemCompany;
