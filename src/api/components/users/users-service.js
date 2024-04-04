const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { flatMap, isEmpty } = require('lodash');
const { passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return false;
  }
}

/**
 * Check Email
 * @param {string} email - Email
 * @returns {boolean}
 */
async function checkEmail(email) {
  const successEmail = await usersRepository.checkEmail(email);
  if (isEmpty(successEmail)) {
    return false;
  } else {
    return true;
  }
}

/**
 * Check Password
 * @param {string} id -Id
 * @param {string} password_lama - Password Lama
 * @returns {object}
 */
async function checkPassword(id, password_lama) {
  const user = await usersRepository.getUser(id);
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password_lama, userPassword);

  if (user && passwordChecked) {
    return {
      name: user.name,
      email: user.email,
      user_id: user.id,
    };
  }

  return null;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} password_baru - Password Baru
 * @returns {boolean}
 */
async function changePassword(id, password_baru) {
  const user = await usersRepository.getUser(id);
  const hashedPassword = await hashPassword(password_baru);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.changePassword(id, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  checkEmail,
  checkPassword,
  changePassword,
  createUser,
  updateUser,
  deleteUser,
};
