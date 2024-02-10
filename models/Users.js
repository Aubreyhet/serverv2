
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Users;
};



