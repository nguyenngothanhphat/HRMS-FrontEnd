import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import { getCurrentLocation } from '@/utils/authority';
import s from './index.less';

@connect(({ locationSelection: { listLocationsByCompany = [] } = {}, loading }) => ({
  listLocationsByCompany,
  loadingFetchLocationParent: loading.effects['locationSelection/fetchLocationListByParentCompany'],
  loadingFetchLocation: loading.effects['locationSelection/fetchLocationsByCompany'],
}))
class Greeting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: '',
    };
  }

  componentDidMount = () => {
    this.setLocation();
  };

  componentDidUpdate = (prevProps) => {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(listLocationsByCompany) !== JSON.stringify(prevProps.listLocationsByCompany)
    ) {
      this.setLocation();
    }
  };

  setLocation = () => {
    const { listLocationsByCompany = [] } = this.props;
    const currentLocation = getCurrentLocation();

    const locationName = listLocationsByCompany.find((item) => item._id === currentLocation);
    this.setState({
      currentLocation: locationName?.name || '',
    });
  };

  render() {
    const { name = '' } = this.props;
    const { currentLocation, loadingFetchLocationParent, loadingFetchLocation } = this.state;
    return (
      <div className={s.container}>
        <h1>
          {formatMessage({ id: 'pages.dashboard.greeting.hello' })} {name}!
        </h1>
        {currentLocation && !loadingFetchLocationParent && !loadingFetchLocation && (
          <p className={s.location}>Current location: {currentLocation}</p>
        )}
      </div>
    );
  }
}

export default Greeting;
