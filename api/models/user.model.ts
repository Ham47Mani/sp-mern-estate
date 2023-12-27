import { CallbackWithoutResultAndOptionalError, Schema, model } from "mongoose";
import { USER } from "../utils/modale.type";
import { hashPassword, isMatchedPassword } from "../utils/bcrypt.util";

// Create user schema
const userSchema: Schema<USER> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }
  }, {
    timestamps: true// Add timestamps option to automatically generate createdAt and updatedAt fields
  }
);

// Crypt the password before save it
userSchema.pre("save", async function (next: CallbackWithoutResultAndOptionalError) {
  if(!this.isModified('password')) {
    next();
  }
  const hashedPassword = await hashPassword(this.password);
  this.password = hashedPassword;
});

// Check match password
userSchema.methods.isPasswordMatched = async function (entrePassword: string) : Promise<boolean> {
  return isMatchedPassword(entrePassword, this.password);
};

export default model<USER>("User", userSchema);