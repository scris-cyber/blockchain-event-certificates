# blockchain-event-certificates

Minimal blockchain architecture project for event attendance certificates using POAP.

## Descripción del sistema

Este proyecto propone una solución mínima para la emisión de certificados de asistencia a eventos utilizando POAP (Proof of Attendance Protocol). El objetivo es representar la asistencia de una persona a un evento académico, charla, taller o conferencia mediante un certificado digital verificable.

En lugar de desarrollar un contrato inteligente propio, la solución reutiliza la infraestructura de POAP como protocolo especializado en certificados de asistencia. De esta forma, se reduce la complejidad técnica del prototipo y se enfoca el proyecto en el análisis de arquitectura, el flujo de transacciones y la interacción entre componentes.

El sistema está diseñado para que un organizador cree un evento, habilite un método de distribución del certificado y permita que los asistentes reclamen su comprobante digital al finalizar o durante la actividad.

## Arquitectura

La arquitectura mínima del sistema está compuesta por los siguientes elementos:

1. **Organizador del evento**  
   Responsable de crear el evento y configurar la distribución del certificado de asistencia.

2. **Frontend web**  
   Interfaz simple donde el asistente visualiza información del evento y accede al proceso de reclamo del certificado.

3. **POAP**  
   Protocolo que gestiona la creación del evento, la distribución del claim y la emisión del certificado digital.

4. **Asistente**  
   Usuario que participó en el evento y desea reclamar su certificado.

5. **Wallet o correo electrónico**  
   Medio por el cual el asistente recibe o reserva el certificado.

## Flujo de transacciones

1. El organizador crea el evento de certificados de asistencia en POAP.
2. POAP revisa y aprueba el evento.
3. El organizador recibe el mecanismo de distribución del claim.
4. El asistente accede al enlace o flujo de reclamo desde la interfaz web.
5. El asistente ingresa su wallet o correo electrónico.
6. POAP emite o reserva el certificado digital de asistencia.
7. El asistente conserva el POAP como evidencia de participación en el evento.

```mermaid
sequenceDiagram
    participant O as Organizador
    participant P as POAP
    participant U as Usuario
    participant W as Wallet/Correo

    O->>P: Crear evento
    P-->>O: Evento aprobado
    O->>U: Compartir acceso de claim
    U->>P: Reclamar certificado
    U->>P: Ingresar wallet o correo
    P->>W: Emitir o reservar POAP
    P-->>U: Certificado disponible

## Diagrama de componentes

```mermaid
flowchart LR
    A[Organizador del evento] --> B[Frontend web]
    A --> C[POAP]
    B --> C
    D[Asistente] --> B
    D --> E[Wallet o correo]
    C --> E
