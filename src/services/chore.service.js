const Chore = require("../models/chore.model");
const Preference = require("../models/preference.model");
const Assignment = require("../models/assignment.model");

const RoomService = require("./room.service");

exports.createChoreAndPreferences = async function(body) {

  const objects = {};

  //Create chore
  const chore = new Chore({
    roomId: body.roomId,
    name: body.name,
    time: body.time,
    recurring: body.recurring
  });

  await chore.save();
  objects["chore"] = chore;

  //Get users in the room that the chore was created for
  const userIds = await RoomService.getUserIdsByRoomId(chore.roomId);

  objects["preferences"] = [];
  //create preferences for chore
  for (var i = 0; i < userIds.length; ++i) {
    const preference = new Preference({
      choreId: chore.id,
      userId: userIds[i]
    });
    await preference.save();
    objects["preferences"].push(preference);
  }

  return objects;
};

exports.getChoreIdsByRoomId = async function(roomId) {
  const chores = await Chore.find({ roomId: roomId });

  const choreIds = [];
  for (var i = 0; i < chores.length; i++) {
    choreIds.push(chores[i].get("_id"));
  }
  
  return choreIds;
};

exports.deleteChoreAndReferences = async function(choreId) {
  //Delete Chore, Assignments of that chore, preferences of that chores

  //Preference
  await Preference.deleteMany({ choreId: choreId });

  //Assignment
  await Assignment.deleteMany({ choreId: choreId });

  //Chore
  await Chore.deleteOne({ _id: choreId });
};
