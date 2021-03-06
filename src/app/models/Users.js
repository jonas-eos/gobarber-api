import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });
    return this;
  }

  /**
   * Link User models to File models
   */
  static associate(__models) {
    this.belongsTo(__models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  passwordCorrect(__password) {
    return bcrypt.compare(__password, this.password_hash);
  }
}

export default User;
