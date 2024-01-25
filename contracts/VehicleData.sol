// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VecFT.sol";

contract VehicleData {
    address privateAccount = 0x1a9c1ee777baDDbF0CD2978741a08983Cdd7481B;

    enum SellerType {
        Resell,
        Direct,
        None
    }

    struct Vehicle {
        uint256 _id;
        string _brand;
        string _model;
        uint256 _price;
        SellerType _sellerType;
        address _owner;
        string _imageLink;
        bool _listed;
    }

    VecFT public vecFT;

    mapping(uint256 => Vehicle) public vehicles;
    uint256 public totalVehicles = 0;

    // modifier enoughBalance(uint256 amount) {
    //     require(
    //         vehicleToken.balanceOf(msg.sender) >= amount,
    //         "Not enough balance"
    //     );
    //     _;
    // }

    // modifier exactAmount(uint256 id, uint256 amount) {
    //     require(
    //         vehicleData.getVehicle(id)._price == amount,
    //         "Please pay the exact amount"
    //     );
    //     _;
    // }

    function createVehicle(
        string memory _brand,
        string memory _model,
        uint256 _price,
        uint256 _id,
        SellerType _sellerType,
        string memory _imageLink
    ) public {
        vehicles[totalVehicles++] = Vehicle(
            _id,
            _brand,
            _model,
            _price,
            _sellerType,
            msg.sender,
            _imageLink,
            true
        );
    }

    function getAllVehicles() public view returns (Vehicle[] memory) {
        Vehicle[] memory _vehicles = new Vehicle[](totalVehicles);

        for (uint256 i = 0; i < totalVehicles; i++) {
            _vehicles[i] = vehicles[i];
        }

        return _vehicles;
    }

    function getVehicle(uint256 _id) public view returns (Vehicle memory) {
        for (uint256 i = 0; i < totalVehicles; i++) {
            if (vehicles[i]._id == _id) {
                return vehicles[i];
            }
        }

        return
            Vehicle(0, "unknown", "unkown", 0, SellerType.None, msg.sender, "", false);
    }

    function transferOwnership(uint256 _id, address _newOwner) public {
        for (uint256 i = 0; i < totalVehicles; i++) {
            if (vehicles[i]._id == _id) {
                vehicles[i]._owner = _newOwner;
            }
        }
    }

    function buyVehicle(uint256 id) public payable {
        Vehicle memory vehicle = getVehicle(id);
        (bool sent, ) = payable(vehicle._owner).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        vehicle._owner = msg.sender;
        vehicle._listed = false;
    }
}
