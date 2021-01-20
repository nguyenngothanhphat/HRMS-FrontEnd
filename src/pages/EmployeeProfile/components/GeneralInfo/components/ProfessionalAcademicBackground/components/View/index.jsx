import React, { Component, Fragment } from 'react';
import { Row, Col, Tag } from 'antd';
import ModalReviewImage from '@/components/ModalReviewImage';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ employeeProfile: { tempData: { generalData = {} } = {}, listTitle = [] } = {} }) => ({
  generalData,
  listTitle,
}))
class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkImage: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/fetchListSkill',
    });
    dispatch({
      type: 'employeeProfile/fetchListTitle',
    });
  }

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      linkImage: '',
    });
  };

  formatListSkill = (skills, colors) => {
    let temp = 0;
    const listFormat = skills.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item.name,
        id: item._id,
      };
    });
    return listFormat;
  };

  _renderListCertification = (list) => {
    return list.map((item, index) => {
      const { name = '', urlFile = '', _id = '' } = item;
      const nameFile = urlFile.split('/').pop();

      return (
        <div key={_id} className={styles.viewRow} style={{ marginBottom: '6px' }}>
          <div className={styles.textValue}>{`${index + 1} - ${name}`}</div>
          {urlFile && (
            <div className={styles.viewRow}>
              <p
                onClick={() => this.handleOpenModalReview(urlFile)}
                className={styles.nameCertification}
              >
                {nameFile}
              </p>
              <img
                src="/assets/images/iconFilePNG.svg"
                alt="iconFilePNG"
                className={styles.iconCertification}
              />
            </div>
          )}
        </div>
      );
    });
  };

  render() {
    const { generalData, listTitle = [] } = this.props;
    const { visible, linkImage } = this.state;
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      pastExp = 0,
      totalExp = 0,
      qualification = '',
      certification = [],
    } = generalData;
    const objPreviousJobTilte = listTitle.find((item) => item._id === preJobTitle) || {};
    const dummyData = [
      { id: 1, label: 'Previous Job Tilte', value: objPreviousJobTilte.name },
      { id: 2, label: 'Previous Company', value: preCompany },
      { id: 3, label: 'Past Experience', value: pastExp },
      { id: 4, label: 'Total Experience', value: totalExp },
      { id: 5, label: 'Qualification', value: qualification },
    ];
    const listColors = ['#E0F4F0', '#E0F4F0', '#E0F4F0', '#E0F4F0', '#E0F4F0'];
    // const listColors = ['red', 'purple', 'green', 'magenta', 'blue'];
    const formatListSkill = this.formatListSkill(skills, listColors) || [];

    return (
      <Fragment>
        <Row gutter={[0, 16]} className={styles.root}>
          {dummyData.map((item) => (
            <Fragment key={item.id}>
              <Col span={6} className={styles.textLabel}>
                {item.label}
              </Col>
              <Col span={18} className={styles.textValue}>
                {item.value}
              </Col>
            </Fragment>
          ))}
          <Col span={6} className={styles.textLabel}>
            Certifications
          </Col>
          <Col span={18}>{this._renderListCertification(certification)}</Col>
          <Col span={6} className={styles.textLabel}>
            Skills
          </Col>
          <Col span={9} className={styles.tagSkill}>
            {formatListSkill.map((item) => (
              <Tag key={item.id} color={item.color}>
                {item.name}
              </Tag>
            ))}
          </Col>
        </Row>
        <ModalReviewImage visible={visible} handleCancel={this.handleCancel} link={linkImage} />
      </Fragment>
    );
  }
}

export default View;
