const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirm_password = request.body.confirm_password;

    const successEmail = await usersService.checkEmail(email);
    if (confirm_password !== password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Confirm password tidak sesuai.'
      );
    } else if (successEmail == true) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Failed to create user'
      );
    } else {
      const success = await usersService.createUser(name, email, password);
      if (success == false) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to create user'
        );
      }
    }
    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const successEmail = await usersService.checkEmail(email);
    if (successEmail == true) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Failed to update user'
      );
    } else {
      const success = await usersService.updateUser(id, name, email);
      if (success == false) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Failed to update user'
        );
      }
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change password user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    const id = request.params.id;
    const password_lama = request.body.password_lama;
    const password_baru = request.body.password_baru;
    const confirm_password_baru = request.body.confirm_password_baru;

    const success = await usersService.checkPasswordUser(id, password_lama);

    if (!success) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Password lama salah.'
      );
    } else if (confirm_password_baru !== password_baru) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Confirm password baru tidak sesuai dengan password baru.'
      );
    } else {
      const successChangePassword = await usersService.changePasswordUser(
        id,
        password_baru
      );
      if (!successChangePassword) {
        throw errorResponder(
          errorTypes.UNPROCESSABLE_ENTITY,
          'Faile to change password user.'
        );
      }
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
