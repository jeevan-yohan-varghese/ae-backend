module.exports = (sequelize, { DataTypes }) => {
    const Checkin = sequelize.define('checkin', {
        ucode: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },


        },
        
    });

    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return Checkin;
};

