const generateMessage = (text,user) => {
 
    return {
    username:user,
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username,location) => {

  return {
    username,
    text: `https://www.google.cl/maps?q=${location.latitude},${location.longitude}`,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
