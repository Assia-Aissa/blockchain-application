const Migrations = artifacts.require("DiplomaRegistry");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

