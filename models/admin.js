module.exports = (sequelize, { DataTypes }) => {
    const Admin = sequelize.define('admin', {
        aid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },


        },
        name: { type: DataTypes.STRING },
        email: {
            type: DataTypes.STRING, unique: true,
        }
    });

    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return Admin;
};

