#Sistema de Certificados de Asistencia 
El presente proyecto, es basado en la asistencia a eventos en el concepto de POAP, implementado con Smart Contracts propios en Solidity.

##1. Descripción del sistema
Este proyecto propone una solución para registrar la asistencia a eventos académicos, charlas o webinars mediante el uso de Smart Contracts propios. El objetivo es que un organizador pueda emitir un comprobante digital inmutable de participación sin depender de infraestructuras externas.

El sistema no utiliza la infraestructura directa de POAP, sino que implementa su propia lógica de registro on-chain.

##2. Arquitectura del Proyecto
El sistema se organiza en tres capas técnicas fundamentales para garantizar su funcionamiento descentralizado:

2.1 Capa de Aplicación (Frontend): Base preliminar en HTML/JS (ubicada en la carpeta /web) que servirá para la futura interacción con el usuario y la conexión con billeteras digitales.

2.2 Capa de Lógica (Smart Contract): Contrato AttendanceRegistry.sol encargado de gestionar la creación de eventos, el registro de wallets de asistentes y la verificación de registros.

2.3 Capa de Red: Entorno de ejecución basado en Hardhat para pruebas locales y configurado para el despliegue final en la red de pruebas Polygon Amoy.

##3. Flujo de Transacciones
Fragmento de código
sequenceDiagram
    participant O as Organizador
    participant C as AttendanceRegistry
    participant B as Blockchain (Amoy/Local)
    participant U as Usuario

    O->>C: Desplegar contrato
    O->>C: Crear evento (ID y Nombre)
    O->>C: Registrar dirección de asistente
    C->>B: Guardar asistencia on-chain
    U->>C: Consultar estado de asistencia
    C-->>U: Retornar verdadero/falso
    O->>C: Cerrar evento (Finalizar registros)
   
##4. Desarrollo de Contratos Inteligentes 
Para esta entrega se desarrolló e implementó el contrato inteligente AttendanceRegistry.sol utilizando Solidity y el entorno Hardhat. Este contrato es la pieza central que permite la autonomía del sistema.

##5. Funcionalidades principales desarrolladas:

5.1 Creación de eventos: Permite al organizador inicializar eventos únicos.

5.2 Registro de asistencia: Almacena las direcciones de los participantes de forma inmutable.

5.3 Verificación de participación: Cualquier usuario puede consultar si una dirección asistió a un evento específico.

5.4 Gestión de estado: Capacidad para cerrar eventos y evitar registros posteriores.

##6. Evidencia de Ejecución Local
El contrato ha sido validado satisfactoriamente bajo los siguientes parámetros:

Compilación: Exitosa mediante Hardhat (Solidity 0.8.20).

Pruebas Unitarias: 4 pruebas aprobadas que cubren el flujo principal de registro y consulta.

Despliegue Local: Contrato desplegado correctamente en la dirección: 0x5FbDB2315678afecb367f032d93F642f64180aa3

##7. Manual para Pruebas Locales
Los siguientes pasos nos permiten en una terminal, verificar el funcionamiento técnico:

7.1 Instalar dependencias: npm install

7.2 Compilar el smart contract: npx hardhat compile

7.3 Ejecutar pruebas unitarias: npx hardhat test

7.4 Levantar blockchain local: npx hardhat node

7.5 Desplegar contrato localmente: npx hardhat run scripts/deploy.js --network localhost

##8. Justificación Técnica
Se optó por desarrollar un contrato propio simplificado para profundizar en el uso de Solidity y Hardhat. Este modelo captura la esencia de la "Prueba de Asistencia" de forma eficiente,lo cual permite una futura integración de una DApp y el despliegue definitivo en una red compatible con EVM como Polygon Amoy.

##9. Autoría
Proyecto desarrollado por Pedro Soto y Sofía Oviedo como parte del curso Blockchain and Distributed Ledgers.
