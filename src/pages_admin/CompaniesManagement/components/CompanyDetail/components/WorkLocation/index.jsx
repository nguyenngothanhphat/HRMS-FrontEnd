import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import View from './components/View';
import AddWorkLocationForm from './components/AddWorkLocation';
import styles from './index.less';

@connect(({ // signup: { headQuarterAddress = {}, company: { name = '' } = {} } = {},
  country: { listCountry = [] } = {}, companiesManagement: { locationsOfDetail = [] } }) => ({
  // name,
  // headQuarterAddress,
  locationsOfDetail,
  listCountry,
}))
class WorkLocation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.locationsOfDetail.length,
    };
  }

  componentDidMount() {
    const { locationsOfDetail } = this.props;
    if (locationsOfDetail.length > 0) {
      this.setState({
        currentIndex: locationsOfDetail[locationsOfDetail.length - 1].index + 1,
      });
    }
  }

  addWorkLocation = () => {
    const { dispatch, locationsOfDetail } = this.props;
    console.log(locationsOfDetail);

    const { currentIndex } = this.state;
    if (dispatch) {
      dispatch({
        type: 'companiesManagement/save',
        payload: {
          locationsOfDetail: [
            ...locationsOfDetail,
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
    const { companiesManagement, dispatch } = this.props;
    let newLocations = companiesManagement;
    newLocations = newLocations.filter((location) => location.index !== index);
    if (dispatch) {
      dispatch({
        type: 'companiesManagement/save',
        payload: {
          companiesManagement: newLocations,
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

    const { dispatch, locationsOfDetail, listCountry } = this.props;

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
        {locationsOfDetail.map((location, index) => {
          const formIndex = location.index;
          return (
            <div key={`${index + 1}`} className={styles.workLocation}>
              <AddWorkLocationForm
                key={location.index}
                dispatch={dispatch}
                formIndex={formIndex}
                locations={locationsOfDetail}
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
