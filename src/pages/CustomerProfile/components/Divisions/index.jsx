import React, { PureComponent } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';
import editIcon from '../../../../assets/edit-customField-cm.svg';
import ModalAddDivisions from './components/ModalAddDivisions';
import ModalEditDivision from './components/ModalEditDivision';
import DivisionItem from './components/DivisionItem';

@connect(
  ({
    loading,
    customerManagement: { country = [], state = [], listTags = [] } = {},
    customerProfile: { divisionId = '', info = {}, divisions = [] } = {},
  }) => ({
    info,
    divisions,
    country,
    state,
    listTags,
    divisionId,
    loadingDivisions: loading.effects['customerProfile/fetchDivision'],
  }),
)
class Divisions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      isCountrySelected: true,
      editModalVisible: false,
      handlingPackage: {},
    };
  }

  componentDidMount() {
    const { dispatch, reId } = this.props;

    dispatch({
      type: 'customerProfile/fetchDivision',
      payload: {
        id: reId,
      },
    });
  }

  showModal = () => {
    const { dispatch, reId } = this.props;

    this.setState({
      addModalVisible: true,
    });

    dispatch({
      type: 'customerManagement/fetchTagList',
    });
    dispatch({
      type: 'customerProfile/generateDivisionId',
      payload: {
        id: reId,
      },
    });

    dispatch({
      type: 'customerManagement/fetchCountryList',
    });
  };

  onCloseModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handelSelectCountry = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: values,
    });
    this.setState({
      isCountrySelected: false,
    });
  };

  renderDivisionCard = (division, index) => {
    return (
      <div className={styles.DivisionCard}>
        {/* Header */}
        <div className={styles.divisionsHeader}>
          <p className={styles.contactInfoHeaderTitle}>Division {index + 1}</p>
          <p
            className={styles.btnEdit}
            onClick={() => {
              this.setState({ editModalVisible: true, handlingPackage: division });
            }}
          >
            <img src={editIcon} alt="edit" />
            Edit
          </p>
        </div>

        <div className={styles.divisionsBody}>
          <DivisionItem item={division} />
        </div>
      </div>
    );
  };

  render() {
    const { addModalVisible, isCountrySelected, editModalVisible, handlingPackage } = this.state;
    const {
      divisions = [],
      listTags = [],
      info = {},
      reId = '',
      country = [],
      state = [],
    } = this.props;

    return (
      <div className={styles.Divisions}>
        {divisions.map((item, i) => {
          return this.renderDivisionCard(item, i);
        })}

        <div className={styles.divisionFooter}>
          <p className={styles.buttonAddImport} onClick={this.showModal}>
            <PlusOutlined />
            Add another Division
          </p>
          <ModalAddDivisions
            visible={addModalVisible}
            onCloseModal={this.onCloseModal}
            onSubmit={this.onSubmit}
            listTags={listTags}
            info={info}
            // divisionId={divisionId}
            isCountrySelected={isCountrySelected}
            handelSelectCountry={this.handelSelectCountry}
            country={country}
            state={state}
            reId={reId}
          />
          <ModalEditDivision
            data={handlingPackage}
            visible={editModalVisible}
            onClose={() => this.setState({ editModalVisible: false })}
            listTags={listTags}
            info={info}
            isCountrySelected={isCountrySelected}
            handelSelectCountry={this.handelSelectCountry}
            country={country}
            state={state}
            reId={reId}
          />
        </div>
      </div>
    );
  }
}

export default Divisions;
