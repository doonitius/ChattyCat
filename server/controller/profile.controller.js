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
        await addressData.findOneAndUpdate({employeeID: req.body.employeeID}, { 
            $set: { 
                zip: req.body.zip,
                city: req.body.city,
                street: req.body.street
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
    if (!viewProfile || !viewAddress) {
        return res.status(404).send({ message: "Can't find profile or address"})
    } 
    try {
        var view = [viewProfile.employeeID, viewProfile.email, viewProfile.tel, viewProfile.userFName, viewProfile.userLName, 
            viewAddress.city, viewAddress.street, viewAddress.zip];
        res.status(200).send({view});
    } catch (err) { 
        res.status(400).send(err); 
    }
}

exports.viewOther = async (req, res) => {
    const viewOtherProfile = await profile.findOne({employeeID: req.body.targetID}, { "_id": 0, "__v": 0 });
    const viewOtherAddress = await addressData.findOne({employeeID: req.body.targetID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    if (!viewOtherAddress || !viewOtherProfile) {
        return res.status(404).send({ message: "Can't find profile or address"})
    }
    try {
        var view = [viewOtherProfile.employeeID, viewOtherProfile.email, viewOtherProfile.tel, viewOtherProfile.userFName, viewOtherProfile.userLName, 
            viewOtherAddress.city, viewOtherAddress.street, viewOtherAddress.zip];
        res.status(200).send({view});
    } catch (err) { 
        res.status(400).send(err); 
    }
}