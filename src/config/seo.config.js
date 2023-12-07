const SITE_NAME = 'Next Bank';

export const getTitle = title => {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
};
