const Preference = require("../models/preference.model");
const Chore = require("../models/chore.model");
const RoomUser = require("../models/room_user.model");

//Updates the user's preferences to match the ordering given by the user
exports.updatePreferences = async function(preferenceIds) {
  for (let i = 0; i < preferenceIds.length; ++i) {
    const preference = await Preference.findOne({ _id: preferenceIds[i] });
    preference.weight = i;
    await preference.save();
  }
};

exports.fixPreferences = async function(userId){
    //Want to fix the user's preferences in the cause of deleted chore, new chore, etc

    //Want to get the the room for the user
    const roomUser = await RoomUser.findOne({userId: userId});

    //Want to get the upcoming chores for that user's room
    const upcomingChoreIds = await Chore.find({roomId: roomUser.roomId, upcoming: true}).distinct("_id");

    //Want to get the upcoming preferences for that user sorted ascending by their weight values
    const upcomingPreferences = await Preference.find({userId: userId, choreId: {"$in": upcomingChoreIds}}).sort(["weight", 1]);

    //Ensures that the preference weights for the user are unique and ascending without gaps from 0
    //Since we have the preferences sorted initially by weight, we can preserve the relative order that was saved from before
    for(let i = 0; i < upcomingPreferences.length; ++i){
        upcomingPreferences[i].weight = i;
        await upcomingPreferences[i].save();
    }
}
