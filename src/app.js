// Contract ABI (keep the same)
const contractABI = [...]; // Your existing ABI

// Updated contract address from migration
const contractAddress = "0xe6f8457167Ea1F3564F6642042EdfD93adbC4a4c";

let web3;
let contract;

// Initialize the application
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            initContract();
            async function checkAdmin() {
                const adminAddress = await contract.methods.admin().call();
                const currentAccount = window.ethereum.selectedAddress;
                
                if (currentAccount.toLowerCase() === adminAddress.toLowerCase()) {
                    document.getElementById('adminPanel').style.display = 'block';
                } else {
                    document.getElementById('adminPanel').style.display = 'none';
                }
            }
            updateUI();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert('Please install MetaMask!');
    }
    
    // Event listeners
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('diplomaForm').addEventListener('submit', addDiploma);
    document.getElementById('searchBtn').addEventListener('click', searchDiplomas);
});

// Connect wallet function
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            initContract();
            updateUI();
        } catch (error) {
            console.error("User denied account access");
        }
    }
}

// Initialize contract
function initContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

// Update UI
function updateUI() {
    const currentAccount = window.ethereum.selectedAddress;
    if (currentAccount) {
        document.getElementById('connectWallet').innerHTML = 
            `<i class="fas fa-wallet me-2"></i>Connected: ${currentAccount.substring(0, 6)}...`;
        document.getElementById('connectWallet').classList.add('btn-success');
    }
}

// Add diploma function (updated)
async function addDiploma(e) {
    e.preventDefault();
    
    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }
    
    const studentAddress = document.getElementById('studentAddress').value;
    const studentName = document.getElementById('studentName').value;
    const degree = document.getElementById('degree').value;
    const university = document.getElementById('university').value;
    const date = document.getElementById('date').value;
    
    try {
        document.getElementById('addDiplomaBtn').disabled = true;
        document.getElementById('addDiplomaBtn').innerHTML = 
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        
        const currentAccount = window.ethereum.selectedAddress;
        await contract.methods.addDiploma(
            studentAddress,
            studentName,
            degree,
            university,
            date
        ).send({ from: currentAccount });
        
        alert('Diploma added successfully!');
        document.getElementById('diplomaForm').reset();
    } catch (error) {
        console.error(error);
        alert('Error adding diploma: ' + error.message);
    } finally {
        document.getElementById('addDiplomaBtn').disabled = false;
        document.getElementById('addDiplomaBtn').innerHTML = 
            '<i class="fas fa-plus-circle me-2"></i>Add Diploma';
    }
}

// Search diplomas function (keep existing implementation)
async function searchDiplomas() { ... }