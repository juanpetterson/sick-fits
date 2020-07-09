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
    )

    return item
  },
}

module.exports = Mutations
