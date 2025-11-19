var db = {
  users: [
    {
      id: 1,
      username: "Jayden",
      channelName: "Jayden's Shenanigans",
      watchHistory: [], // Stores objects: { videoId, watchedAt }, for videos the user has watched
      videos: [1, 2], // Video IDs that this user uploaded
    },
    {
      id: 2,
      username: "John",
      channelName: "John's Adventures",
      watchHistory: [],
      videos: [3, 4],
    },
  ],
  videos: [
    {
      id: 1,
      userId: 1, // Owner / uploader user ID
      title: "Welcome to My Channel",
      description: "This is Jayden's first video!",
      category: "Vlog",
      isPublic: true,
      scheduledFor: null, // When the video is *scheduled* to go live (if any)
      uploadDate: new Date().toISOString(), // Actual upload timestamp (in ISO format)
      views: 500,
      likes: 50,
      comments: 10,
    },
    {
      id: 2,
      userId: 1,
      title: "How to Bake a Cake",
      description: "Simple cake recipe for beginners.",
      category: "Cooking",
      isPublic: true,
      scheduledFor: null,
      uploadDate: new Date().toISOString(),
      views: 800,
      likes: 120,
      comments: 25,
    },
    {
      id: 3,
      userId: 2,
      title: "Building a Treehouse",
      description: "Bob shows you how to build a treehouse step by step.",
      category: "DIY",
      isPublic: true,
      scheduledFor: null,
      uploadDate: new Date().toISOString(),
      views: 300,
      likes: 30,
      comments: 5,
    },
    {
      id: 4,
      userId: 2,
      title: "Future Project: Solar Powered Pond",
      description: "My upcoming eco-friendly pond build.",
      category: "DIY",
      isPublic: true,
      scheduledFor: "2099-01-01T00:00:00Z", // Scheduled far in the future
      uploadDate: null, // Not uploaded yet
      views: 0,
      likes: 0,
      comments: 0,
    },
  ],
};

// These variables help assign a unique ID when a new user or video is created
var nextUserId = db.users.length + 1;
var nextVideoId = db.videos.length + 1;

// ---------------------------
// General functions
// ---------------------------

// Generates a random integer between min and max (inclusive)
// Used to simulate view / like / comment count when a video is published or released
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// This function “releases” a scheduled video if its scheduled time has passed.
// It checks if video.scheduledFor is set and if now >= scheduled time.
// If eligible, it fills in views, likes, comments using random numbers, sets uploadDate, and clears scheduledFor.
function releaseScheduledVideo(video) {
  var now = new Date();
  if (
    video.scheduledFor &&
    now >= new Date(video.scheduledFor) &&
    video.views === 0
  ) {
    // Only release if no one has watched yet (views === 0)
    video.views = randomInt(100, 1000);
    video.likes = randomInt(10, 100);
    video.comments = randomInt(0, 50);
    video.uploadDate = now.toISOString();
    video.scheduledFor = null; // Clear the scheduled flag
    return true;
  }
  return false;
}

// ---------------------------
// User Management Functions
// ---------------------------

// Adds a new user with a username and channel name
function addUser(username, channelName) {
  if (!username || !channelName)
    throw new Error("Username and channel name are required");

  var newUser = {
    id: nextUserId++,
    username: username,
    channelName: channelName,
    watchHistory: [],
    videos: [],
  };
  db.users.push(newUser);
  return newUser;
}

// Updates a user's username given their userId
function updateUsername(userId, newUsername) {
  if (!newUsername) throw new Error("New username must not be empty");
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) {
      db.users[i].username = newUsername;
      return db.users[i];
    }
  }
  throw new Error("User with ID " + userId + " not found");
}

// Updates a user's channel name given their userId
function updateChannelName(userId, newChannelName) {
  if (!newChannelName) throw new Error("New channel name must not be empty");
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) {
      db.users[i].channelName = newChannelName;
      return db.users[i];
    }
  }
  throw new Error("User with ID " + userId + " not found");
}

// ---------------------------
// Video Management Functions
// ---------------------------

// Creates a draft video (not published yet) for a specific user
function createDraftVideo(userId, title, description, category, isPublic) {
  if (!title) throw new Error("Title is required");

  // Find the user object for this userId
  var user = null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  var video = {
    id: nextVideoId++,
    userId: userId,
    title: title,
    description: description || "",
    category: category || "",
    isPublic: isPublic !== false,
    scheduledFor: null,
    uploadDate: null, // Not uploaded yet
    views: 0,
    likes: 0,
    comments: 0,
  };
  db.videos.push(video);
  user.videos.push(video.id);
  return video;
}

