module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('Users', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});

	Users.associate = (models) => {
		Users.hasMany(models.Likes, {
			onDelete: 'cascade',
		});
	};
	return Users;
};
