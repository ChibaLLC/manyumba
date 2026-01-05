export default defineCachedEventHandler(
  (event) => {
    return getIpLocation(event);
  },
  {
    getKey(event) {
      return useIP(event);
    },
    maxAge: 400,
  }
);
