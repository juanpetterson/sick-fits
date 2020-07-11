const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in

    // We can access the database (db) importing the db file stead use via context.db
    const item = await context.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );

    return item;
  },
  updateItem(parent, args, context, info) {
    // first take a copu of the updates
    const updates = { ...args };
    //remove the id from the updates
    delete updates.id;
    // run the update method
    return context.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };
    // find the item
    const item = await context.db.query.item({ where }, `{id title}`);
    // check if they own that item or have the permissions
    // TODO
    // delete it
    return context.db.mutation.deleteItem({ where }, info);
  },
};

module.exports = Mutations;
