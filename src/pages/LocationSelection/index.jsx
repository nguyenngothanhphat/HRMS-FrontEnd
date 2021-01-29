import React, { PureComponent } from 'react';
import { Modal, Button, Select, Spin } from 'antd';
import { history, connect } from 'umi';
import s from './index.less';

const { Option } = Select;

@connect(
  ({
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { currentUser: { company: { _id: companyId = '', logoUrl = '' } = {} } = {} } = {},
    loading,
  }) => ({
    listLocationsByCompany,
    companyId,
    logoUrl,
    loadingFetchLocation: loading.effects['locationSelection/fetchLocationsByCompany'],
  }),
)
class LocationSelection extends PureComponent {
  componentDidMount = () => {
    const { dispatch, companyId = '' } = this.props;
    dispatch({
      type: 'locationSelection/fetchLocationsByCompany',
      payload: {
        company: companyId,
      },
    });
  };

  onFinish = () => {
    history.push('/');
  };

  render() {
    const { listLocationsByCompany = [], loadingFetchLocation } = this.props;
    // console.log('listLocationsByCompany', listLocationsByCompany);
    return (
      <div>
        <Modal className={s.LocationSelection} destroyOnClose centered visible footer={null}>
          <div className={s.container}>
            <div className={s.header}>
              <span className={s.title}>Choose location</span>
              <div className={s.logo}>{/* <img src={logoUrl} alt="logo" /> */}</div>
            </div>
            <span className={s.subtitle1}>
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit.
            </span>

            <div className={s.locationSelectBox}>
              {!loadingFetchLocation && (
                <Select
                  defaultValue={
                    listLocationsByCompany.length > 0 ? listLocationsByCompany[0]._id : ''
                  }
                >
                  {listLocationsByCompany.map((value) => {
                    const { _id = '', name = '' } = value;
                    return <Option value={_id}>{name}</Option>;
                  })}
                </Select>
              )}
              {loadingFetchLocation && (
                <div className={s.loadingSpin}>
                  <Spin size="default" />
                </div>
              )}
            </div>

            <div className={s.operationButtons}>
              <Button className={s.proceedBtn} onClick={this.onFinish}>
                Save
              </Button>
              {/* <Button onClick={() => onClose(false)}>Cancel</Button> */}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LocationSelection;
