const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts')
const { body, validationResult, check, cookie } = require('express-validator');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')




const app = express()
const port = 3000


//menggunakan ejs

app.set('view engine', 'ejs')

//Third-party middleware
app.use(expressLayouts)

//built-in middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}

))

app.use(flash())

//third-party middleware

app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Dwi Sandi',
            email: 'sandi@mail.com'
        },
        {
            nama: 'Achmad',
            email: 'achmad@mail.com'
        },
        {
            nama: 'Bambang P',
            email: 'bamp@mail.com'
        },
    ]
    res.render('index', { nama: 'Sandi YS', layout: 'layouts/main', title: 'Page Home', mahasiswa })
})
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main',
        title: 'Halaman About'
    })

})
app.get('/contact', (req, res) => {
    const contacts = loadContact()
    console.log(contacts)
    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman contact',
        contacts,
        msg: req.flash('msg')
    })
})


//routes tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main'
    })
})

//proses data contact
app.post('/contact', [
    body('nama').custom((value) => {
        const duplicate = cekDuplikat(value)
        if (duplicate) {
            throw Error('Nama contact sudah ada')
        }
        return true
    }),
    check('email', 'Email salah').isEmail(), check('noHp', 'Nomor Handphone salah').isMobilePhone('id-ID')], (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('add-contact', {
                title: 'Form Tambah Data Contact',
                layout: 'layouts/main',
                errors: errors.array()
            })
        } else {
            addContact(req.body)
            //kirimkan flash message
            req.flash('msg', 'Data contact berhasi ditambahkan!')
            res.redirect('/contact')
        }

        // console.log(req.body)
        // res.send('Data berhasil dikirim')

    })

//Proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    // Jika kontak tidak ada
    if (!contact) {
        res.status(404)
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.nama)
        req.flash('msg', 'Data contact berhasi dihapus.')
        res.redirect('/contact')
    }
})

app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main',
        contact
    })
})

//prosses ubah data
app.post('/contact/update', [
    body('nama').custom((value, {req}) => {
        const duplicate = cekDuplikat(value)
        if (value !== req.body.oldNama && duplicate) {
            throw Error('Nama contact sudah ada')
        }
        return true
    }),
    check('email', 'Email salah').isEmail(), check('noHp', 'Nomor Handphone salah').isMobilePhone('id-ID')], (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('edit-contact', {
                title: 'Form Ubah Data Contact',
                layout: 'layouts/main',
                errors: errors.array(),
                contact: req.body
            })
        } else {
            
            updateContacts(req.body)
            //kirimkan flash message
            req.flash('msg', 'Data contact berhasil diubah!')
            res.redirect('/contact')
        }

        // console.log(req.body)
        // res.send('Data berhasil dikirim')

    })


//detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    // console.log(detail)
    res.render('detail', {
        layout: 'layouts/main',
        title: 'Halaman Detail Contact',
        contact
    })
})

app.get('/product/:id', (req, res) => {
    res.send(`Product ID : ${req.params.id} <br> Category  : ${req.query.category}`)
})


app.use((req, res) => {
    res.status(404)
    res.send('404')
})
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})




// const http = require('http');
// const fs = require('fs')


// const port = 3000
// const server = http.createServer((req, res) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     })
//     const url = req.url

//     const renderHTML = (path, res) => {
//         fs.readFile(path, (err, data) => {
//             if (err) {
//                 res.writeHead(404)
//                 res.write('File not found')
//             } else {
//                 res.write(data)
//             }
//             res.end()
//         })
//     }

//     switch (url) {
//         case '/about':
//             renderHTML('./about.html', res)
//             break;
//         case '/contact':
//             renderHTML('./contact.html', res)
//             break;

//         default:
//             renderHTML('./index.html', res)
//             break;
//     }

//     // if (url === '/about') {
//     //     renderHTML('./about.html', res)
//     // } else if (url === '/contact') {
//     //     renderHTML('./contact.html', res)
//     // }
//     // else {
//     //     renderHTML(',/index.html', res)
//     // }
// }).listen(port, () => {
//     console.log(`Server is listening on port ${port}`)
// })

