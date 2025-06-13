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

    mapping(address => Diploma[]) private diplomas;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    constructor() {
        admin = msg.sender;
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
        uint length = diplomas[student].length;
        names = new string[](length);
        degrees = new string[](length);
        universities = new string[](length);
        dates = new uint256[](length);
        
        for(uint i = 0; i < length; i++) {
            names[i] = diplomas[student][i].studentName;
            degrees[i] = diplomas[student][i].degree;
            universities[i] = diplomas[student][i].university;
            dates[i] = diplomas[student][i].date;
        }
    }
}