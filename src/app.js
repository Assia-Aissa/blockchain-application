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

const contractAddress = "0xdeeCc5Ab359B0E699ACFF3b19366Ed50101f51e5";
let web3;
let contract;
let accounts;

// Initialize the dApp
async function init() {
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Get accounts
            accounts = await web3.eth.getAccounts();
            document.getElementById('walletInfo').textContent = 
                `Connecté: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            
            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Check if admin
            const admin = await contract.methods.admin().call();
            if (accounts[0].toLowerCase() === admin.toLowerCase()) {
                document.getElementById('adminPanel').style.display = "block";
            }
            
            document.getElementById("connectWallet").innerHTML = 
                '<i class="fas fa-check me-2"></i>Connecté';
                
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Erreur de connexion à MetaMask");
        }
    } else {
        alert("Veuillez installer MetaMask pour utiliser cette application!");
    }
}

// Add diploma
async function addDiploma(event) {
    event.preventDefault();
    
    try {
        const studentAddress = document.getElementById("studentAddress").value;
        const studentName = document.getElementById("studentName").value;
        const degree = document.getElementById("degree").value;
        const year = document.getElementById("year").value;
        
        // Validate address
        if (!web3.utils.isAddress(studentAddress)) {
            throw new Error("Adresse Ethereum invalide");
        }
        
        // Show loading state
        const btn = document.getElementById("addDiplomaBtn");
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>En cours...';
        
        // Send transaction
        await contract.methods.ajouterDiplome(
            studentAddress,
            studentName,
            degree,
            year
        ).send({ from: accounts[0] });
        
        // Reset form
        document.getElementById("diplomaForm").reset();
        alert("Diplôme ajouté avec succès!");
        
    } catch (error) {
        console.error("Error adding diploma:", error);
        alert(`Erreur: ${error.message}`);
    } finally {
        // Reset button state
        const btn = document.getElementById("addDiplomaBtn");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Ajouter un diplôme';
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