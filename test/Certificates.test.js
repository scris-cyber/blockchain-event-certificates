const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pruebas del Contrato de Certificados NFT", function () {
  
  // Prueba 1: Verificar que el contrato se despliega correctamente en la red
  it("Debería desplegar el contrato correctamente", async function () {
    const Certificates = await ethers.getContractFactory("Certificates");
    const contrato = await Certificates.deploy();
    // Verificar que la dirección del contrato no sea nula
    expect(contrato.address).to.not.equal(0);
  });

  // Prueba 2: Verificar que se puede emitir (mint) un certificado a un wallet
  it("Debería emitir un nuevo certificado a una dirección específica", async function () {
    const [dueno, usuario1] = await ethers.getSigners();
    const Certificates = await ethers.getContractFactory("Certificates");
    const contrato = await Certificates.deploy();

    // Simular la creación de un certificado para el usuario1
    await contrato.safeMint(usuario1.address, "ipfs://url-del-certificado");
    
    // Verificar que el balance del usuario1 haya subido a 1
    expect(await contrato.balanceOf(usuario1.address)).to.equal(1);
  });

  // Prueba 3: Verificar que el enlace (URI) del certificado sea el correcto
  it("Tiene que devolver el URI correcto del token generado", async function () {
    const [dueno, usuario1] = await ethers.getSigners();
    const Certificates = await ethers.getContractFactory("Certificates");
    const contrato = await Certificates.deploy();

    const enlaceMeta = "ipfs://datos-de-mi-certificado-nft";
    await contrato.safeMint(usuario1.address, enlaceMeta);
    
    // Verificar que el URI guardado en el token 0 sea el que nosotros enviamos
    expect(await contrato.tokenURI(0)).to.equal(enlaceMeta);
  });
});
