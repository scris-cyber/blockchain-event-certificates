import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const { ethers } = await hre.network.connect();

  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  const configPath = path.join(process.cwd(), "web", "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("No existe web/config.json. Primero haga el deploy.");
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const deployment = config[String(chainId)];

  if (!deployment?.contractAddress) {
    throw new Error(`No hay contractAddress en config.json para chainId ${chainId}`);
  }

  const contract = await ethers.getContractAt(
    "AttendanceCertificate",
    deployment.contractAddress
  );

  const eventName = "Charla Blockchain";
  const claimCode = "CODIGO-123";
  const codeHash = ethers.keccak256(ethers.toUtf8Bytes(claimCode));

  console.log("Usando contrato:", deployment.contractAddress);
  console.log("Chain ID:", chainId);
  console.log("Creando evento:", eventName);

  const tx1 = await contract.createEvent(eventName);
  await tx1.wait();

  console.log("Evento creado con ID 0");

  const tx2 = await contract.addClaimCode(0, codeHash);
  await tx2.wait();

  console.log("Claim code cargado correctamente");
  console.log("Claim code de prueba:", claimCode);
  console.log("Code hash:", codeHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
