import React, { Component } from 'react';
// import { Row, Col, Button, Modal, Form } from 'antd';
import ProjectStatictis from './components/ProjectStatictis';
import SearchProject from './components/SearchProject';
import TableProject from './components/TableProject';
import styles from './index.less';

class ProjectList extends Component {
    fetchStatus = {
        START: 'Start',
        FETCHING: 'loading',
        COMPLETED: 'completed',
      };
    
    fetchData = this.fetchStatus.START;

    filter = {
        name: undefined,
        tagDivision: [],
        title: [],
        skill: [],
        project: [],
        expYearBegin: undefined,
        expYearEnd: undefined,
    };

  constructor(props) {
    super(props);
    this.state = {
        filter: this.filter
    };
  }

  onFilterChange = (filters) =>{
    this.fetchData = this.fetchStatus.START;
    this.setState({
      filter: {...filters},
    });
  }

  render() {
    const {filter} = this.state;
    return (
      <div className={styles.projects}>
        <div className={styles.tabMenu}>
          <ProjectStatictis />
          <SearchProject onFilterChange={this.onFilterChange} filter={filter} />
        </div>
        <TableProject />
      </div>
    );
  }
}

export default ProjectList;
