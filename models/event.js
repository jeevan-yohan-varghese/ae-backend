module.exports = (sequelize, { DataTypes }) => {
    const Event = sequelize.define('event', {

        eid: {type:DataTypes.STRING,primaryKey:true},
        startdate: DataTypes.DATE,
        enddate: DataTypes.DATE,
        name: DataTypes.STRING,
        seats: DataTypes.INTEGER
       
    });

    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return Event;
};

