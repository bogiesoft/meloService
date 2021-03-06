var express = require('express');
var router = express.Router();
var connection = require('../module/connect');
var fs = require("fs");

function rename(image) {
    let extension = image.split(".").pop();
    let newFilename = Date.now() + "." + extension;
    return newFilename;
}

/* GET  */
router.get('/', function (req, res) {
    res.render('api');
});

// restaurant
router.get("/restaurant", (req, res) => {
    let sql = "SELECT * FROM restaurant";
    connection.query(sql, (err, result) => {
        if (err) {
            console.log('ไม่สามารถดึงข้อมูล restaurant ได้');
            throw err;
        }
        res.json(result);
    })
})

// restaurant comment
router.get("/restaurant/comment/:id", (req, res) => {
    let id = req.params.id;
    let sql = "SELECT id_comment, detail_comment FROM comment INNER JOIN restaurant ON comment.id_restaurant = restaurant.id_restaurant WHERE restaurant.id_restaurant = " + id;
    connection.query(sql, (err, result) => {
	if (err) {
	    console.log("ไม่สามารถดึง comment ได้");
	    throw err;
	}
	res.json(result);
    })
})

router.post("/restaurant/comment/new", (req, res) => {
    let id = req.body.id;
    let comment = req.body.comment;
    let sql = `INSERT INTO comment(detail_comment, id_restaurant) VALUES ('${comment}', '${id}')`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
	     res.json({ status: "success", message: "Success" });
	} else {
	     res.json({ status: "error", message: "Error" });
	}
    })
})

// -------------------

router.get('/restaurant_detail/:id', (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM restaurant WHERE id_restaurant =" + id;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('ไม่สามารถดึงข้อมูล restaurant ได้');
            throw err;
        }
        res.json(result);
    });
});


router.get('/restaurant/:id', (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM restaurant_category INNER JOIN restaurant ON restaurant_category.id_restaurant_category = restaurant.id_restaurant_category WHERE restaurant.id_restaurant_category =" + id;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('ไม่สามารถดึงข้อมูล restaurant ได้');
            throw err;
        }
        res.json(result);
    });
});

router.get('/restaurant_category', (req, res) => {
    let sql = "SELECT * FROM restaurant_category";
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("ไม่สามารถดึง restaurant_catrgory ได้");
            throw err;
        }
        res.json(result);
    });
});

router.get('/restaurant_image/:id', (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM restaurant INNER JOIN restaurant_image ON restaurant.id_restaurant = restaurant_image.id_restaurant WHERE restaurant.id_restaurant =" + id;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("ไม่สามารถดึง restaurant_image ได้");
            throw err;
        }
        res.json(result);
    });
});

router.post('/newrestaurant_image', (req, res) => {
    let id = req.body.id;
    let filename = rename("apple.jpg");
    let imageData = req.body.imageData;
    let imageToReplace = imageData.replace("data:image/jpeg;base64,", "");
    
    fs.mkdir("../images", () => {
        fs.writeFileSync("../images/" + filename, imageToReplace, "base64");
        console.log("created image success");
    })

    let sql = `INSERT INTO restaurant_image (name_restaurant_image, id_restaurant) VALUES ('${filename}', '${id}')`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result) {
            res.json({ status: "success", message: "Success" });
        } else {
            res.json({ status: "error", message: "Error" });
        }
    })

})

// menu
router.get('/menu', (req, res) => {
    let sql = "SELECT * FROM menu";
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("ไม่สามารถดึง menu ได้");
            throw err;
        }
        res.json(result);
    });
});

router.get('/menu/:id', (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM menu INNER JOIN restaurant ON menu.id_menu = restaurant.id_menu WHERE menu.id_menu = " + id;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("ไม่สามารถดึง menu จาก id ได้");
            throw err;
        }
        res.json(result);
    });
});

// user
router.post('/user_insert', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    let sql = `INSERT INTO user(username_user, password_user, email_user) VALUES ('${username}', '${password}', '${email}')`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log("ไม่สามารถเพิ่ม user ได้");
            throw err;
        } else {
            // result มีค่า
            if (result) {
                res.json({ status: "success", message: "Success", subMessage: "Congratulations your accound has been successfully created" });
            } else {
                res.json({ status: "error", message: "Error", subMessage: "Ooops.. something wrong, try one more time" });
            }
        }
    });
});


module.exports = router;
