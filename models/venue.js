module.exports = (sequelize, { DataTypes }) => {
    const Venue = sequelize.define('venue', {

        vid: { type: DataTypes.STRING, primaryKey: true },
        name: DataTypes.STRING,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,
        capacity: DataTypes.INTEGER


    });

    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return Venue;
};

