const Jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');

const { User } = require('../../models');

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const [extension] = originalname.split('.').reverse(); // getting extension
  const avatarsDir = path.join(
    __dirname,
    '../../',
    'public',
    'avatars',
  );
  const newFileName = `${req.user._id}.${extension}`;

  const fileUpload = path.join(avatarsDir, newFileName);
  await fs.rename(tempUpload, fileUpload);

  // avatar cropping
  Jimp.read(fileUpload)
    .then(avatar => {
      avatar.resize(250, 250).write(fileUpload);
    })
    .catch(error => {
      console.error(error);
    });

  const avatarURL = path.join('public', 'avatars', newFileName);
  await User.findByIdAndUpdate(
    req.user._id,
    { avatarURL },
    { new: true },
  );
  res.json({ avatarURL });
};

module.exports = updateAvatar;
