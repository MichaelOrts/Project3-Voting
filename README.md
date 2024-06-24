# Crypto Consensus

Crypto Consensus is a decentralized voting application built using Solidity, Hardhat, and Next.js. It allows the contract owner to register voters, voters to submit proposals, and participants to vote on these proposals.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version 14 or later)
- **npm** or **yarn**
- **MetaMask** (or any other Ethereum wallet)

## Installation

Follow these steps to install and set up the project locally:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/MichaelOrts/Project3-Voting.git
    cd Project3-Voting
    ```

2. **Install Dependencies**

    ```bash
    # Using npm
    npm install

    # Or using yarn
    yarn install
    ```

3. **Install Hardhat**

    ```bash
    # Using npm
    npm install --save-dev hardhat

    # Or using yarn
    yarn add --dev hardhat
    ```

## Setup

1. **Create Environment Files**

    Create a `.env` file in the root directory of your project and add the following variables:

    ```env
    PRIVATE_KEY=your_private_key
    INFURA_PROJECT_ID=your_infura_project_id
    ```

2. **Compile the Contracts**

    Compile the smart contracts using Hardhat:

    ```bash
    npx hardhat compile
    ```

3. **Deploy the Contracts**

    Deploy the smart contracts to your local Hardhat network:

    ```bash
    npx hardhat node
    ```

    In a new terminal window, deploy the contracts:

    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

4. **Update Contract Address**

    Copy the deployed contract address and update the `frontend/constant/index.js` file:

    ```javascript
    export const contractAddress = "your_deployed_contract_address";
    export const contractAbi = [ /* ABI from your compiled contract */ ];
    ```

## Running the Project

1. **Start the Local Hardhat Node**

    If not already running, start the Hardhat node:

    ```bash
    npx hardhat node
    ```

2. **Run the Next.js Application**

    Start the Next.js application:

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

    The application should now be running on `http://localhost:3000`.

## Testing

To run the tests, use the following command:

```bash
npx hardhat test
```

Ensure that your contracts are compiled and the Hardhat node is running.

## Usage

1. **Connect MetaMask**

    * Open MetaMask and connect to the local Hardhat network (usually http://127.0.0.1:8545).

    * Import an account using one of the private keys provided by Hardhat.

2. **Interact with the DApp**

    * As the contract owner, you can register voters.
    * Registered voters can submit proposals.
    * Voters can vote on proposals once the voting session starts.
    

*If you encounter any issues, feel free to open an issue on the repository or consult the documentation for Hardhat and Next.js.*



