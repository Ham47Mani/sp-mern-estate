

// ---------------- User Modal Type ----------------
export interface USER {
  _id: string
  username: string,
  email: string,
  password: string,
  photo: string,
  createdAt: Date,
  updatedAt: Date,
  __v?: number
}

// ---------------- User Modal Type ----------------
export interface LISTING {
  name: string,
  description: string,
  address: string,
  regularPrice: number,
  discountPrice?: number,
  bathRooms: number,
  badRooms: number,
  furnished: boolean,
  parking: boolean,
  type: "sell" | "rent",
  offer: boolean,
  imageURLs: string[],
}