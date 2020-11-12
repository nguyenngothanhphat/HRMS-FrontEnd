import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import View from './components/View';
import AddWorkLocationForm from './components/AddWorkLocation';
import styles from './index.less';

@connect(
  ({
    country: { listCountry = [] } = {},
    companiesManagement: { locationsOfDetail = [], locationsList = [], idCurrentCompany = '' },
  }) => ({
    locationsOfDetail,
    listCountry,
    locationsList,
    idCurrentCompany,
  }),
)
class WorkLocation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openFormAddLocation: false,
    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/save',
      payload: {
        isOpenEditWorkLocation: false,
      },
    });
  }

  addWorkLocation = () => {
    const { openFormAddLocation } = this.state;
    this.setState({
      openFormAddLocation: !openFormAddLocation,
    });
  };

  handleCancelAdd = () => {
    const { openFormAddLocation } = this.state;

    this.setState({
      openFormAddLocation: !openFormAddLocation,
    });
  };

  render() {
    const { locationsList = [] } = this.props;
    const { openFormAddLocation } = this.state;

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
        {openFormAddLocation ? (
          <div className={styles.workLocation}>
            <AddWorkLocationForm handleCancelAdd={this.handleCancelAdd} />
          </div>
        ) : (
          <Button className={styles.btn_addLocation} type="link" onClick={this.addWorkLocation}>
            <PlusOutlined /> Add work location
          </Button>
        )}
      </>
    );
  }
}

export default WorkLocation;
