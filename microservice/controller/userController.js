import generateToken from '../service/middleware/signIn.js'
import userCollection from '../repository/userRepository.js'
import { DATE } from 'sequelize';


class CustomError extends Error {
    constructor(message, customData) {
      super(message);
      this.name = message;
      this.customData = customData;
      Error.captureStackTrace(this, this.constructor);
    }
  }

const createUser = async function (req, res) {
    const mailServiceUrl = process.env.ENVIRONMENT == "prod" ? "<INSERT MAIL SERVICE PROD LINK HERE>" : "http://127.0.0.1:7071/api/HttpExample?requesttype=validate";
    let body = req.body;

    if (!("userRole" in req.body)) {
        body.userRole = 'customer';
    }
    if(!("isActive" in req.body)) {
        body.isActive = false;
    }

    // ======= SAGA PATTERN ========
    try {

        // STEP ONE - Creating user
        let userCreated = await userCollection.createUser(body)
        
        if(!userCreated.success){
            // console.log(userCreated)
            throw new CustomError("something went wrong while trying to create user",userCreated)
        }

        // STEP TWO - Send validation email
        const header = {
            "method" : "POST",
            "body" : JSON.stringify({
                websiteUrl : process.env.ENVIRONMENT == "prod" ? "<INSERT CLIENT PROD LINK HERE>" : "http://localhost:3000/activate/",
                firstname : userCreated.object.firstname,
                lastname : userCreated.object.lastname,
                mail : userCreated.object.email,
                uuid : userCreated.object.token
            })
        }
        // Out commented untill the email service is online

        // let result = await fetch(mailServiceUrl, header);
        // let data = await result.json();

        // // IF ERROR - Initiate rollback
        // if (data.status != 200) {
        //     await userCollection.deleteUser(userCreated.object.id);
            
        //     // 205 - Reset content
        //     throw new CustomError("failed to send the validation email email, rollback initiated", { 
        //         success : false,
        //         msg: "OOPS, something went wrong trying to send verification email", data,
        //         status : 205 
        //     });
        //   }

        // STEP THREE - Final response
        res.status(200).json(userCreated);

    // ERROR HANDLING
    } catch (error) {

        // 409 - Conflict
        res.status(409).json(error);
    }
};

const verifyAccount = async function (req,res) {
    const token = req.params.token    
    console.log(token)
    res.status(200).json(await userCollection.verifyUser(token))
}

const getAllUsers = async function (req, res) {
    const body = req.body;
    console.log(body)
    res.status(200).json(await userCollection.getAllUsers());
};

const createRole = async function (req, res) {
    const body = req.body;
    console.log(body)
    res.status(200).json(await userCollection.createRole(body));
};

const updateUser = async function (req, res) {
    const id = req.params.id
    const body = req.body
    console.log(body)
    res.status(200).json(await userCollection.updateUser(body, id));
}

const getUserById = async function (req, res) {
    const id = req.params.id
    res.status(200).json(await userCollection.getUserById(id));
}

const deleteUser = async function (req, res) {
    const id = req.params.id
    console.log(id)
    res.status(200).json(await userCollection.deleteUser(id));
}

const login = async function (req, res) {
    const body = req.body;
    const validated = await userCollection.validateUser(body);
    // console.log(validated)

    validated.success && validated.validPassword ?
        res.status(202).json({
            userId: validated?.userId, 
            validPassword: validated?.validPassword, 
            generatedToken: generateToken(validated.id, body), 
            msg: validated?.msg, 
            userRole: validated?.userRole,
            isActive : validated?.isActive,
            envTOken: process.env.JWT_PRIVATE_KEY,
            recievedToken: validated.recievedToken
        })
        :
        res.status(401).json({
            validPassword: validated?.validPassword, 
            msg: "Login error" + validated?.msg
        })

}

const verifyedUser = async function (req, res) {
    const result = await userCollection.getUserById(req.body.userId);
    
    let isAdmin = result.object?.userRoles[0].role == 'admin' ? true : false;

    res.status(200).json({veryfied: true, isAdmin});
}

export default {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    login,
    createRole,
    verifyedUser,
    verifyAccount
}