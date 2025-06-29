const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_etudiant",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_nom",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_diplome",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_annee",
                "type": "uint256"
            }
        ],
        "name": "ajouterDiplome",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_etudiant",
                "type": "address"
            }
        ],
        "name": "consulterDiplome",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = "0x063390e763a4D7af5c73A17C5376b1baCa1F8801";
let web3;
let contract;
let accounts;

// Initialize the dApp
async function init() {
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Create Web3 instance with error handling
            web3 = new Web3(window.ethereum);
            
            // Verify connection
            try {
                await web3.eth.getChainId();
            } catch (rpcError) {
                console.error("RPC Connection failed:", rpcError);
                throw new Error("Cannot connect to blockchain. Is Ganache running?");
            }
            
            // Get accounts
            accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) throw new Error("No accounts found");
            
            // Initialize contract with increased timeout
            contract = new web3.eth.Contract(contractABI, contractAddress, {
                handleRevert: true,
                transactionConfirmationBlocks: 1,
                transactionPollingTimeout: 60000
            });
            
            // Rest of your init code...
            
        } catch (error) {
            console.error("Initialization error:", error);
            alert(`Connection failed: ${error.message}`);
            // Suggest reset actions
            if (error.message.includes("RPC")) {
                alert("Please:\n1. Restart Ganache\n2. Refresh page\n3. Try again");
            }
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Add diploma
async function addDiploma(event) {
    event.preventDefault();
    
    const btn = document.getElementById("addDiplomaBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

    try {
        // Get and validate form inputs
        const studentAddress = document.getElementById("studentAddress").value.trim();
        if (!web3.utils.isAddress(studentAddress)) {
            throw new Error("Invalid Ethereum address");
        }

        // Prepare transaction with conservative gas settings
        const tx = {
            from: accounts[0],
            to: contractAddress,
            data: contract.methods.ajouterDiplome(
                studentAddress,
                document.getElementById("studentName").value.trim(),
                document.getElementById("degree").value.trim(),
                document.getElementById("year").value.trim()
            ).encodeABI(),
            gas: 500000, // Increased gas limit
            gasPrice: web3.utils.toWei('20', 'gwei') // Explicit gas price
        };

        // Send raw transaction for better error handling
        const receipt = await web3.eth.sendTransaction(tx);
        
        console.log("Transaction successful:", receipt);
        alert("Diploma added successfully!");

    } catch (error) {
        console.error("Transaction error:", error);
        
        // Improved error parsing
        let errorMessage = "Transaction failed";
        if (error.message.includes("JSON-RPC")) {
            errorMessage = "Network connection failed. Please:\n1. Check Ganache is running\n2. Reset MetaMask connection";
        } else if (error.data) {
            errorMessage = error.data.message || error.message;
        }
        
        alert(`Error: ${errorMessage}`);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add Diploma';
    }
}
// Search diploma
async function searchDiploma() {
    try {
        const searchAddress = document.getElementById("searchAddress").value;
        
        if (!web3.utils.isAddress(searchAddress)) {
            throw new Error("Adresse Ethereum invalide");
        }
        
        // Show loading state
        const btn = document.getElementById("searchBtn");
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Recherche...';
        
        const result = await contract.methods.consulterDiplome(searchAddress).call();
        
        // Display result
        document.getElementById("diplomasList").innerHTML = `
            <div class="card diploma-card">
                <div class="card-body">
                    <h5 class="card-title">${result[0]}</h5>
                    <p class="card-text"><strong>Diplôme:</strong> ${result[1]}</p>
                    <p class="card-text"><strong>Année:</strong> ${new Date(result[2] * 1000).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        document.getElementById("diplomasList").innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${error.message.includes("invalid ENS name") ? 
                  "Aucun diplôme trouvé pour cette adresse" : 
                  error.message}
            </div>
        `;
    } finally {
        // Reset button state
        const btn = document.getElementById("searchBtn");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search me-2"></i>Rechercher';
    }
}

// Event listeners
document.getElementById("connectWallet").addEventListener("click", init);
document.getElementById("diplomaForm").addEventListener("submit", addDiploma);
document.getElementById("searchBtn").addEventListener("click", searchDiploma);

// Auto-connect if already authorized
window.addEventListener('load', async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
        await init();
    }
});