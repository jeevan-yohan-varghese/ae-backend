
const Participant =require('./participant');
const Event =require('./event');

module.exports = (sequelize, { DataTypes }) => {
    const ParticipantEvent = sequelize.define('participantevent', {

        pid: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        eid: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        ucode: { type: DataTypes.STRING, unique: true }

    });
    ParticipantEvent.associate = (models) => {
        ParticipantEvent.belongsTo(Event, { onDelete: 'CASCADE', foreignKey: { name: 'eid', allowNull: false } });
        ParticipantEvent.belongsTo(Participant, { onDelete: 'CASCADE', foreignKey: { name: 'pid', allowNull: false } });
    };

    // ParticipantEvent.associate = (models) => {
    //     Participant.hasMany(models.Message, { onDelete: 'CASCADE' });
    // };

    return ParticipantEvent;
};

