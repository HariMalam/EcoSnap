# EcoSnap Server Setup Instructions

## Introduction
EcoSnap is a web application designed to facilitate environmental activism by allowing users to report environmental issues through photo uploads. This repository contains the necessary scripts and configuration files to set up and manage the EcoSnap server.

## Prerequisites
Before setting up the EcoSnap server, ensure the following prerequisites are met:


### Windows 11/10

#### Node.js Installation
1. **Download Node.js**:
    - Visit the [official Node.js website](https://nodejs.org/).
    - Choose the Windows Installer option to download the Node.js installer.
    - Run the installer and follow the installation wizard to complete the installation process.

2. **Verify Installation**:
    - After installation, open Command Prompt and run the following commands to verify that Node.js and npm were installed successfully:
        ```
        node --version
        npm --version
        ```

#### MongoDB Installation
1. **Download MongoDB**:
    - Visit the [official MongoDB website](https://www.mongodb.com/try/download/community).
    - Choose Windows as the platform and download the MongoDB installer.
    - Follow the installation wizard to complete the installation process.
    
2. **Start MongoDB**:
    - After installation, MongoDB should start automatically as a Windows service. If not, you can manually start it by searching for "Services" in the Start menu, locating "MongoDB Server" in the list of services, and clicking "Start".

3. **Verify MongoDB Installation**:
    - Open Command Prompt and run the following command to verify MongoDB installation:
        ```
        mongo --version
        ```


### Linux (Kali Linux)  

#### Node.js Installation
1. **Install Node.js**:
    - You can install Node.js on Kali Linux using the NodeSource repository. First, run the following commands to install Node.js:
        ```
        sudo apt update
        sudo apt install -y curl dirmngr apt-transport-https lsb-release ca-certificates
        curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
        sudo apt-get install -y nodejs
        ```
    - This will install both Node.js and npm (Node Package Manager).

2. **Verify Installation**:
    - To verify that Node.js and npm were successfully installed, run the following commands:
        ```
        node --version
        npm --version
        ```

#### MongoDB Installation
1. **Download MongoDB**:
    - Visit the [official MongoDB website](https://www.mongodb.com/try/download/community).
    - Select Linux as the platform and choose the appropriate version for your system.
    - Alternatively, you can use the following commands to download MongoDB on Kali Linux:
        ```
        wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        ```
2. **Start MongoDB**:
    ```
    sudo systemctl start mongod
    ```
3. **Enable MongoDB** (Optional: To start MongoDB automatically on system boot):
    ```
    sudo systemctl enable mongod
    ```



## Installation
1. Clone this repository to your local machine:
    ```
    git clone https://github.com/HariMalam/EcoSnap.git
    ```

2. Navigate to the project directory:
    ```
    cd EcoSnap
    ```

3. Ensure the necessary Node.js dependencies are installed:
    ```
    npm install
    ```

4. Open Visual Sudio Code:
    ```
    code .
    ```


5. Create a `.env` file in the project root directory and configure the following environment variables:
    ```
    MONGODB_URI=your_mongodb_uri
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=your_google_callback_url
    ```

6. Start the EcoSnap server:
    ```
    npm start
    ```

## Usage
- The EcoSnap server will be accessible at http://localhost:5000 after starting.
- Users can sign in with their Google account to access the platform.
- They can upload images of environmental issues, provide descriptions, and view their upload history.
- Server logs are written to the console.

## Troubleshooting
- If you encounter any issues during setup or usage, feel free to create an issue in the GitHub repository for assistance.

## Credits
This project was developed by Malam Hari. Contributions are welcome through bug reports, feature requests, or pull requests.

## License
This project is licensed under the [MIT License](LICENSE).
