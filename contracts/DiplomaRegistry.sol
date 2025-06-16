// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiplomaRegistry {
    address public admin;
    
    struct Diploma {
        string studentName;
        string degree;
        string university;
        uint256 date;
    }
    
    mapping(address => Diploma[]) public diplomas;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function addDiploma(
        address student,
        string memory studentName,
        string memory degree,
        string memory university,
        uint256 date
    ) public onlyAdmin {
        diplomas[student].push(Diploma(studentName, degree, university, date));
    }

    function getDiplomas(address student) public view returns (
        string[] memory names,
        string[] memory degrees,
        string[] memory universities,
        uint256[] memory dates
    ) {
        Diploma[] memory studentDiplomas = diplomas[student];
        names = new string[](studentDiplomas.length);
        degrees = new string[](studentDiplomas.length);
        universities = new string[](studentDiplomas.length);
        dates = new uint256[](studentDiplomas.length);
        
        for (uint i = 0; i < studentDiplomas.length; i++) {
            names[i] = studentDiplomas[i].studentName;
            degrees[i] = studentDiplomas[i].degree;
            universities[i] = studentDiplomas[i].university;
            dates[i] = studentDiplomas[i].date;
        }
    }
}