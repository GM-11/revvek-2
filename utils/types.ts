type VehicleData = {
    id: number;
    brand: string;
    model: string;
    price: number;
    sellerType: SellerType;
    owner: string;
    imageLink: string;
    listed: boolean;
  };
  
  enum SellerType {
    Resell,
    Direct,
    None,
  }
  
  export { SellerType };
  export type { VehicleData };
  // uint256 _id;
  //         string _name;
  //         uint256 _price;
  //         SellerType _sellerType;
  //         address _owner;
  //         string _imageLink;
  