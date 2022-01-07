import React from 'react';
import { Layout, Row, Col, Carousel } from 'antd';
import styles from './TerralogicCandidateLoginLayout.less';
import TerralogicLogo from '../assets/login/terralogic_logo.svg';
import LollypopLogo from '../assets/login/lollypop_logo.svg';
import LinkedInIcon from '../assets/login/linkedin.svg';
import TwitterIcon from '../assets/login/twitter.svg';
import InstagramIcon from '../assets/login/instagram.svg';
import YoutubeIcon from '../assets/login/youtube.svg';
import Image1 from '../assets/login/mock_up.svg';
import Image2 from '../assets/login/vr_man.svg';

const { Content } = Layout;

const SliderCard = ({ item, contentStyle }) => {
  const { image = '', title = '', description = '' } = item;
  return (
    <div className={styles.SliderCard} style={contentStyle}>
      <div className={styles.previewImage}>
        <img src={image} alt="" />
      </div>

      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

const slides = [
  {
    id: 1,
    title: 'Driving innovation through new-age technology',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: Image1,
  },
  {
    id: 2,
    title: 'Driving innovation through new-age technology',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: Image2,
  },
  {
    id: 3,
    title: 'Driving innovation through new-age technology',
    description:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
    image: Image1,
  },
];
const TerralogicCandidateLoginLayout = ({ children }) => {
  const redirectToUrl = (url) => {
    window.open(url, '_blank');
  };

  const icons = [
    {
      icon: LinkedInIcon,
      link: '#',
    },
    {
      icon: TwitterIcon,
      link: '#',
    },
    {
      icon: InstagramIcon,
      link: '#',
    },
    {
      icon: YoutubeIcon,
      link: '#',
    },
  ];

  return (
    <Layout className={styles.TerralogicCandidateLoginLayout}>
      <Content className={styles.container}>
        <div className={styles.left}>
          <div className={styles.loginBox}>
            <div className={styles.logos}>
              <div className={styles.terralogicLogo}>
                <img src={TerralogicLogo} alt="" />
              </div>
              <div className={styles.lollypopLogo}>
                <img src={LollypopLogo} alt="" />
              </div>
            </div>
            <div className={styles.children}>{children}</div>
          </div>
          <Row
            className={styles.footer}
            justify={{ xs: 'start', lg: 'space-between' }}
            align="bottom"
          >
            <Col xs={24} lg={12} className={styles.copyright}>
              <span>@All right reserved | T&C | Privacy Policy</span>
            </Col>
            <Col xs={24} lg={12} className={styles.socialMedia}>
              <div>
                <span>Follow us on</span>
                <div className={styles.icons}>
                  {icons.map((x) => (
                    <div className={styles.icon}>
                      <img src={x.icon} alt="" onClick={() => redirectToUrl(x.link)} />
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.right}>
          <Carousel autoplay autoplaySpeed={3000}>
            {slides.map((slide) => (
              <SliderCard item={slide} />
            ))}
          </Carousel>
        </div>
      </Content>
    </Layout>
  );
};
export default TerralogicCandidateLoginLayout;
