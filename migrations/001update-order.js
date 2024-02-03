'use strict';
const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn('orders', 'order_no', {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    });
    // order_no: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true
    // },


    await queryInterface.changeColumn('orders', 'order_status', {
      type: DataTypes.ENUM('pending', 'settlemented', 'returned', 'exchanged'),
      allowNull: false,
    });
    // order_status: {
    //   type: DataTypes.ENUM('pending', 'settlemented', 'returned', 'exchanged'),
    //   allowNull: false,
    // },


    await queryInterface.changeColumn('orders', 'product_count', {
      type: DataTypes.INTEGER
    });
    // product_count: {
    //   type: DataTypes.INTEGER
    // },


    await queryInterface.changeColumn('orders', 'product_amount_total', {
      type: DataTypes.DECIMAL(10, 2)
    });
    // product_amount_total: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },

    await queryInterface.changeColumn('orders', 'order_amount_total', {
      type: DataTypes.DECIMAL(10, 2)
    });
    // order_amount_total: {
    //   type: DataTypes.DECIMAL(10, 2)
    // },


    await queryInterface.changeColumn('orders', 'pay_channel', {
      type: DataTypes.ENUM('cash', 'alipay', 'wechat', 'bank_card', 'other'),
      allowNull: false,
    });
    // pay_channel: {
    //   type: DataTypes.ENUM('cash', 'alipay', 'wechat', 'bank_card', 'other'),
    //   allowNull: false,
    // },

    await queryInterface.changeColumn('orders', 'order_create_time', {
      type: DataTypes.BIGINT,
      allowNull: false,
    });
    // order_create_time: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },

    await queryInterface.changeColumn('orders', 'order_settle_time', {
      type: DataTypes.BIGINT,
      allowNull: false,
    });
    // order_settle_time: {
    //   type: DataTypes.BIGINT,
    //   allowNull: false,
    // },

    await queryInterface.changeColumn('orders', 'order_settle_user', {
      type: DataTypes.STRING
    });
    // order_settle_user: {
    //   type: DataTypes.STRING
    // }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
