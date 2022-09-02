// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MBJToken is ERC20, Ownable {
    uint public constant maxTotalSupply = 10000000 * 10 ** 18;

    constructor() ERC20("MBJ Gas", "MBJT") {
        _mint(msg.sender, maxTotalSupply);
    }
}