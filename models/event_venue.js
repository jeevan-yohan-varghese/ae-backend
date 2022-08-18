module.exports = (sequelize, { DataTypes }) => {
    const EventVenue = sequelize.define('eventvenue', {

        pid: DataTypes.STRING,
    vid: DataTypes.STRING,
    
    
       
    });
   

    // Participant.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return EventVenue;
};

