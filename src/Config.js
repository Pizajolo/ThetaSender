const API_URL = "https://open-theta.de/api/";
const ABI_TNT721 = [
    "function balanceOf(address _owner) view returns (uint256)",
    "function ownerOf(uint256 _tokenId) view returns (address)",
    "function tokenURI(uint256 _tokenId) view returns (string memory)",
    "function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)",
    "function approve(address to, uint256 tokenID)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)",
    "function setApprovalForAll(address operator, bool approved)",
    "function getApproved(uint256 tokenId) view returns (address)",
    "event Approval(address indexed owner, address indexed to, uint256 tokenId)",
];

const ABI_TNT20 = [
    "function balanceOf(address _owner) view returns (uint256)",
    "function approve(address _spender, uint256 _value) returns (bool)",
    "function allowance(address _owner, address _spender) view returns (uint256)",
]

const ABI_SENDER = [
    "function senderTNT20SendFee(uint256 amount) view returns (uint256)",
    "function senderTFuelSendFee(uint256 amount) view returns (uint256)",
    "function senderTNT721SendFee(uint tokenAmount) view returns (uint256)",
    "function bulkSendTFuel(address[] addresses, uint256[] amounts) payable returns (bool)",
    "function bulkSendTFuelFixed(address[] addresses, uint256 amount) payable returns (bool)",
    "function bulkSendTNT20(address tokenAddr, address[] addresses, uint256[] amounts) payable returns (bool)",
    "function bulkSendTNT20Fixed(address tokenAddr, address[] addresses, uint256 amount) payable returns (bool)",
    "function bulkSendTNT721(address[] nftContracts, address[] addresses, uint256[] tokenIds) payable returns (bool)",
    "function bulkSendTNT721Fixed(address nftContract, address[] addresses, uint256[] tokenIds) payable returns (bool)",
];

const NETWORK_OPTIONS = {
    chainId: "0x169",
    chainName: "Theta Mainnet",
    nativeCurrency: { name: "Theta Fuel", symbol: "TFUEL", decimals: 18 },
    rpcUrls: ["https://eth-rpc-api.thetatoken.org/rpc"],
    blockExplorerUrls: ["https://explorer.thetatoken.org/"],
};

// const NETWORK_OPTIONS = {
//     chainId: "0x16D",
//     chainName: "Theta Testnet",
//     nativeCurrency: { name: "Theta Fuel", symbol: "TFUEL", decimals: 18 },
//     rpcUrls: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
//     blockExplorerUrls: ["https://testnet-explorer.thetatoken.org/"],
// };

const SENDER_ADDRESS = '0xfe6e1cc52cd11ec50183050430ba3d4c7a5a805f';
export default API_URL;
export {ABI_TNT721, ABI_TNT20, NETWORK_OPTIONS, ABI_SENDER, SENDER_ADDRESS};
