async function getUserTeam(userId, depth) {
    try {
      if (depth <= 0) {
        // If depth reaches 0, return null to stop recursion
        return null;
      }
  
      const user = await UserTask.findOne({ userId }).select('userId completed name mobile sponsorId ').lean();
  
      if (!user) {
        return null;
      }
  
      const activeStatus = user.completed ? 'completed':'unCompleted';
      const teamStructure = {
        level: 6-depth,
        userId: user.userId,
        status: activeStatus,
        name: user.name,
        sponsorId: user.sponsorId,
        mobile: user.mobile,
        downlineCount: 0,
        allUsersCount: 0,
        downline: [],
      };
  
      const downlineUsers = await UserTask.find({ sponsorId: userId }).lean();
      const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId, depth - 1)); // Decrement depth in recursive call
      const downlineTeam = await Promise.all(downlinePromises);
  
      // Remove null elements from downlineTeam array
      const filteredDownlineTeam = downlineTeam.filter((item) => item !== null);
  
      teamStructure.downline = filteredDownlineTeam;
      teamStructure.downlineCount = filteredDownlineTeam.length;
     
      // Count number of all users and active users
      teamStructure.allUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.allUsersCount + 1, 0);
     
      return teamStructure;
    } catch (error) {
      // console.error('Error fetching user:', error);
      throw error;
    }
  }