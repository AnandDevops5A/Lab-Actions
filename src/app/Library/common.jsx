export  function calulateWinAndReward(tournamentList){
    const rewardMap = { 1: 500, 2: 200, 3: 100 };
    //calculate rewards
    let userStats = new Map();

    for (const tournament of (tournamentList || [])) {
      const rankList = tournament.rankList || {};
      for (const userId in rankList) {
        if (Object.prototype.hasOwnProperty.call(rankList, userId)) {
          const rank = rankList[userId];
          let reward = rewardMap[rank] || 0;

          let stats = userStats.get(userId);
          if (!stats) {
            stats = { reward: 0, wins: 0 };
            userStats.set(userId, stats);
          }

          stats.reward += reward;
          if (rank == 1) {
            stats.wins += 1;
          }
        }
      }
    }
    return userStats;
  }
  
