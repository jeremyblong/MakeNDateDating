# MakeNDate — Full Stack Social Dating Platform 💘

**MakeNDate** is a next-generation, feature-packed **social dating platform** built with the **MERN stack**. Unlike traditional apps, MakeNDate offers a gamified, community-driven experience that blends real-time interaction, meetups, mentorship, and live streaming — all in one cohesive ecosystem.

🎥 [Watch Promo Video](https://youtu.be/SCp0Cyiozx8)

---

## 🚀 Features

- 🎯 **Social-Style Matchmaking**
  - Explore profiles with social feeds, followers, and updates.
  - "Bachelorette-style" games for unique group dating dynamics.

- 💬 **Real-Time Communication**
  - 1-on-1 messaging with chat history
  - Group threads and random pairings
  - WebRTC-powered **video chats**

- 📍 **Meetup Coordination**
  - Propose, join, or coordinate real-life meetups
  - Integrated maps and scheduling tools

- 🧠 **Mentorship Services**
  - Monetized coaching, relationship advice, and expert sessions
  - Stripe-powered onboarding for mentors

- 🎁 **Gamified Engagement**
  - Scratch-off rewards for in-game bonuses
  - Achievement badges and tiered unlockables

- 📡 **Live Streaming Integration**
  - Go live, chat with viewers, and receive in-app donations
  - Stream moderation and access controls

- 🧠 **Smart Matching Algorithm**
  - Compatibility scores based on engagement, interests, and swipe patterns

---

## 🛠 Tech Stack

| Layer        | Tech Used                     |
|--------------|-------------------------------|
| Frontend     | React Native (Expo), Redux    |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB (Mongoose)            |
| Real-Time    | Socket.io, WebRTC             |
| Payments     | Stripe API                    |
| Misc.        | Cron Jobs, Cloud Uploads, REST APIs |

---

## 📦 Installation (Dev Setup)

```bash
# Clone the repository
git clone https://github.com/jeremyblong/MakeNDateDating.git

# Backend setup
cd MakeNDate/server
npm install (might need to use --legacy-peer-deps)
npm run dev

# Frontend setup
cd ../client
npm install (might need to use --legacy-peer-deps)
npm start (start with xcode for iOS but ensure the metro is running)
