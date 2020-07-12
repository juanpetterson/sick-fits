const { forwardTo } = require('prisma-binding');

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
};

module.exports = Query;
