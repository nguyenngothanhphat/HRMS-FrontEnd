import React, { PureComponent } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';
import editIcon from '../../../../assets/edit-customField-cm.svg';
import ModalAddDivisions from './components/ModalAddDivisions';
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
      isShown: false,
      isCountrySelected: true,
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

  // componentDidUpdate(props) {
  //   const { divisions, dispatch, reId } = this.props;
  //   if (props.divisions !== divisions) {
  //     dispatch({
  //       type: 'customerProfile/fetchDivision',
  //       payload: {
  //         id: reId,
  //       },
  //     });
  //   }
  // }

  showModal = () => {
    const { dispatch, reId } = this.props;

    this.setState({
      isShown: true,
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
      isShown: false,
    });
  };

  onSubmit = async (values) => {
    const { dispatch, info, reId } = this.props;
    const {
      // accountOwner,
      addressLine1,
      addressLine2,
      city,
      country,
      divisionId,
      divisionName,
      primaryPOCDesignation,
      primaryPOCEmail,
      primaryPOCName,
      primaryPOCPhNo,
      secondaryPOCDesignation,
      secondaryPOCEmail,
      secondaryPOCName,
      secondaryPOCPhNo,
      state,
      tags,
      zipCode,
    } = values;
    const payload = {
      customerId: info.customerId,
      addressLine1,
      addressLine2,
      city,
      country,
      divisionId,
      divisionName,
      primaryPOCName,
      primaryPOCDesignation,
      primaryPOCEmail,
      primaryPOCNumber: primaryPOCPhNo,
      secondaryPOCDesignation,
      secondaryPOCEmail,
      secondaryPOCName,
      secondaryPOCNumber: secondaryPOCPhNo,
      state,
      tagIds: tags || [],
      postalCode: zipCode,
    };
    await dispatch({
      type: 'customerProfile/addDivision',
      payload,
    }).then(() => {
      this.setState({
        isShown: false,
      });

      dispatch({
        type: 'customerProfile/fetchDivision',
        payload: {
          id: reId,
        },
      });
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

  render() {
    const { isShown, isCountrySelected } = this.state;
    const { divisions, listTags, info, reId, divisionId, country, state } = this.props;

    return (
      <div className={styles.Divisions}>
        {/* Header */}
        <div className={styles.divisionsHeader}>
          <p className={styles.contactInfoHeaderTitle}>Divisions</p>
          <p className={styles.btnEdit}>
            <img src={editIcon} alt="edit" />
            Edit
          </p>
        </div>
        {/* Body */}

        {divisions.map((item) => {
          return (
            <>
              <div className={styles.divisionsBody} style={{ marginBottom: '32px' }}>
                <DivisionItem item={item} />
              </div>
            </>
          );
        })}

        <div className={styles.divisionFooter}>
          <p className={styles.buttonAddImport} onClick={this.showModal}>
            <PlusOutlined />
            Add another Divisions
          </p>
          <ModalAddDivisions
            isShown={isShown}
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
        </div>
      </div>
    );
  }
}

export default Divisions;
