const profile = require('../model/profile')
const addressData = require('../model/address')
const path = require('path')

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

// use to call function to edit the profile and //
// address of user //
exports.edit =  (req, res) => {
    var editProfileDone = editProfile(req);
    var editAdderessDone = editAddress(req);
    if(editProfileDone && editAdderessDone)
        return res.status(200).send({message: "success edited"});
    else
        res.status(400).send({message: "failed edited"})

}

// use to check null of profile //
async function checkProfileNull(data) {
    const noData = "-";
    Object.values(data).forEach(val => console.log(val.tel));
    if (data.employeeID == null) 
        data.employeeID = noData;
    if (data.email == null) 
        data.email = noData;
    if (data.tel == null) 
        data.tel = noData;
    if (data.userFName == null) 
        data.userFName = noData;
    if (data.userLName == null) 
        data.userLName = noData;
    return data;
}
 
// use to check null of address //
async function checkAddressNull(data) {
    const noData = "-";
    if (data.city == null) 
        data.city = noData;
    if (data.street == null) 
        data.street = noData;
    if (data.zip == null) 
        data.zip = noData;
    return data;
}

// function use to view the profile //
exports.view = async (req, res) => {
    const viewProfile = await profile.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0 });
    const viewAddress = await addressData.findOne({employeeID: req.body.employeeID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    if (!viewProfile || !viewAddress) 
        return res.status(404).send({ message: "Can't find profile or address"})
    var checkProfile =  await checkProfileNull(viewProfile); 
    var checkAddress = await checkAddressNull(viewAddress);
    try {
        var view = [checkProfile.employeeID, checkProfile.email, checkProfile.tel, checkProfile.userFName, checkProfile.userLName, 
            checkAddress.city, checkAddress.street, checkAddress.zip];
        res.status(200).send({view});
    } catch (err) { 
        res.status(400).send(err); 
    }
}

// function use to view other profile //
exports.viewOther = async (req, res) => {
    const viewOtherProfile = await profile.findOne({employeeID: req.body.targetID}, { "_id": 0, "__v": 0 });
    const viewOtherAddress = await addressData.findOne({employeeID: req.body.targetID}, { "_id": 0, "__v": 0, "employeeID": 0 });
    if (!viewOtherAddress || !viewOtherProfile) 
        return res.status(404).send({ message: "Can't find profile or address"})
    var checkProfile =  await checkProfileNull(viewOtherProfile); 
    var checkAddress = await checkAddressNull(viewOtherAddress);
    try {
        var view = [checkProfile.employeeID, checkProfile.email, checkProfile.tel, checkProfile.userFName, checkProfile.userLName, 
            checkAddress.city, checkAddress.street, checkAddress.zip];
        res.status(200).send({view});
    } catch (err) { 
        res.status(400).send(err); 
    }
}

// function to add image of user //
exports.addImage = async (req, res) => {
    console.log(req.file);
    console.log(req.body);
    await profile.findOneAndUpdate({employeeID: req.body.employeeID},
        {$set: {
            image: req.file.path 
            }
        },
        { new: true},
        (err, imageProfile) => {
        if (err) 
            return  res.status(400).send(err);
        const response = {
            message: "image added successfully updated",
            data: imageProfile
        };
        return res.status(200).send(response);
        })
}