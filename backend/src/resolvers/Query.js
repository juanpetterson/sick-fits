const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, context, info) {
    // check if there is a current user ID
    const { userId } = context.request;
    if (!userId) {
      return null;
    }

    return context.db.query.user(
      {
        where: { id: userId },
      },
      info
    );
  },
  async users(parent, args, context, info) {
    const { userId, user } = context.request;
    if (!userId) {
      throw new Error('You must be logged in!');
    }

    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);

    return context.db.query.users({}, info);
  },
};

module.exports = Query;
