import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const loginSchema = new mongoose.Schema(
    {
        utype: {
            type: String,
            required: true,
            enum: ["Admin", "User"],
            default: "User"
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
            index: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

// Hash password before saving
loginSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password for login
loginSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch {
        return false;
    }
};

export default mongoose.model("Login", loginSchema);
