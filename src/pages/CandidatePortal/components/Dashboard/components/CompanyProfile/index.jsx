import React, { PureComponent } from 'react';
import { Link } from 'umi';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import styles from './index.less';

const Card1 = () => {
  return (
    <>
      <div className={styles.videoPreview}>
        <YoutubeEmbed embedId="57NZs0YmcAQ" />
        {/* https://www.youtube.com/watch?v=57NZs0YmcAQ */}
      </div>
      <span className={styles.contentTitle}>Who are we?</span>
      <p className={styles.contentBody}>
        Being a software development company for 12 years with 1000+ strength, we are a 360-degree
        technology solution provider, right from product conceptualization to product maturity.
        <br /> <br />
        Our development roadmap tracks progress and execution, with intuitive design practices to
        achieve our clients’ organizational goals and create products and services that users love.
        <br />
      </p>
      <span className={styles.contentTitle}>
        Read more about us at - {' '}
        <Link
          style={{ fontWeight: 500 }}
          to={{ pathname: 'https://www.terralogic.com/about-us/' }}
          target="_blank"
        >
          www.terralogic.com
        </Link>
      </span>
    </>
  );
};

class CompanyProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: 0,
    };
  }

  customDot = (isActive, index) => {
    return (
      <div
        className={`${styles.customDot} ${isActive ? styles.active : ''}`}
        onClick={() => this.onChangePage(index)}
        key={index}
      />
    );
  };

  onChangePage = (index) => {
    this.setState({
      currentCard: index,
    });
  };

  render() {
    const { currentCard } = this.state;
    const cards = [<Card1 />, <Card1 />, <Card1 />, <Card1 />];
    return (
      <div className={styles.CompanyProfile}>
        <div>
          <div className={styles.header}>
            <span>Company Profile</span>
          </div>
          <div className={styles.content}>{cards[currentCard]}</div>
        </div>
        <div className={styles.sliderHandle}>
          {cards.map((val, index) => {
            return this.customDot(index === currentCard, index);
          })}
        </div>
      </div>
    );
  }
}

export default CompanyProfile;
