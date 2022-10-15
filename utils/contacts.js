const fs = require('fs');

//reade and create folder
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const dataPath = './data/contact.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

//ambil semua data contact di json
const loadContact = () => {
    const file = fs.readFileSync('data/contact.json', 'utf8')
    const contacts = JSON.parse(file)
    return contacts;
}

//cari contact berdasarkan nama
const findContact = (nama)=>{
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

module.exports = {loadContact, findContact}