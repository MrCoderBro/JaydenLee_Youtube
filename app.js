const yt = require("./Jayden_Youtube.js"); 

console.log("==== DEMO: YouTube Module ====\n");

// -------------------------
// Users
// -------------------------
console.log("---- Users ----");

// Add new users
const alice = yt.addUser("Alice", "Alice's Vlogs");
const bob = yt.addUser("Bob", "Bob's DIY");
console.log("Added users:", yt.listAllUsers());

// Update user info
yt.updateUsername(alice.id, "AliceWonder");
yt.updateChannelName(bob.id, "BobBuilds");
console.log("Updated Alice:", yt.listUserByID(alice.id));
console.log("Updated Bob:", yt.listUserByID(bob.id));

// -------------------------
// Videos
// -------------------------
console.log("\n---- Videos ----");

// Create draft videos
const video1 = yt.createDraftVideo(alice.id, "My First Adventure", "Exploring the city", "Travel");
const video2 = yt.createDraftVideo(bob.id, "Building a Treehouse", "Step by step DIY", "DIY");
const video3 = yt.createDraftVideo(alice.id, "Cooking 101", "Simple pasta recipe", "Cooking");

console.log("Draft videos created:");
console.log(yt.findUserVideos(alice.id));
console.log(yt.findUserVideos(bob.id));

// Publish a video immediately
yt.publishVideo(alice.id, video1.id);
console.log("Alice published video:", yt.findUserVideos(alice.id));

// Schedule a video slightly in the future
const now = new Date();
const future = new Date(now.getTime() + 60 * 1000); // 1 minute later
yt.scheduleVideo(
  video2.id,
  future.getFullYear(),
  future.getMonth() + 1,
  future.getDate(),
  future.getHours(),
  future.getMinutes(),
  future.getSeconds()
);
console.log("Bob's scheduled video:", yt.findUserVideos(bob.id));

// Delete a video
yt.deleteVideoById(video3.id);
console.log("Alice's videos after deletion:", yt.findUserVideos(alice.id));

// -------------------------
// Watch History & Recommendations
// -------------------------
console.log("\n---- Watch History & Recommendations ----");

// Alice watches her own video
yt.watchVideo(alice.id, video1.id);
console.log("Alice's watch history:", yt.getWatchHistory(alice.id));

// Recommend next video for Alice (scheduled videos may not be available yet)
console.log("Next video recommended for Alice:", yt.recommendNext(alice.id));
console.log("Next video recommended for Bob:", yt.recommendNext(bob.id));

// -------------------------
// Analytics
// -------------------------
console.log("\n---- Analytics ----");
console.log("Alice's channel stats:", yt.getChannelStats(alice.id));
console.log("Bob's channel stats:", yt.getChannelStats(bob.id));

// -------------------------
// Categories
// -------------------------
console.log("\n---- Categories ----");
console.log("All categories in system:", yt.listCategories());
console.log("Alice's categories:", yt.listUserCategories(alice.id));
console.log("Bob's categories:", yt.listUserCategories(bob.id));

// -------------------------
// Edge case: releasing scheduled videos
// -------------------------
console.log("\n---- Releasing Scheduled Videos ----");
const nowVideo = yt.createDraftVideo(bob.id, "Bob's Today DIY", "Quick DIY today", "DIY");

// Schedule 5 seconds in the future (IN UTC TIME)
const shortFuture = new Date(Date.now() + 5 * 1000);
yt.scheduleVideo(
  nowVideo.id,
  shortFuture.getFullYear(),
  shortFuture.getMonth() + 1,
  shortFuture.getDate(),
  shortFuture.getHours(),
  shortFuture.getMinutes(),
  shortFuture.getSeconds()
);

console.log("Before watching scheduled video:", yt.findUserVideos(bob.id));

// Wait until the video is releaseable 
setTimeout(() => {
  try {
    yt.watchVideo(alice.id, nowVideo.id);
    console.log("Watched scheduled video:", nowVideo);
  } catch (e) {
    console.log("Error watching scheduled video:", e.message);
  }

  console.log("\n==== DEMO COMPLETE ====");
}, 6000);
