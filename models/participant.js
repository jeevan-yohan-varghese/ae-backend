

module.exports = (sequelize, { DataTypes }) => {
    const Participant = sequelize.define('participant', {
        pid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },


        },
        name: { type: DataTypes.STRING },
        regNo: { type: DataTypes.STRING },
        email: {
            type: DataTypes.STRING, unique: true,
        }
    });

    
    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Event, {
    //         through: models.ParticipantEvent,
    //         foreignKey: "pid",
    //         otherKey: "eid"
    //     });
    // };

    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return Participant;
};

