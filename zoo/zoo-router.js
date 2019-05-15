const Knex = require( 'knex' );
const router = require( 'express' ).Router();

const KnexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3'
    },
    useNullAsDefault: true,
    debug: true
}

const db = Knex(KnexConfig);

//GET ALL OF THE ZOOS
router.get( '/' , ( req, res ) => {
    db( 'zoos' )
        .then( zoos => res.status( 200 ).json( zoos ) )
        .catch( error => res.status( 500 ).json( error ) )
});

//GET INDIVIDUAL ZOOS
router.get( '/:id' , ( req, res ) => {
    db( 'zoos' )
        .where({ id: req.params.id })
        .first()
        .then( zoo => {
            if( zoo ) {
                res.status( 200 ).json( zoo );
            } else {
                res.status( 500 ).json( error );
            }
        } )
        .catch( error => res.status( 500 ).json({ message: 'Server Error Retrieving Specific Zoo' }) );
});

//ADD A ZOO
router.post( '/' , ( req, res ) => {
    const { name } = req.body
    if( !name ) {
        req.status( 400 ).json({ message: 'WH---WHAT? YYyOO---u RREEEe___eALLY ARE TRYYYYING TOOO--oo Add_ SOMETHINGG WITH NOOOO___O_--- NAME??__' })
    } else {
        db('zoos')
            .insert({ name })
            .then( ids => {
                const [id] = ids;
                db('zoos')
                    .where({ id })
                    .first()
                    .then( zoo => res.status( 201 ).json( zoo ))
            })
            .catch( error => res.status( 500 ).json({ message: error }))
    }
});

//UPDATE A ZOO
router.put( '/:id' , ( req, res ) => {
    db('zoos')
        .where({ id: req.params.id })
        .update( req.body )
        .then( count => {
            if ( count > 0 ) {
                db( 'zoos' )
                    .where({ id: req.params.id })
                    .first()
                    .then( zoo => {
                        res.status( 200 ).json( zoo )
                    })
            } else {
                res.status( 404 ).json({ message: 'Zoo unidentified' })
            }
        })
        .catch ( error => {
            res.status( 500 ).json( error )
        })
});

//DELETE A ZOO
router.delete( '/:id' , ( req, res ) => {
    db( 'zoos' )
        .where({ id: req.params.id })
        .del()
        .then( count=> {
            if ( count > 0 ) {
                res.status( 204 ).end()
            } else {
                res.status( 404 ).json({ message: 'Zoo not found' })
            }
        })
        .catch( error => res.status( 500 ).json( error ))
})

module.exports = router;