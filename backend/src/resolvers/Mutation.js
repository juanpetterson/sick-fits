const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { transport, makeEmail } = require('../mail');

const Mutations = {
  async createItem(parent, args, context, info) {
    // TODO: Check if they are logged in
    const { userId } = context.request;
    if (!userId) {
      throw new Error('You must be logged in to do that!');
    }

    // We can access the database (db) importing the db file stead use via context.db
    const item = await context.db.mutation.createItem(
      {
        data: {
          // this is how to create a relationship between the Item and the User
          user: {
            connect: {
              id: userId,
            },
          },
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
  async signup(parent, args, context, info) {
    args.email = args.email.toLowerCase();

    const password = await bcrypt.hash(args.password, 10);
    const user = await context.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // create the jwt for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set the jwt as cookie on the response
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    return user;
  },
  async signin(parent, { email, password }, context, info) {
    const user = await context.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    return user;
  },
  signout(parent, args, context, info) {
    context.response.clearCookie('token');

    return { message: 'Goodbye!' };
  },
  async requestReset(parent, args, context, info) {
    const { email } = args;

    const user = await context.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpire = Date.now() + 3600000;
    const res = context.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpire },
    });

    const mailResponse = await transport.sendMail({
      from: 'sickfits@sickfits.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeEmail(
        `Your Password Reset Token is here! 
        \n\n 
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
          Click Here to Reset
        </a>`
      ),
    });

    return { message: 'Thanks!' };
  },
  async resetPassword(parent, args, context, info) {
    const { password, confirmPassword, resetToken } = args;
    if (password !== confirmPassword) {
      throw new Error('Your passwords dont match!');
    }

    const [user] = await context.db.query.users({
      where: {
        resetToken,
        resetTokenExpire_gte: Date.now() - 3600000,
      },
    });

    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const updatedUser = await context.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: passwordHashed,
        resetToken: null,
        resetTokenExpire: null,
      },
    });

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return updatedUser;
  },
};

module.exports = Mutations;
