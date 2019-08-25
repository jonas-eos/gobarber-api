import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        user_id: Sequelize.INTEGER,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  /**
   * Link Appointment  models with User  models
   */
  static associate(__models) {
    this.belongsTo(__models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(__models.User, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
  }
}

export default Appointment;
