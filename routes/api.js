const router = require('express').Router();
const verifyApiKey = require('../middlewares/verify-apikey');
const verifyUserAuth = require('../middlewares/verify-user-auth');

const { v4: uuidv4 } = require('uuid')

const admin = require('firebase-admin');
const db = require('../models')
const Event = db.events
const ParticipantEvent = db.participantEvents
const Participant = db.participants;
const Venue = db.venues;
router.get('/', (req, res, next) => {

    res.send("Check documentation for endpoints");
});


/*Events CRUD start*/

router.post('/newEvent', async (req, res, next) => {
    const newId = uuidv4()

    Venue.findOne({ where: { vid: `${req.body.venueId}` } }).then(venue => {
        console.log(`Venue:${venue}`);
        if (!venue) {
            return res.status(400).json({ "error": true, "message": "Venue not found" })
        }

        if (venue.capacity < req.body.seats) {
            return res.status(400).json({ "error": true, "message": "Not enough capacity" })
        }

        const newEvent = { eid: newId, name: req.body.name, startdate: req.body.startDate, enddate: req.body.endDate, seats: req.body.seats, vid: req.body.venueId }
        Event.create(newEvent)
            .then(data => {
                return res.json(data);
            })
            .catch(err => {
                return res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Event."
                });
            });
    })



});

router.get('/getAllEvents', (req, res, next) => {
    Event.findAll().then(data => {
        res.send(data);
    })
})

router.delete('/deleteEvent', (req, res, next) => {
    if (!req.body.eventId) {
        return res.status(400).json({ "error": true, "message": "Event id is required" });
    }

    Event.destroy({ where: { eid: req.body.eventId } }).then(status => {
        if (status == 1) {
            return res.json({ "success": true, "message": "Succesfully deleted" });
        } else {
            return res.json(500).json({ "success": false, "message": "Could not delete event" });
        }
    })
})

router.post('/updateEvent', (req, res, next) => {
    if (!req.body.eventId) {
        return res.status(400).json({ "success": false, "message": "event id is required" });
    }

    Event.update({ name: req.body.name, startdate: req.body.startdate, enddate: req.body.enddate, seats: req.body.seats },
        { where: { eid: req.body.eventId } }).then(num => {
            if (num == 1) {
                return res.json({ "success": true, "message": "Succesfully updated" });
            } else {
                return res.json(500).json({ "success": false, "message": "Could not update event" });
            }
        })
})

/*Events CRUD end*/


/*Participant Event endpoints*/
router.post('/registerForEvent', verifyUserAuth, (req, res, next) => {
    if (!req.body.eventId) {
        return res.status(400).json({ "success": false, "message": "event id is required" });
    }

    Event.findOne({ where: { eid: req.body.eventId } }).then(event => {

        if (!event) {
            return res.status(400).json({ "success": false, "message": "invalid event id" });
        }
        ParticipantEvent.findOne({ where: { eid: req.body.eventId, pid: req.currentUser._pid } }).then(user => {
            if (user) {
                return res.status(400).json({ "success": false, "message": "already registered" });
            }
        })
        if (event.seats > 0) {

            const newUUid = uuidv4();
            const newParticipantEvent = { pid: req.currentUser._pid, eid: req.body.eventId, ucode: newUUid }
            ParticipantEvent.create(newParticipantEvent).then(data => {
                Event.update({ seats: event.seats - 1 }, { where: { eid: req.body.eventId } }).then(num => {
                    if (num == 1) {
                        return res.json({ "success": true, "message": "Registered for event" });
                    } else {
                        return res.status(400).json({ "success": false, "message": `some error occurred` });
                    }
                })

            }).catch(e => {
                return res.status(400).json({ "success": false, "message": `error ${e}` });
            })
        } else {
            return res.status(400).json({ "success": false, "message": `not enough seats` });
        }
    })


})

router.post('/unregisterEvent', verifyUserAuth, (req, res, next) => {
    if (!req.body.eventId) {
        return res.status(400).json({ "success": false, "message": "event id is required" });
    }

    ParticipantEvent.findOne({ where: { eid: req.body.eventId, pid: req.currentUser._pid } }).then(event => {

        if (!event) {
            return res.status(400).json({ "success": false, "message": "not registerd for event" });
        }
        ParticipantEvent.destroy({ where: { eid: req.body.eventId, pid: req.currentUser._pid } }).then(num => {
            if (num == 1) {
                Event.update({ seats: db.sequelize.literal('seats + 1') }, { where: { eid: req.body.eventId } }).then(num => {
                    if (num == 1) {
                        return res.json({ "success": true, "message": "Unregistered" })
                    }

                })

            }
        })
    })


})

router.get('/myEvents', verifyUserAuth, (req, res, next) => {
    ParticipantEvent.findAll({
        where: { pid: req.currentUser._pid },
        include: [
            { model: Participant },
            { model: Event }
        ]
    }).then(events => {
        return res.json(events);
    });

    //   return cookoffParticpants.findOne({
    //     where: { CookoffID: cookoffID, ParticipantID: participantID },
    //     include: [
    //         { model: Participant },
    //         { model: Event }
    //     ]
    // });
})


/*Veunues*/

router.post('/newVenue', async (req, res, next) => {
    const newId = uuidv4()

    const newVenue = { vid: newId, name: req.body.name, lat: req.body.lat, lng: req.body.lng, capacity: req.body.capacity }
    Venue.create(newVenue)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Venue."
            });
        });


});

router.delete('/deleteVenue', (req, res, next) => {
    if (!req.body.venueId) {
        return res.status(400).json({ "error": true, "message": "Venue id is required" });
    }

    Venue.findOne({ where: { vid: req.body.venueId } }).then(venue => {

        if (!venue) {
            return res.status(400).json({ "success": false, "message": "Invalid venue id" });
        }
        venue.destroy().then(num => {
            return res.json({ "success": true, "message": "Delete venue" })
        })
    });

})

router.get('/getAllVenues', (req, res, next) => {
    Venue.findAll().then(data => {
        res.send(data);
    })
})



module.exports = router;