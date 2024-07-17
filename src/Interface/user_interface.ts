
export interface UserDocument {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  state?: string;
  postal_code?: string;
  Country?: string;
  otp?: string;
  OldPassword?: string;
  Newpassword?: string;
  timeSent?: string | null | undefined;
  verified?: string | null | undefined;
}

export interface allProduct {
  id : string;
  category_id:string;
  category_name: string;
  sub_category_id: string;
  sub_category_name: string;
  product_name: string;
  product_img: string;
  description: string;
  price: string;
  quantity_available: string;
  stock_status: string;
  warranty: string;
  specification: string;
  image1: string;
  image2: string;
  image3: string;
  visibility: string;
}
