const ABI = [
  "function claimCertificate(uint256 eventId, string memory code, string memory tokenURI_) external returns (uint256)",
  "function hasClaimed(uint256 eventId, address attendee) external view returns (bool)",
  "function owner() external view returns (address)"
];

let provider;
let signer;
let contract;
let deployments;

async function loadConfig() {
  const response = await fetch("./config.json");
  if (!response.ok) {
    throw new Error("No se pudo cargar web/config.json");
  }
  deployments = await response.json();
}

function setStatus(message) {
  const el = document.getElementById("status");
  if (el) el.innerText = message;
}

function setResult(message) {
  const el = document.getElementById("result");
  if (el) el.innerText = message;
}

async function conectar() {
  if (!window.ethereum) {
    alert("Instale MetaMask en el navegador");
    return;
  }

  try {
    await loadConfig();

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    const deployment = deployments[String(chainId)];
    if (!deployment) {
      throw new Error(`No hay contrato configurado para chainId ${chainId}`);
    }

    contract = new ethers.Contract(deployment.contractAddress, ABI, signer);

    const address = await signer.getAddress();
    const owner = await contract.owner();

    setStatus(`Conectado: ${address} | Red: ${deployment.networkName}`);
    setResult(`Owner del contrato: ${owner}`);
    console.log("Wallet conectada:", address);
    console.log("Red detectada:", deployment.networkName);
    console.log("Contrato:", deployment.contractAddress);
  } catch (error) {
    console.error(error);
    alert("No se pudo conectar MetaMask o no existe configuración para esta red");
  }
}

async function reclamarCertificado() {
  const eventId = document.getElementById("eventId")?.value;
  const claimCode = document.getElementById("claimCode")?.value?.trim();
  const tokenURI = document.getElementById("tokenURI")?.value?.trim();

  if (eventId === "" || eventId === null || eventId === undefined) {
    alert("Indique el ID del evento");
    return;
  }

  if (!claimCode) {
    alert("Indique el claim code");
    return;
  }

  if (!tokenURI) {
    alert("Indique el token URI");
    return;
  }

  if (!contract || !signer) {
    alert("Primero conecte MetaMask");
    return;
  }

  try {
    setStatus("Enviando transacción de reclamo...");
    const tx = await contract.claimCertificate(Number(eventId), claimCode, tokenURI);
    const receipt = await tx.wait();

    setStatus("Certificado reclamado correctamente");
    setResult(`Transacción confirmada: ${receipt.hash}`);
  } catch (error) {
    console.error(error);
    alert("No se pudo reclamar el certificado");
  }
}

async function verificarReclamo() {
  const eventId = document.getElementById("eventId")?.value;

  if (eventId === "" || eventId === null || eventId === undefined) {
    alert("Indique el ID del evento");
    return;
  }

  if (!contract || !signer) {
    alert("Primero conecte MetaMask");
    return;
  }

  try {
    const address = await signer.getAddress();
    const claimed = await contract.hasClaimed(Number(eventId), address);

    setStatus("Consulta completada");
    setResult(
      claimed
        ? `La wallet ${address} YA reclamó el certificado del evento ${eventId}`
        : `La wallet ${address} NO ha reclamado el certificado del evento ${eventId}`
    );
  } catch (error) {
    console.error(error);
    alert("No se pudo verificar el reclamo");
  }
}

document.getElementById("connectButton")?.addEventListener("click", conectar);
document.getElementById("claimButton")?.addEventListener("click", reclamarCertificado);
document.getElementById("verifyButton")?.addEventListener("click", verificarReclamo);
