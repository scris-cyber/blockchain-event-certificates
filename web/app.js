const CONTRACT_ADDRESS = "PEGUE_AQUI_LA_DIRECCION_DEL_CONTRATO";

const ABI = [
  "function createEvent(string memory name) external returns (uint256)",
  "function registerAttendance(uint256 eventId, address attendee) external",
  "function verifyAttendance(uint256 eventId, address attendee) external view returns (bool)",
  "function closeEvent(uint256 eventId) external",
  "function owner() external view returns (address)"
];

let provider;
let signer;
let contract;

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
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const address = await signer.getAddress();
    const owner = await contract.owner();

    setStatus(`Conectado: ${address}`);
    setResult(`Owner del contrato: ${owner}`);

    console.log("Wallet conectada:", address);
    console.log("Owner del contrato:", owner);
  } catch (error) {
    console.error(error);
    alert("No se pudo conectar MetaMask");
  }
}

async function crearEvento() {
  const nombre = document.getElementById("eventName")?.value?.trim();

  if (!nombre) {
    alert("Escriba el nombre del evento");
    return;
  }

  if (!contract) {
    alert("Primero conecte MetaMask");
    return;
  }

  try {
    setStatus("Creando evento...");
    const tx = await contract.createEvent(nombre);
    await tx.wait();

    setStatus("Evento creado correctamente");
    setResult(`Evento creado: ${nombre}`);
  } catch (error) {
    console.error(error);
    alert("No se pudo crear el evento");
  }
}

async function registrarAsistencia() {
  const eventId = document.getElementById("eventId")?.value;
  let attendee = document.getElementById("attendeeAddress")?.value?.trim();

  if (eventId === "" || eventId === null || eventId === undefined) {
    alert("Indique el ID del evento");
    return;
  }

  if (!contract || !signer) {
    alert("Primero conecte MetaMask");
    return;
  }

  try {
    if (!attendee) {
      attendee = await signer.getAddress();
    }

    setStatus("Registrando asistencia...");
    const tx = await contract.registerAttendance(Number(eventId), attendee);
    await tx.wait();

    setStatus("Asistencia registrada");
    setResult(`Asistencia registrada para ${attendee} en el evento ${eventId}`);
  } catch (error) {
    console.error(error);
    alert("No se pudo registrar la asistencia");
  }
}

async function verificarAsistencia() {
  const eventId = document.getElementById("eventId")?.value;
  let attendee = document.getElementById("attendeeAddress")?.value?.trim();

  if (eventId === "" || eventId === null || eventId === undefined) {
    alert("Indique el ID del evento");
    return;
  }

  if (!contract || !signer) {
    alert("Primero conecte MetaMask");
    return;
  }

  try {
    if (!attendee) {
      attendee = await signer.getAddress();
    }

    const asistio = await contract.verifyAttendance(Number(eventId), attendee);

    setStatus("Consulta completada");
    setResult(
      asistio
        ? `La dirección ${attendee} SÍ está registrada en el evento ${eventId}`
        : `La dirección ${attendee} NO está registrada en el evento ${eventId}`
    );
  } catch (error) {
    console.error(error);
    alert("No se pudo verificar la asistencia");
  }
}

async function cerrarEvento() {
  const eventId = document.getElementById("eventId")?.value;

  if (eventId === "" || eventId === null || eventId === undefined) {
    alert("Indique el ID del evento");
    return;
  }

  if (!contract) {
    alert("Primero conecte MetaMask");
    return;
  }

  try {
    setStatus("Cerrando evento...");
    const tx = await contract.closeEvent(Number(eventId));
    await tx.wait();

    setStatus("Evento cerrado");
    setResult(`Evento ${eventId} cerrado correctamente`);
  } catch (error) {
    console.error(error);
    alert("No se pudo cerrar el evento");
  }
}

document.getElementById("connectButton")?.addEventListener("click", conectar);
document.getElementById("createButton")?.addEventListener("click", crearEvento);
document.getElementById("registerButton")?.addEventListener("click", registrarAsistencia);
document.getElementById("verifyButton")?.addEventListener("click", verificarAsistencia);
document.getElementById("closeButton")?.addEventListener("click", cerrarEvento);
