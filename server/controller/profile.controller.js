const profile = require('../model/profile')
const addressData = require('../model/address')

async function editProfile(req) {
    try {
        await profile.findOneAndUpdate({employeeID: req.body.employeeID}, { 
            $set: { 
                userLName: req.body.userLName,
                userFName: req.body.userFName,
                tel: req.body.tel,
                email: req.body.email
            }
        })
        return true;
    } catch (err) {
        return false;
    }
}

async function editAddress(req) {
    try {
        await addressData.findOneAndUpdate({employeeID: req.employeeID}, { 
            $set: { 
                zip: req.zip,
                city: req.city,
                street: req.street
            }
        })
        return true;
    } catch (err) {
        return false;
    }
}

exports.edit =  (req, res) => {
    var editProfileDone = editProfile(req);
    var editAdderessDone = editAddress(req);
    if(editProfileDone && editAdderessDone){
        return res.status(200).send({message: "success edited"});
    }
    else{res.status(400).send({message: "failed edited"})}

}

exports.view = async (req, res) => {
    const viewProfile = await profile.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0 });
    const viewAddress = await addressData.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    console.log(viewProfile, viewAddress);
    if (!viewProfile || !viewAddress) {
        return res.status(404).send({ message: "Can't find profile or address"})
    } 
    try {
        res.status(200).send({viewProfile, viewAddress});
    } catch (err) { 
        res.status(400).send(err); 
    }
}