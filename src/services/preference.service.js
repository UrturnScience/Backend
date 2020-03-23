const Preference = require("../models/preference.model");

//Updates the user's preferences to match the ordering given by the user
exports.updatePreferences = async function(preferenceIds) {
  for (let i = 0; i < preferenceIds.length; ++i) {
    const preference = await Preference.findOne({ _id: preferenceIds[i] });
    preference.weight = i;
    await preference.save();
  }
};
