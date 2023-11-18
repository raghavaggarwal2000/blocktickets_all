const createTokenPayload = (user) => {
  return {
    username: user.username,
    userId: user._id,
    userType: user?.userType,
    role: user.role,
  };
};

const createWalletAddressPayload = (obj, walletAddress) => {
  return { userId: obj._id, publicAddress: walletAddress };
};

module.exports = { createTokenPayload, createWalletAddressPayload };
