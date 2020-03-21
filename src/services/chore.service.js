const Chore = require("../models/chore.model");
const Preference = require("../models/preference.model");
const Assignment = require("../models/assignment.model");
const RoomUser = require("../models/room_user.model");

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
  const userIds = await RoomUser.find({roomId: body.roomId}).distinct("userId");

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
  const chores = await Chore.find({ roomId: roomId }).distinct("_id");
  
  return choreIds;
};

exports.deleteChoreAndReferences = async function(choreId) {
  //Two different types: chores with existing assignments, chores without any assignments
  //Chores with assignments get "retired"(chore.upcoming = false, since chore might already exist if recurring in assignments)
  //Chores without any assignments simply get deleted(alongside their preferences)

  const assignments = await Assignment.find({choreId: choreId});
  if (assignments.length > 0){
    //Retire
    const chore = await Chore.findOne({_id: choreId});
    chore.upcoming = false;
    await chore.save();
  }
  else{
    //Delete since no assignments have been created for it(therefore can erase it from history)
    await Preference.deleteMany({ choreId: choreId });
    await Chore.deleteOne({ _id: choreId });
  }
};
