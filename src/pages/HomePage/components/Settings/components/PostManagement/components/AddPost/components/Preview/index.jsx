import React, { useState, useEffect } from 'react';
import Parser from 'html-react-parser';
import styles from './index.less';
import { POST_TYPE_TEXT } from '@/utils/homePage';
import EmployeeTag from '@/pages/HomePage/components/Announcements/components/EmployeeTag';
import PostContent from '@/pages/HomePage/components/Announcements/components/PostContent';
import PreviewImage from '@/assets/homePage/previewImage.png';
import CelebratingCard from '@/pages/HomePage/components/Celebrating/components/Card';
import GalleryCard from '@/pages/HomePage/components/Gallery/components/Card';
import Carousel from '@/pages/HomePage/components/Carousel';

const Preview = (props) => {
  const {
    mode = '',
    dataA: { uploadFilesA = [], descriptionA = '' } = {},
    dataB: { uploadFilesB = [], descriptionB = '' } = {},
    dataBN: { uploadFilesBN = [] } = {},
    dataI: { titleI = '', uploadFilesI = [], descriptionI = '' } = {},
  } = props;

  const [announcementContent, setAnnouncementContent] = useState({
    imageUrls: [],
  });
  const [birthdayContent, setBirthdayContent] = useState({
    imageUrls: [],
  });
  const [imagesContent, setImagesContent] = useState({
    imageUrls: [],
  });
  const [bannerContent, setBannerContent] = useState({
    imageUrls: [],
  });

  const toBase64 = (file) =>
    // eslint-disable-next-line compat/compat
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getBase64Arr = (arr, func) => {
    // eslint-disable-next-line compat/compat
    Promise.all(
      arr.map((x) => {
        return toBase64(x);
      }),
    ).then((data) => {
      func({ imageUrls: data });
    });
  };

  useEffect(() => {
    if (uploadFilesA.length > 0) {
      getBase64Arr(uploadFilesA, setAnnouncementContent);
    } else {
      setAnnouncementContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesA)]);

  useEffect(() => {
    if (uploadFilesB.length > 0) {
      getBase64Arr(uploadFilesB, setBirthdayContent);
    } else {
      setBirthdayContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesB)]);

  useEffect(() => {
    if (uploadFilesI.length > 0) {
      getBase64Arr(uploadFilesI, setImagesContent);
    } else {
      setImagesContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesI)]);

  useEffect(() => {
    if (uploadFilesBN.length > 0) {
      getBase64Arr(uploadFilesBN, setBannerContent);
    } else {
      setBannerContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesBN)]);

  const renderPreview = () => {
    const post = {
      id: 1,
      employee: {
        generalInfo: {
          legalName: 'Ronald Richards.',
          // avatar: TerralogicIcon,
        },
        title: {
          name: 'Head of Design',
        },
      },
      content: (
        <p>
          {Parser(descriptionA) ||
            `We are extremely joyful to announce that we have won DNA Paris Design Awards 2021 & that
          marks a hat trick of us winning this award from 2019 to 2021! 🎊`}
        </p>
      ),
      type: 2, // 1: link, 2: image
      image:
        announcementContent.imageUrls.length > 0 ? announcementContent.imageUrls[0] : PreviewImage,
    };

    switch (mode) {
      case POST_TYPE_TEXT.ANNOUNCEMENT:
        return (
          <>
            <EmployeeTag employee={post.employee} />
            <PostContent post={post} />
          </>
        );
      case POST_TYPE_TEXT.BIRTHDAY_ANNIVERSARY:
        return (
          <div style={{ padding: '24px' }}>
            <CelebratingCard
              previewing
              contentPreview={{
                previewImage:
                  birthdayContent.imageUrls.length > 0 ? birthdayContent.imageUrls[0] : '',
                previewDescription: descriptionB ? Parser(descriptionB) : 'Description',
              }}
            />
          </div>
        );
      case POST_TYPE_TEXT.IMAGES:
        return (
          <div style={{ padding: '24px' }}>
            <GalleryCard
              previewing
              contentPreview={
                imagesContent.imageUrls.length > 0
                  ? imagesContent.imageUrls.map((x) => {
                      return {
                        image: x,
                        content: descriptionI ? Parser(descriptionI) : '',
                        title: titleI || '',
                      };
                    })
                  : [
                      {
                        image: '',
                        content: descriptionI ? Parser(descriptionI) : 'Description',
                        title: titleI || 'Title',
                      },
                    ]
              }
            />
          </div>
        );
      case POST_TYPE_TEXT.BANNER:
        return (
          <div style={{ padding: '24px' }}>
            <Carousel previewing contentPreview={bannerContent.imageUrls} />
          </div>
        );
      default:
        return '';
    }
  };

  return <div className={styles.Preview}>{renderPreview()}</div>;
};

export default Preview;
