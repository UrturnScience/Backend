exports.shuffleArray = async function(a) {
  //Utilizes the Fisher-Yates Shuffle Algorithm to scramble an array of elements
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

exports.findHighestAvailableChore = async function(preferences, chosenChoreIds) {
  for (let i = 0; i < preferences.length; ++i) {
    const choreId = preferences[i].choreId;

    if (!chosenChores.has(choreId)) {
      return choreId;
    }
  }
  return null;
};

exports.getDraftingOrder = async function(userIds, size){
    const shuffledUserIds = await this.shuffleArray([...userIds]);
    const reversedShuffledUserIds = [...shuffledUserIds].reverse();
  
    //Create the drafting order for the assignments via snake draft(with over flow)
    const draftOrder = [];
    while (draftOrder.length < upcomingChores.length) {
      draftOrder.push(shuffledUserIds);
      draftOrder.push(reversedShuffledUserIds);
    }

    return draftOrder.slice(0, size);
}
