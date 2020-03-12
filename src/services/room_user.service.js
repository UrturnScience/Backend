const Preference = require("../models/preference.model");
const RoomUser = require("../models/room_user.model");

const ChoreService = require("./chore.service");

exports.createRoomUserAndPreferences = async function(body) {
    let objects = {};

  //Create chore
  const roomUser = new RoomUser({
    roomId: body.rid,
    userId: body.uid
  });
  
  await roomUser.save();
  objects["roomUser"] = roomUser;

  //Get chores in the room for that user
  choreIds = await ChoreService.getChoreIdsByRoomId(roomUser.roomId);
  console.log(choreIds);

  objects["preferences"] = [];
  //create preferences for chore
  for(var i = 0; i < choreIds.length; ++i)
  {
    const preference = new Preference({
        choreId: choreIds[i],
        userId: roomUser.userId
    });
    await preference.save();
    console.log(preference);
    objects["preferences"].push(preference);
  }

  return objects;
};

exports.deleteRoomUsersByRoomId = async function(roomId){
  await RoomUser.deleteMany({roomId: roomId});
}