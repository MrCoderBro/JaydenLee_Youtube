# Assignment 1: YouTube-Like Module

This repository contains a small in-memory Node.js module that simulates basic YouTube-like behaviour: users, videos, watch history, scheduling, simple recommendations and analytics.

---

## What's Included

- **`Jayden_Youtube.js`** — the core module 
- **`app.js`** — a demo script showing typical usage

---

## Quick Start

### 1. Clone the Repository

```powershell
git clone https://github.com/MrCoderBro/JaydenLee_Youtube.git
cd JaydenLee_Youtube
```

### 2. Run the Demo(Ensure that you are in the correct directory named "JaydenLee_Youtube")
From the project folder:

```powershell
node app.js
```

The demo prints examples of:
- Creating users
- Creating/publishing/scheduling videos
- Watching videos
- Recommendations and analytics
- Scheduled video release behavior

### 3. Try the Module by making your own script
Create a new script that requires the module (see examples below).

---

## Using the Module

### Basic Require(You MUST include this in your script)

```javascript
const yt = require('./Jayden_Youtube.js');
```

### Quick Example

```javascript
// Add a user
const alice = yt.addUser('Alice', "Alice's Vlogs");

// Create a draft video and publish it
const v = yt.createDraftVideo(alice.id, 'My First Adventure', 'Exploring the city', 'Travel');
yt.publishVideo(alice.id, v.id);

// Watch the video
yt.watchVideo(alice.id, v.id);

// Get analytics
console.log(yt.getChannelStats(alice.id));
```

---

## Function Reference

### User Management Functions

#### `addUser(username, channelName)`
- **Description:** Create a new user.  
- **Parameters:** `username` (string), `channelName` (string)  
- **Returns:** User object `{ id, username, channelName, watchHistory, videos }`
- **Errors:** `Error("Username and channel name are required")` if missing

**Example:**
```javascript
const u = yt.addUser('Bob', "Bob's DIY");
```

---

#### `updateUsername(userId, newUsername)`
- **Description:** Change a user's username.  
- **Parameters:** `userId` (number), `newUsername` (string)  
- **Returns:** Updated user object
- **Errors:** 
  - `Error("New username must not be empty")` if empty
  - `Error("User with ID <id> not found")` if user missing

**Example:**
```javascript
yt.updateUsername(u.id, 'BobTheBuilder');
```

---

#### `updateChannelName(userId, newChannelName)`
- **Description:** Change a user's channel name.  
- **Parameters:** `userId` (number), `newChannelName` (string)  
- **Returns:** Updated user object
- **Errors:** 
  - `Error("New channel name must not be empty")` if empty
  - `Error("User with ID <id> not found")` if user missing

**Example:**
```javascript
yt.updateChannelName(u.id, 'Bob Builds Stuff');
```

---

### Video Management Functions

#### `createDraftVideo(userId, title, description, category, isPublic?)`
- **Description:** Create a draft video (not yet published).  
- **Parameters:** 
  - `userId` (number)
  - `title` (string, required)
  - `description` (string)
  - `category` (string)
  - `isPublic` (boolean, optional, defaults to `true`)
- **Returns:** Video object
- **Errors:** 
  - `Error("Title is required")` if title missing
  - `Error("User with ID <id> not found")` if user missing

**Example:**
```javascript
const vid = yt.createDraftVideo(alice.id, 'Cooking 101', 'Easy pasta', 'Cooking');
```

---

#### `publishVideo(userId, videoId)`
- **Description:** Publish a draft immediately with initial stats.  
- **Parameters:** `userId` (number), `videoId` (number)  
- **Returns:** Published video object (with `uploadDate`, `views`, `likes`, `comments`)
- **Errors:** 
  - `Error("User with ID <id> not found")` if user missing
  - `Error("Video with ID <id> not found for this user")` if video not found
  - `Error("Video already published")` if already published

**Example:**
```javascript
yt.publishVideo(alice.id, vid.id);
```

---

---

#### `scheduleVideo(videoId, year, month, day, hour?, minute?, second?)`
- **Description:** Schedule a video for future release. Months are 1-based (January = 1). Date must be in future.  
- **Parameters:** `videoId` (number), `year` (number), `month` (number), `day` (number), `hour?`, `minute?`, `second?`  
- **Returns:** Updated video object (with `scheduledFor` set)
- **Errors:** 
  - `Error("Video with ID <id> not found")` if not found
  - `Error("Scheduled date must be in the future")` if not future

**Example:**
```javascript
const now = new Date(Date.now() + 60 * 1000);
yt.scheduleVideo(vid.id, now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
```

---

### Query & Filter Functions

#### `findUserVideos(userId, field?, value?)`
- **Description:** Get a user's videos, optionally filtered.  
- **Parameters:** `userId` (number), `field?` (string), `value?` (string/value)  
- **Returns:** Array of video objects (possibly empty)
- **Errors:** `Error("Unknown field: <field>")` if field doesn't exist

**Example:**
```javascript
yt.findUserVideos(alice.id, 'category', 'Cooking');
```

---

### Analytics Functions

#### `getChannelStats(userId)`
- **Description:** Compute totals and averages for a channel.  
- **Parameters:** `userId` (number)  
- **Returns:** Stats object `{ channelName, totalVideos, totalViews, totalLikes, totalComments, averageViews, averageLikes, engagementRate }`
- **Errors:** `Error("User with ID <id> not found")` if user missing

**Example:**
```javascript
console.log(yt.getChannelStats(alice.id));
```

---

#### `getWatchHistory(userId)`
- **Description:** Get a user's watch history with timestamps.  
- **Parameters:** `userId` (number)  
- **Returns:** Array of video objects (with `watchedAt` added)
- **Errors:** `Error("User with ID <id> not found")` if user missing

**Example:**
```javascript
console.log(yt.getWatchHistory(alice.id));
```

---

### Watch & Recommendation Functions

#### `watchVideo(userId, videoId)`
- **Description:** Simulate watching a video. Increments views and stores watch event. Releases scheduled videos if time has arrived.  
- **Parameters:** `userId` (number), `videoId` (number)  
- **Returns:** Updated video object
- **Errors:** 
  - `Error("User with ID <id> not found")` if user missing
  - `Error("Video with ID <id> not found")` if video missing
  - `Error("Video not yet released")` if still scheduled

**Example:**
```javascript
yt.watchVideo(alice.id, vid.id);
```

---

#### `recommendNext(userId)`
- **Description:** Recommend next video based on watch history. Prefers user's favorite category, falls back to random.  
- **Parameters:** `userId` (number)  
- **Returns:** Video object or `null` if no unseen/releasable video
- **Errors:** `Error("User with ID <id> not found")` if user missing

**Example:**
```javascript
console.log(yt.recommendNext(alice.id));
```

---

### Listing Functions

#### `listAllUsers()`
- **Description:** List all users (basic info).  
- **Returns:** Array of user objects `{ id, username, channelName }`

#### `listUserByID(userId)`
- **Description:** Get a user by ID.  
- **Parameters:** `userId` (number)  
- **Returns:** User object or `null` if not found

#### `listCategories()`
- **Description:** List all categories in the system.  
- **Returns:** Array of category strings

#### `listUserCategories(userId)`
- **Description:** List categories for a specific user.  
- **Parameters:** `userId` (number)  
- **Returns:** Array of category strings
- **Errors:** `Error("User with ID <id> not found")` if user missing

---

## Notes & Tips

- **Scheduling Timezone:** Uses JavaScript `Date` objects. Default timezone is UTC.

---

## References

Website Referenced: "https://youtube.com/"