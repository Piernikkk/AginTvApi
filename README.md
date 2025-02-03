# AginTvApi

AginTvApi is a Node.js and TypeScript-based backend server for a video hosting platform. It provides endpoints for uploading, streaming, and managing video content, as well as user authentication and authorization.

## Features

- **User Authentication**: Secure user registration, login, and logout functionality.
- **Video Upload**: Upload video files with metadata validation.
- **Video Streaming**: Stream video files with support for range requests.
- **Movie and Episode Management**: Fetch and manage movie and episode details from TMDB.
- **Continue Watching**: Track and retrieve the user's last watched position for each episode.
- **Collections**: Manage user-specific collections of movies.

## Endpoints

- **/movies**: Get movie details, refresh movie data from TMDB.
- **/movies/:movieID/episodes**: Get episode details, update watch position.
- **/files/upload**: Upload video files.
- **/files/stream/:fileID**: Stream video files.
- **/user**: User registration, login, and logout.
- **/collections/system/:collectionID**: Manage user-specific collections.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/AginTvApi.git
   cd AginTvApi
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a file with the following variables:

   ```env
   DATABASE_URI=mongodb://localhost:27017/aginTV
   TMDB_KEY=your_tmdb_api_key
   PORT=42070
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Build and start the production server:
   ```sh
   npm run build
   npm start
   ```
