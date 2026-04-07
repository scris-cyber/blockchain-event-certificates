// Configuración básica para conectar contrato 
const addressContrato = "0x..."; // Pasarlo luego
const abi = [
    "function claimCertificate(string memory code, string memory uri) public"
];

// Función para conexión a MetaMask a la página
async function conectar() {
    if (window.ethereum) {
        // Pedir permiso al usuario para usar su wallet
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        document.getElementById("status").innerText = "¡Conectado!";
        console.log("Wallet lista");
    } else {
        alert("Instalar MetaMask en el navegador");
    }
}

// Función para reclamar el NFT usando el código sugerido
async function reclamarNFT() {
    const elCodigo = document.getElementById("claimCode").value;
    
    if(!elCodigo) {
        alert("Escribir el código de reclamo primero");
        return;
    }

    try {
        // cuando se despliegue el contrato seria en esta parte
        alert("Enviando transacción... revisa tu MetaMask");
    } catch (err) {
        alert("Algo salió mal con el reclamo");
    }
}

// Conectar botones
document.getElementById("connectButton").onclick = conectar;
document.getElementById("mintButton").onclick = reclamarNFT;
