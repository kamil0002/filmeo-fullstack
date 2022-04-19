const bp = {
  mobile: '23.4375em', // 375px
  mobileM: '26.5625em', // 425px
  tablet: '48em', // 768px
  laptop: '64em', // 1024px
  desktop: '90em', // 1440px
};

export default {
  mobile: `only screen and (min-width: ${bp.mobile})`,
  mobileM: `only screen and (min-width: ${bp.mobileM})`,
  tablet: `only screen and (min-width: ${bp.tablet})`,
  laptop: `only screen and (min-width: ${bp.laptop})`,
  desktop: `only screen and (min-width: ${bp.desktop})`,
};
