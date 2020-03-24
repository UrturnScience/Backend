const Chore = require("../models/chore.model");
const Preference = require("../models/preference.model");
const Assignment = require("../models/assignment.model");
const RoomUser = require("../models/room_user.model");

const PreferenceService = require("./preference.service");

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
  const userIds = await RoomUser.find({ roomId: body.roomId }).distinct(
    "userId"
  );

  //create preferences for chore
  for (var i = 0; i < userIds.length; ++i) {
    const preference = new Preference({
      choreId: chore.id,
      userId: userIds[i]
    });
    await preference.save();
  }

  await PreferenceService.fixPreferencesByRoomId(body.roomId);

  objects['preferences'] = await Preference.find({userId: {"$in": userIds}});

  return objects;
};

exports.retireOrDeleteChoreAndPreferencesAndAssignments = async function(choreId){
  //Two different types: chores with existing assignments, chores without any assignments
  //Chores with assignments get "retired"(chore.upcoming = false, since chore might already exist if recurring in assignments)
  //Chores without any assignments simply get deleted(alongside their preferences)
  const chore = await Chore.findOne({ _id: choreId });
  const assignments = await Assignment.find({ choreId: choreId });
  if (assignments.length > 0) {
    //Retire the chore(upcoming = false, don't change active since might have current chores for the week which will be processed by retireAssignments)
    chore.upcoming = false;
    await chore.save();
  } else {
    //Delete since no assignments have been created for it(therefore can erase it from history) //A chore which hasn't been processed and not recurring
    await Preference.deleteMany({ choreId: choreId });
    await Chore.deleteOne({ _id: choreId });
  }

  await PreferenceService.fixPreferencesByRoomId(chore.roomId);

};
