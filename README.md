# blockchain-application
Here's a comprehensive `README.md` file for your Diploma Registry DApp:

```markdown
# Diploma Registry DApp

A blockchain-based application for issuing and verifying academic diplomas using Ethereum smart contracts.

## Features
- **Admin Panel**: Issue diplomas to student addresses
- **Student Verification**: Search for diplomas by Ethereum address
- **Decentralized**: Built on Ethereum blockchain
- **MetaMask Integration**: Secure wallet connection

## Prerequisites
- Node.js (v16+)
- Ganache (for local development)
- MetaMask browser extension
- Truffle Suite (`npm install -g truffle`)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Assia-Aissa/blockchain-application
   cd diploma-registry-dapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
1. **Ganache Setup**:
   - Download and run Ganache
   - Create new workspace or use Quick Start
   - Note the RPC Server URL (usually `http://127.0.0.1:7545`)

2. **MetaMask Configuration**:
   - Add Custom Network:
     ```
     Network Name: Ganache Local
     New RPC URL: http://127.0.0.1:7545
     Chain ID: 1337
     Currency Symbol: ETH
     ```
   - Import accounts from Ganache using private keys

## Deployment
1. Compile and migrate contracts:
   ```bash
   truffle compile
   truffle migrate --reset --network development
   ```

2. Update frontend configuration:
   - Copy the contract address from migration output
   - Paste in `app.js`:
     ```javascript
     const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
     ```

## Running the Application
Start the development server:
```bash
npm run dev
```

## Usage
### Admin Functions
1. Connect MetaMask (using admin account)
2. Add diplomas via the form:
   - Student Address
   - Student Name
   - Degree
   - University
   - Date (Unix timestamp)

## License
MIT License


```