// Immediately publishes a draft video.
// It “publishes” by setting the uploadDate and creating random engagement stats.
function publishVideo(userId, videoId) {
  var user = null;
  // Find the correct user
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  var video = null;
  // Find the video and ensure it belongs to this user
  for (var i = 0; i < db.videos.length; i++) {
    if (db.videos[i].id === videoId && db.videos[i].userId === userId) {
      video = db.videos[i];
    }
  }
  if (!video)
    throw new Error("Video with ID " + videoId + " not found for this user");
  if (video.uploadDate)
    throw new Error("Video already published"); // Prevent republishing

  var now = new Date();
  video.uploadDate = now.toISOString();
  video.views = randomInt(100, 1000);
  video.likes = randomInt(10, 100);
  video.comments = randomInt(0, 50);
  return video;
}


// Schedules a video to be “released” (i.e. published) in the future.
// This only sets a timestamp; the video isn't made publicly active until releaseScheduledVideo is called.
function scheduleVideo(videoId, year, month, day, hour, minute, second) {
  var video = null;
  for (var i = 0; i < db.videos.length; i++) {
    if (db.videos[i].id === videoId) video = db.videos[i];
  }
  if (!video) throw new Error("Video with ID " + videoId + " not found");

  // Default to zero if not provided
  hour = hour || 0;
  minute = minute || 0;
  second = second || 0;

  // Create a Date object in local system time
  var date = new Date(year, month - 1, day, hour, minute, second);
  var now = new Date();
  if (date <= now)
    throw new Error("Scheduled date must be in the future (relative to now)");

  video.scheduledFor = date.toISOString();
  // Reset activity; these will be generated when video is released
  video.views = 0;
  video.likes = 0;
  video.comments = 0;
  return video;
}

// ---------------------------
// Queries / Filters
// ---------------------------

// Finds all videos by a user.
// If you pass `field` and `value`, it filters by that field (e.g. “category” or “title”).
function findUserVideos(userId, field, value) {
  var videos = [];
  for (var i = 0; i < db.videos.length; i++) {
    if (db.videos[i].userId === userId) {
      videos.push(db.videos[i]);
    }
  }
  // If no filter passed, return all
  if (!field || !value) return videos;

  var result = [];
  for (var i = 0; i < videos.length; i++) {
    if (!(field in videos[i])) {
      throw new Error("Unknown field: " + field);
    }
    var vVal = videos[i][field];
    // If the value is a string, do a case-insensitive substring match
    if (typeof value === "string" && typeof vVal === "string") {
      if (vVal.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        result.push(videos[i]);
      }
    } else if (vVal === value) {
      // For non-string types (e.g., number), do a direct comparison
      result.push(videos[i]);
    }
  }
  return result;
}

// ---------------------------
// Analytics
// ---------------------------

// Returns summary statistics about a user’s channel:
// total views, average likes, engagement rate, etc.
function getChannelStats(userId) {
  var user = null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  var videos = [];
  for (var i = 0; i < db.videos.length; i++) {
    if (db.videos[i].userId === userId) {
      videos.push(db.videos[i]);
    }
  }

  // Before calculating, try to release any scheduled videos if their time is up
  for (var i = 0; i < videos.length; i++) {
    releaseScheduledVideo(videos[i]);
  }

  var totalViews = 0,
    totalLikes = 0,
    totalComments = 0;
  for (var i = 0; i < videos.length; i++) {
    totalViews += videos[i].views;
    totalLikes += videos[i].likes;
    totalComments += videos[i].comments;
  }
  var count = videos.length;

  return {
    channelName: user.channelName,
    totalVideos: count,
    totalViews: totalViews,
    totalLikes: totalLikes,
    totalComments: totalComments,
    averageViews: count ? Math.round(totalViews / count) : 0,
    averageLikes: count ? Math.round(totalLikes / count) : 0,
    // Engagement = (likes + comments) / totalViews
    engagementRate:
      count && totalViews
        ? (((totalLikes + totalComments) / totalViews) * 100).toFixed(2) + "%"
        : "0.00%",
  };
}

// ---------------------------
// Watch / Recommendations Functions
// ---------------------------

// Returns the full watch history for a user (with watchedAt timestamps)
function getWatchHistory(userId) {
  var user = null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  var history = [];
  for (var i = 0; i < user.watchHistory.length; i++) {
    var h = user.watchHistory[i];
    for (var j = 0; j < db.videos.length; j++) {
      if (db.videos[j].id === h.videoId) {
        // Use Object.assign to clone the video object so we can safely add watchedAt
        var v = Object.assign({}, db.videos[j]);
        v.watchedAt = h.watchedAt;
        history.push(v);
        break;
      }
    }
  }
  return history;
}

