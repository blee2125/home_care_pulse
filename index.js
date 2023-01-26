const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Successful response.');
});
  
app.listen(3000, () => console.log('Started on port 3000'));

function formatPhone(phone){
    const noExtention = phone.split(' ')[0]
    const justNumbers = noExtention.split(/[.()-]+/)
    if (justNumbers.length === 4) {
        return justNumbers[1]+justNumbers[2]+justNumbers[3]
    } else {
        return justNumbers[0]+justNumbers[1]+justNumbers[2]
    }
}

function getName(fullName){
    const filterList = ['I', 'II', 'III', 'IV', 'V', 'Mr.', 'Mrs.', 'Ms.', 'Miss']
    const fullNameSplit = fullName.split(' ')
    const justFirstLastName = fullNameSplit.filter(n => {
        if (filterList.includes(n)){
            return undefined
        } else {
            return n
        }      
    })
    return justFirstLastName
}

function fiveDigitZip(zipcode){
    const justFive = zipcode.split('-')
    return justFive[0]
}

function zipToState(zip){
    switch(zip) {
        case '45169':
            return 'Ohio'
        case '23505':
            return 'Virginia'
        case '92998':
            return 'California'
        case '90566':
            return 'California'
        case '59590':
            return 'Montana'
        case '53919':
            return 'Wisconsin'
        case '33263':
            return 'Florida'
        case '58804':
            return 'Oklahoma'
        case '76495':
            return 'Kansas'
        case '31428':
            return 'Georgia'
        default:
            break;
    }
}

app.get('/get-users', async (req, res) => {
    try{
        const userList = await (await fetch('https://jsonplaceholder.typicode.com/users')).json()

        const filteredUserData = await userList.map(user => {
            return ({
                first_name: getName(user.name)[0],
                last_name: getName(user.name)[1],
                company_name: user.company.name,
                company_full_address: `${user.address.street}, ${user.address.city}, ${zipToState(fiveDigitZip(user.address.zipcode))}, ${fiveDigitZip(user.address.zipcode)}`,
                website: user.website,
                phone: formatPhone(user.phone)
            })
        })

        res.json(filteredUserData)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/send-users', async (req, res) => {
    try{
        const userList = await (await fetch('http://localhost:3000/get-users')).json()

        const uploadData = {
            "userid": "blee2125@gmail.com",
            "password": "9e7cc49b978f43c8aa5d21c95511e529",
            "outputtype": "Json",
            "users": userList
        }

        const apiURL = "https://dev.app.homecarepulse.com/Primary/?FlowId=7423bd80-cddb-11ea-9160-326dddd3e106&Action=api"

        const apiUpload = await fetch(
            apiURL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(uploadData)
            }
        )

        const apiResponseJson = await apiUpload.json()

        res.json(apiResponseJson)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})