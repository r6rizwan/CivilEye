import Login from "../models/Login.js";
import Register from "../models/Register.js";

export const createPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ error: "User not verified!" });
        }

        // create login entry
        const login = await Login.create({
            email,
            password,
            utype: "User"
        });


        return res.json({
            message: "Password created successfully",
            login
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
