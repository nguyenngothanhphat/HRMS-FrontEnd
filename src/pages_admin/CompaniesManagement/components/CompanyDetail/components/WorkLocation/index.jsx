import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import View from './components/View';
import AddWorkLocationForm from './components/AddWorkLocation';
import styles from './index.less';

@connect(
  ({
    signup: { headQuarterAddress = {}, locations, company: { name = '' } = {} } = {},
    country: { listCountry = [] } = {},
  }) => ({
    name,
    headQuarterAddress,
    locations,
    listCountry,
  }),
)
class WorkLocation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.locations.length,
    };
  }

  componentDidMount() {
    const { locations } = this.props;
    if (locations.length > 0) {
      this.setState({
        currentIndex: locations[locations.length - 1].index + 1,
      });
    }
  }

  addWorkLocation = () => {
    const { dispatch, locations } = this.props;
    const { currentIndex } = this.state;
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: {
          locations: [
            ...locations,
            {
              name: 'companyName',
              address: '',
              country: '',
              state: '',
              zipCode: '',
              isheadQuarter: false,
              index: currentIndex,
            },
          ],
        },
      });
    }
    this.setState({
      currentIndex: currentIndex + 1,
    });
  };

  handleCancelAdd = (index) => {
    const { locations, dispatch } = this.props;
    let newLocations = locations;
    newLocations = newLocations.filter((location) => location.index !== index);
    if (dispatch) {
      dispatch({
        type: 'signup/save',
        payload: {
          locations: newLocations,
        },
      });
    }
  };

  render() {
    const locationsList = [
      {
        name: 'Japan Office',
        address: '2-45 Minamisendanishimachi, Naka, Hiroshima, Hiroshima',
        country: 'Japan',
        state: 'Tokyo',
        zipCode: '900000',
        isheadQuarter: true,
      },
      {
        name: 'HoChiMinh Office',
        address: '66 Le Thi Ho, Go Vap',
        country: 'Viet Nam',
        state: 'HoChiMinh',
        zipCode: '700000',
        isheadQuarter: false,
      },
    ];

    const { dispatch, locations, listCountry } = this.props;

    return (
      <>
        {locationsList.map((item, index) => {
          return (
            <div key={`${index + 1}`} className={styles.workLocation}>
              <div className={styles.viewBottom}>
                <View location={item} />
              </div>
            </div>
          );
        })}
        {locations.map((location, index) => {
          const formIndex = location.index;
          return (
            <div key={`${index + 1}`} className={styles.workLocation}>
              <AddWorkLocationForm
                key={location.index}
                dispatch={dispatch}
                formIndex={formIndex}
                locations={locations}
                locationItem={location}
                listCountry={listCountry}
                handleCancelAdd={this.handleCancelAdd}
              />
            </div>
          );
        })}
        <Button className={styles.btn_addLocation} type="link" onClick={this.addWorkLocation}>
          + Add work location
        </Button>
      </>
    );
  }
}

export default WorkLocation;
