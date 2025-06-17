// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiplomeRegistry {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Diplome {
        string nom;
        string diplome;
        uint annee;
    }

    mapping(address => Diplome) public diplomes;

    function ajouterDiplome(
        address _etudiant,
        string memory _nom,
        string memory _diplome,
        uint _annee
    ) public {
        require(msg.sender == admin, "only admin can add a diploma");
        diplomes[_etudiant] = Diplome(_nom, _diplome, _annee);
    }

    function consulterDiplome(address _etudiant) public view returns (string memory, string memory, uint) {
        Diplome memory d = diplomes[_etudiant];
        return (d.nom, d.diplome, d.annee);
    }
}