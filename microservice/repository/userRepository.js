import db from '../startup/mysql.js'
import bcrypt from 'bcryptjs'
import uuid from 'node-uuid'
import moment from 'moment-timezone'

const User = db.users
const UserRoles = db.userRoles

export default {
    createUser : async (body)=>{
        const salt = await bcrypt.genSaltSync(10);
        body.password = await bcrypt.hashSync(body.password, salt);
        console.log("BODYPASSWORD====",body.password)
        const user = {
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            address: body.address,
            zipcode: body.postal,
            phone: body.phone,
            password: body.password,
            isActive: body.isActive,
            token: uuid.v4()
        }
        

        try {
            const data = await User.create(user)

            const foundUserRole = await UserRoles.findOne({where: {role : body.userRole}});
            console.log(foundUserRole)
            const foundUser = await User.findByPk(data.id);
            await foundUser.addUserRoles(foundUserRole.id);
            return {
                success: true,
                object: data,
                msg: "",
                status: 200
            }

        } catch (error) {
            return {
                success: false,
                object: {},
                msg: "OOPS, something went wrong in createUser " + error,
                status: 405
            }
        }
    },
    createRole : async (body)=>{

        const role = {
            role: body.role,
        }
        
        try {
            const data = await UserRoles.create(role)

            return {
                success: true,
                object: data,
                msg: "",
                status: 200
            }

        } catch (error) {
            return {
                success: false,
                object: {},
                msg: "OOPS, something went wrong in createUser " + error,
                status: 405
            }
        }
    },
    getAllUsers: async () => {
        try {
            const data = await User.findAll({
                include: {
                    model: UserRoles,
                    attributes: ['role']
                }
            });

            return {
                success: true,
                object: data
            }
        }
        catch (error) {
            return {
                success: false,
                object: {},
                msg: "OOPS, something went wrong in getAllUsers" + error,
                status: 405
            }
        }
    },
    getAllUsersSoft: async () => {
        try {
            const data = await User.findAll({
                paranoid: false,
                include: {
                    model: UserRoles,
                    attributes: ['role']
                }
            });

            return {
                success: true,
                object: data
            }
        }
        catch (error) {
            return {
                success: false,
                object: {},
                msg: "OOPS, something went wrong in getAllUsers" + error,
                status: 405
            }
        }
    },
    updateUser: async (body, userId) => {
        try {
            const data = await User.update(body, {where : {id : userId} });

            return {
                success: true,
                object: data
            }
        }
        catch (error) {
            return {
                success: false,
                Object: {},
                msg: "OOPS, something went wrong updateUser" + error,
                status: 405
            }
        }
    },
    verifyUser: async (token) => {
        try {
            const data = await User.update(
                {isActive : true}, 
                {
                    where : {token : token} 
                }
            );

            console.log(data)

            return {
                success: true,
                object: data
            }
        }
        catch (error) {
            return {
                success: false,
                Object: {},
                msg: "OOPS, something went wrong updateUser" + error,
                status: 405
            }
        }
    },
    getUserById: async (userId) => {
        try {
            const data = await User.findOne({
                where: {id : userId},
                include: {
                    model : UserRoles,
                    attributes: ['id', 'role']
                }
            });

            return {
                success: true,
                object: data
            }
        }
        catch (error) {
            return {
                success: false,
                Object: {},
                msg: "OOPS, something went wrong getUserById" + error,
                status: 405
            }
        }
    },
    deleteUser: async (userId) => {
        try {
            const data = await User.destroy({where: {id : userId}});

            return {
                success: true,
                Object: data
            }
        }
        catch (error) {
            return {
                success: false,
                Object: {},
                msg: "OOPS, something went wrong UpdateUser" + error,
                status: 405
            }
        }
    },
    validateUser: async (body) => {
        try {
            const data = await User.findOne({
                where: {email: body.email},
                include: {
                    model : UserRoles,
                    attributes: ['id', 'role']
                }
            });

            
            await User.update(
                {login_time : moment().locale("dk").format('YYYY-MM-DD HH:mm:ss')}, 
                {
                    where : {id : data.id} 
                }
            );


            const validPassword = await bcrypt.compareSync(body.password, data.password)
            // console.log(data.userRoles)
            return {
                isActive : data.isActive,
                userId : data.id,
                userRole: data.userRoles,
                validPassword: validPassword,
                success: true,
                object: data,
                recievedToken: body.key,
                msg: ""
            }
        }
        catch (error) {
            return {
                success: false,
                Object: {},
                msg: "OOPS, something went wrong validateUser" + error,
                status: 405
            }
        }
    },
}