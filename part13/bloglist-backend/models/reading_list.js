const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class ReadingList extends Model {
  toJSON() {
    const values = { ...this.get() }
    if (values.userId !== undefined) values.user_id = values.userId
    if (values.blogId !== undefined) values.blog_id = values.blogId
    return values
  }
}

ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' }
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_list'
  }
)

module.exports = ReadingList