// Simulates a user watching a video.
// Also handles “releasing” a scheduled video if its time has come.
function watchVideo(userId, videoId) {
  var user = null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  var video = null;
  for (var i = 0; i < db.videos.length; i++) {
    if (db.videos[i].id === videoId) video = db.videos[i];
  }
  if (!video) throw new Error("Video with ID " + videoId + " not found");

  // Attempt to release video if it was scheduled
  releaseScheduledVideo(video);
  // If it's still scheduled, we disallow watching (not yet released)
  if (video.scheduledFor) throw new Error("Video not yet released");

  // Increment view count
  video.views++;
  // Record that user watched it, with ISO timestamp
  user.watchHistory.push({
    videoId: videoId,
    watchedAt: new Date().toISOString(),
  });
  return video;
}

// Recommends the “next” video for a user to watch based on their watch history
function recommendNext(userId) {
  var user = null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  // Count how many videos the user has watched per category
  var categoryCount = {};
  for (var i = 0; i < user.watchHistory.length; i++) {
    var h = user.watchHistory[i];
    for (var j = 0; j < db.videos.length; j++) {
      if (db.videos[j].id === h.videoId) {
        var v = db.videos[j];
        categoryCount[v.category] = (categoryCount[v.category] || 0) + 1;
        break;
      }
    }
  }

  // Determine which category is the user's “favorite” so far
  var preferredCategory = null;
  var maxCount = -1;
  for (var cat in categoryCount) {
    if (categoryCount[cat] > maxCount) {
      maxCount = categoryCount[cat];
      preferredCategory = cat;
    }
  }

  var now = new Date();
  // First try to recommend an unseen video in the preferred category
  if (preferredCategory) {
    var favCandidates = [];
    for (var i = 0; i < db.videos.length; i++) {
      var v = db.videos[i];
      // Conditions:
      // - Same category
      // - User has never watched it
      // - It's already released (or not scheduled)
      if (
        v.category === preferredCategory &&
        user.watchHistory.every(function (h) { return h.videoId !== v.id; }) &&
        (!v.scheduledFor || new Date(v.scheduledFor) <= now)
      ) {
        favCandidates.push(v);
      }
    }
    if (favCandidates.length > 0) {
      // Pick a random video among the candidates
      return favCandidates[Math.floor(Math.random() * favCandidates.length)];
    }
  }

  // Otherwise, fallback: pick any unseen video that is already released
  var unseen = [];
  for (var i = 0; i < db.videos.length; i++) {
    var v = db.videos[i];
    if (
      user.watchHistory.every(function (h) { return h.videoId !== v.id; }) &&
      (!v.scheduledFor || new Date(v.scheduledFor) <= now)
    ) {
      unseen.push(v);
    }
  }
  if (unseen.length === 0) {
    // No more recommendable videos
    return null;
  }
  return unseen[Math.floor(Math.random() * unseen.length)];
}

// ---------------------------
// Getter Functions
// ---------------------------

// Returns a simplified list of all users (just id, username, channel)
function listAllUsers() {
  var result = [];
  for (var i = 0; i < db.users.length; i++) {
    result.push({
      id: db.users[i].id,
      username: db.users[i].username,
      channelName: db.users[i].channelName,
    });
  }
  return result;
}

// Returns full user object by userId
function listUserByID(userId) {
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) return db.users[i];
  }
  return null;
}

// Returns all distinct video categories in the system
function listCategories() {
  var categories = [];
  for (var i = 0; i < db.videos.length; i++) {
    var cat = db.videos[i].category;
    if (cat && categories.indexOf(cat) === -1) {
      categories.push(cat);
    }
  }
  return categories;
}

// Returns the categories a particular user has used for their videos
function listUserCategories(userId) {
  var user = null;
  for (var i = 0; i < db.users.length; i++) {
    if (db.users[i].id === userId) user = db.users[i];
  }
  if (!user) throw new Error("User with ID " + userId + " not found");

  var categories = [];
  for (var i = 0; i < db.videos.length; i++) {
    var v = db.videos[i];
    if (v.userId === userId && v.category && categories.indexOf(v.category) === -1) {
      categories.push(v.category);
    }
  }
  return categories;
}

module.exports = {
  addUser,
  updateUsername,
  updateChannelName,
  createDraftVideo,
  publishVideo,
  scheduleVideo,
  findUserVideos,
  getChannelStats,
  getWatchHistory,
  watchVideo,
  recommendNext,
  listAllUsers,
  listUserByID,
  listCategories,
  listUserCategories,
  _db: db, 
};
