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
const findContact = (nama) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}


//method menulis file contacts.json dengan data baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contact.json', JSON.stringify(contacts))
}

//untuk menambah data ke dalam array
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

// cek nama yang sama
const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama === nama)
}

//Hapus contact
const deleteContact = (nama) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama)
    // console.log(filteredContacts)
    saveContacts(filteredContacts)
}


module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact }