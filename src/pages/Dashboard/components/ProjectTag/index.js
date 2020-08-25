import React, { PureComponent } from 'react';
import { Row, Statistic, Tooltip } from 'antd';
import projectIcon from '@/assets/project-icon.svg';
import tagIcon from '@/assets/tag-icon.svg';
import { formatMessage } from 'umi-plugin-react/locale';
import { Link } from 'umi';
import styles from './index.less';

class ProjectTag extends PureComponent {
  formatNumber = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  render() {
    const {
      projectData,
      tagData,
      projectData: { data: projectList = [] } = {},
      tagData: { data: tagList = [] } = {},
    } = this.props;

    const projectBlock = project => {
      const { formatNumber, getPrefix } = this.props;
      return (
        <Row
          key={Math.random()
            .toString(36)
            .substr(2, 9)}
          className={[styles.projectItem].join(' ')}
        >
          <div className={[styles.projectName].join(' ')}>{project.name}</div>
          <Tooltip
            placement="top"
            title={`${getPrefix()} ${
              project.totalAmount ? this.formatNumber(project.totalAmount.toFixed(2)) : 0
            }`}
          >
            <div className={[styles.projectPrice].join(' ')}>
              <Statistic
                value={formatNumber(project.totalAmount).value}
                prefix={getPrefix()}
                suffix={formatNumber(project.totalAmount).suffix}
                precision={formatNumber(project.totalAmount).precision}
              />
            </div>
          </Tooltip>
        </Row>
      );
    };

    const tagBlock = tag => {
      const { formatNumber, getPrefix } = this.props;
      return (
        <Row
          key={Math.random()
            .toString(36)
            .substr(2, 9)}
          className={[styles.projectItem].join(' ')}
        >
          <div className={[styles.projectName].join(' ')}>{tag.name}</div>
          <Tooltip
            placement="top"
            title={`${getPrefix()} ${
              tag.totalAmount ? this.formatNumber(tag.totalAmount.toFixed(2)) : 0
            }`}
          >
            <div className={[styles.projectPrice].join(' ')}>
              <Statistic
                value={formatNumber(tag.totalAmount).value}
                prefix={getPrefix()}
                suffix={formatNumber(tag.totalAmount).suffix}
                precision={formatNumber(tag.totalAmount).precision}
              />
            </div>
          </Tooltip>
        </Row>
      );
    };

    const projectListBlock = () => {
      let list = projectList.map(project => projectBlock(project));
      if (list.length < 1) {
        list = (
          <Row className={styles.projectEmptyBlocks}>
            <div className={styles.emptyTitle}>
              {formatMessage({ id: 'dashboard.project-tag.empty-projects' })}
            </div>
            <Link className={styles.emptyLink} to="/expense/newexpense">
              {formatMessage({ id: 'dashboard.project-tag.empty-link' })}
            </Link>
          </Row>
        );
      }
      return list;
    };

    const tagListBlock = () => {
      let list = tagList.map(tag => tagBlock(tag));
      if (list.length < 1) {
        list = (
          <Row className={styles.projectEmptyBlocks}>
            <div className={styles.emptyTitle}>
              {formatMessage({ id: 'dashboard.project-tag.empty-tags' })}
            </div>
            <Link className={styles.emptyLink} to="/expense/newexpense">
              {formatMessage({ id: 'dashboard.project-tag.empty-link' })}
            </Link>
          </Row>
        );
      }
      return list;
    };

    return (
      <Row className={[styles.projectTag].join(' ')}>
        <div className={[styles.titleBlock].join(' ')}>
          <Row className={[styles.title].join(' ')}>
            {projectData
              ? `${formatMessage({ id: 'dashboard.project-tag.projects' })} (${projectData.total})`
              : `${formatMessage({ id: 'dashboard.project-tag.tags' })} (${tagData.total})`}
          </Row>
          <a className={[styles.linkView].join(' ')} href="/report">
            {formatMessage({ id: 'dashboard.viewall' })}
          </a>
          <img
            className={[styles.icon].join(' ')}
            alt=""
            src={projectData ? projectIcon : tagIcon}
          />
        </div>
        <Row className={[styles.projectBlocks].join(' ')}>
          {projectData ? projectListBlock() : tagListBlock()}
        </Row>
      </Row>
    );
  }
}

export default ProjectTag;
