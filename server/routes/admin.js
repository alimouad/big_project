const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/pg');


const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;



const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);

        // Attach the user ID to the req object
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.redirect('/login');
    }
};

router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "Regiter",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/register', { locals, layout: adminLayout })

    } catch (error) {
        console.log(error);
    }
});

router.get('/login', (req, res) => {
    const locals = {
        title: "Login",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    res.render('admin/login', { locals, layout: adminLayout });
}
)
router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;


    try {
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            res.status(400).send("Wrong email or password !");

        }
        if (password2 !== password) {
            res.status(400).send("Passwords do not match !");
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).send("Registered successfully!");
        }

    } catch (error) {
        console.log(error);
    }

});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
});


router.get('/dashboard/', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        };

        const data = await User.findById(req.user.userId); // Use the userId stored in req.user

        // Pass the user data to the template
        res.render('dashboard', {
            locals,
            data, // Only the logged-in user's data
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
});



router.get('/gert-geojson', async (req, res) => {
    try {
        const result = await pool.query('SELECT ST_AsGeoJSON(geom) AS geojson FROM ss');
        const geojson = result.rows.map(row => JSON.parse(row.geojson));
        res.json(geojson);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// logout//////////////
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
});
router.post('/sav-geojson', async (req, res) => {
    const updatedGeoJSON = req.body;
    console.log('Incoming GeoJSON:', updatedGeoJSON);

    // Ensure that geometry exists
    if (!updatedGeoJSON.geometry) {
        return res.status(400).json({ error: 'Invalid GeoJSON: Missing geometry' });
    }

    // Default to an empty object if properties are missing
    const properties = updatedGeoJSON.properties || {};

    // Extract 'id' from properties
    const { id } = properties;
    const geometry = updatedGeoJSON.geometry;

    if (!id) {
        return res.status(400).json({ error: 'GeoJSON must include an ID in properties.' });
    }

    try {
        // Update the PostGIS database using the id and new geometry
        const query = `
            UPDATE your_table
            SET geom = ST_GeomFromGeoJSON($1) -- Converts GeoJSON to PostGIS geometry
            WHERE id = $2
        `;

        await pool.query(query, [JSON.stringify(geometry), id]);

        res.json({ message: 'GeoJSON updated successfully' });
    } catch (error) {
        console.error('Error updating GeoJSON:', error);
        res.status(500).json({ error: 'Failed to update GeoJSON' });
    }
});

router.post('/upload-geojson', async (req, res) => {
    const geojson = req.body;
    if (!geojson || !geojson.features) {
        return res.status(400).json({ error: 'Invalid GeoJSON format' });
    }

    try {
        // Extract features from GeoJSON
        const features = geojson.features;

        for (const feature of features) {
            const geometry = feature.geometry;
            const properties = feature.properties;

            // Insert the geometry and properties into your PostGIS table
            const query = `
                INSERT INTO ali (geom, properties)
                VALUES (ST_GeomFromGeoJSON($1), $2)
            `;

            await pool.query(query, [JSON.stringify(geometry), JSON.stringify(properties)]);
        }

        res.json({ message: 'GeoJSON uploaded and stored successfully' });
    } catch (error) {
        console.error('Error storing GeoJSON:', error);
        res.status(500).json({ error: 'Failed to store GeoJSON' });
    }
});
router.get('/get-geojson', async (req, res) => {
    try {
        const query = `
            SELECT jsonb_build_object(
                'type', 'FeatureCollection',
                'features', jsonb_agg(
                    jsonb_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(geom)::jsonb,
                        'properties', properties
                    )
                )
            ) AS geojson
            FROM ali;
        `;

        const result = await pool.query(query);
        const geojson = result.rows[0].geojson;


        res.json({
            geojson: geojson,
            fileName: 'postgis_data.geojson'  // Mock file name
        });
    } catch (error) {
        console.error('Error fetching GeoJSON:', error);
        res.status(500).json({ error: 'Failed to fetch GeoJSON' });
    }
});

router.post('/store-geojson', async (req, res) => {
    const { fileName, geojson } = req.body;
    if (!geojson || !geojson.features) {
        return res.status(400).json({ error: 'Invalid GeoJSON format' });
    }

    try {
        // Extract features from GeoJSON
        const features = geojson.features;

        for (const feature of features) {
            const geometry = feature.geometry;
            const properties = feature.properties;

            // Insert the geometry and properties into your PostGIS table
            const query = `
                INSERT INTO mouad (geom, properties)
                VALUES (ST_GeomFromGeoJSON($1), $2)
            `;

            await pool.query(query, [JSON.stringify(geometry), JSON.stringify(properties)]);
        }

        res.json({ message: 'GeoJSON uploaded and stored successfully' });
    } catch (error) {
        console.error('Error storing GeoJSON:', error);
        res.status(500).json({ error: 'Failed to store GeoJSON' });
    }
});
router.post('/save-geojson', async (req, res) => {
    const { fileName, geojson } = req.body;
    if (!geojson || !geojson.features) {
        return res.status(400).json({ error: 'Invalid GeoJSON format' });
    }

    try {
        // Extract features from GeoJSON
        const features = geojson.features;

        for (const feature of features) {
            const geometry = feature.geometry;
            const properties = feature.properties;

            // Insert the geometry and properties into your PostGIS table
            const query = `
                INSERT INTO mouad (geom, properties)
                VALUES (ST_GeomFromGeoJSON($1), $2)
            `;

            await pool.query(query, [JSON.stringify(geometry), JSON.stringify(properties)]);
        }

        res.json({ message: 'GeoJSON uploaded and stored successfully' });
    } catch (error) {
        console.error('Error storing GeoJSON:', error);
        res.status(500).json({ error: 'Failed to store GeoJSON' });
    }
});

module.exports = router;