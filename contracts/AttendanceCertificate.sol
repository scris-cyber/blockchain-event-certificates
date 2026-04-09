// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AttendanceCertificate is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public nextEventId;

    struct EventData {
        uint256 id;
        string name;
        bool active;
        uint256 totalClaims;
    }

    mapping(uint256 => EventData) public eventsData;
    mapping(uint256 => mapping(bytes32 => bool)) public validCodeHashes;
    mapping(uint256 => mapping(bytes32 => bool)) public usedCodeHashes;
    mapping(uint256 => mapping(address => bool)) public hasClaimedForEvent;
    mapping(uint256 => uint256) public tokenEvent;

    event EventCreated(uint256 indexed eventId, string name);
    event ClaimCodeAdded(uint256 indexed eventId, bytes32 indexed codeHash);
    event CertificateClaimed(
        uint256 indexed eventId,
        address indexed attendee,
        uint256 indexed tokenId
    );
    event EventClosed(uint256 indexed eventId);

    constructor() ERC721("Attendance Certificate", "ATC") Ownable(msg.sender) {}

    function createEvent(string memory name) external onlyOwner returns (uint256) {
        uint256 eventId = nextEventId;

        eventsData[eventId] = EventData({
            id: eventId,
            name: name,
            active: true,
            totalClaims: 0
        });

        nextEventId++;
        emit EventCreated(eventId, name);
        return eventId;
    }

    function addClaimCode(uint256 eventId, bytes32 codeHash) external onlyOwner {
        require(eventsData[eventId].active, "Evento inactivo");
        require(!validCodeHashes[eventId][codeHash], "Codigo ya cargado");

        validCodeHashes[eventId][codeHash] = true;
        emit ClaimCodeAdded(eventId, codeHash);
    }

    function addClaimCodes(uint256 eventId, bytes32[] memory codeHashes) external onlyOwner {
        require(eventsData[eventId].active, "Evento inactivo");

        for (uint256 i = 0; i < codeHashes.length; i++) {
            bytes32 codeHash = codeHashes[i];
            if (!validCodeHashes[eventId][codeHash]) {
                validCodeHashes[eventId][codeHash] = true;
                emit ClaimCodeAdded(eventId, codeHash);
            }
        }
    }

    function claimCertificate(
        uint256 eventId,
        string memory code,
        string memory tokenURI_
    ) external returns (uint256) {
        require(eventsData[eventId].active, "Evento inactivo");
        require(!hasClaimedForEvent[eventId][msg.sender], "Wallet ya reclamo");

        bytes32 codeHash = keccak256(abi.encodePacked(code));

        require(validCodeHashes[eventId][codeHash], "Codigo invalido");
        require(!usedCodeHashes[eventId][codeHash], "Codigo ya usado");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        usedCodeHashes[eventId][codeHash] = true;
        hasClaimedForEvent[eventId][msg.sender] = true;
        tokenEvent[tokenId] = eventId;
        eventsData[eventId].totalClaims++;

        _nextTokenId++;

        emit CertificateClaimed(eventId, msg.sender, tokenId);
        return tokenId;
    }

    function hasClaimed(uint256 eventId, address attendee) external view returns (bool) {
        return hasClaimedForEvent[eventId][attendee];
    }

    function closeEvent(uint256 eventId) external onlyOwner {
        require(eventsData[eventId].active, "Evento ya cerrado");
        eventsData[eventId].active = false;
        emit EventClosed(eventId);
    }
}
