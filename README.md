# Buzzy: Table of Contents

- [Link to Live Site](#link-to-live-site)
- [Description](#description)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)

<br>

## Link to Live Site

[Buzzy](https://buzzy-mc58.onrender.com/)

## Description

Buzzy is an event planning site with a social media flare. Users can create, view, and edit events and images. Users can view their events and images on a user profile.

## Technologies

### Frameworks, Platforms and Libraries:
<p float="left">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain-wordmark.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain-wordmark.svg" style="width:75px;" />
</p>

### Database:
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-plain.svg" style="width:75px;" />

### Other:
<p float="left">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original-wordmark.svg" style="width:75px;" />
</p>

<br>

## Features

- The landing page displays public events
- Users can sign up for an account
- Users can log into existing accounts
- Authenticated users can add their own events
- Authenticated users can add their own images
- Authenticated users can manage events they own by making updates and/or deleting
- Authenticated users can manage images they own by making updates and/or deleting
- Authenticated users can invite other users to events they own
- Authenticated users can add tags to events they own
- Authenticated users can manage tags of events they own by making updates and/or deleting
- Authenticated users can manage guests of events they own by deleting
- Authenticated users can view their events on their user profile
- Authenticated users can view their images on their user profile

## Installation

   ### 1. Clone the repository
      ```sh
      git clone https://github.com/h-guertler/Buzzy.git
      cd Buzzy
      ```
   ### 2. Install npm dependencies
      ```sh
      npm install
      ```
   ### 3. Copy the environment variables to .env and change the values
      ``` sh
      cp .env.example .env
      ```
   ### 4. Initialize the database
      ``` sh
      pipenv shell
      flask db upgrade
      flask seed all
      flask run
      ```
   ### 5. Run the dev server
      ```sh
      npm run start
      ```
   ### 6. Open the app in your browser

      Visit http://localhost:3000 in your browser.

<br>
