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

//GET ALL OF THE BEARS
router.get( '/' , ( req, res ) => {
    db( 'bears' )
        .then( bears => res.status( 200 ).json( bears ) )
        .catch( error => res.status( 500 ).json( error ) )
});

//GET INDIVIDUAL BEARS
router.get( '/:id' , ( req, res ) => {
    db( 'bears' )
        .where({ id: req.params.id })
        .first()
        .then( bear => {
            if( bear ) {
                res.status( 200 ).json( bear );
            } else {
                res.status( 500 ).json( error );
            }
        } )
        .catch( error => res.status( 500 ).json({ message: 'Server Error Retrieving Specific Bear (in bear language)' }) );
});

//ADD A BEAR
router.post( '/' , ( req, res ) => {
    const { name } = req.body
    if( !name ) {
        req.status( 400 ).json({ message: 'WH---WHAT? YYyOO---u RREEEe___eALLY ARE TRYYYYING TOOO--oo Add_ SOMETHINGG WITH NOOOO___O_--- NAME??__ (in bear language)' })
    } else {
        db('bears')
            .insert({ name })
            .then( ids => {
                const [id] = ids;
                db('bears')
                    .where({ id })
                    .first()
                    .then( bear => res.status( 201 ).json( bear ))
            })
            .catch( error => res.status( 500 ).json({ message: error }))
    }
});

//UPDATE A BEAR
router.put( '/:id' , ( req, res ) => {
    db('bears')
        .where({ id: req.params.id })
        .update( req.body )
        .then( count => {
            if ( count > 0 ) {
                db( 'bears' )
                    .where({ id: req.params.id })
                    .first()
                    .then( bear => {
                        res.status( 200 ).json( bear )
                    })
            } else {
                res.status( 404 ).json({ message: 'Zoo unidentified (in bear language)' })
            }
        })
        .catch ( error => {
            res.status( 500 ).json( error )
        })
});

//DELETE A BEAR
router.delete( '/:id' , ( req, res ) => {
    db( 'bears' )
        .where({ id: req.params.id })
        .del()
        .then( count=> {
            if ( count > 0 ) {
                res.status( 204 ).end()
            } else {
                res.status( 404 ).json({ message: 'Bear not found, please BEAR with me (pun)' })
            }
        })
        .catch( error => res.status( 500 ).json( error ))
})

module.exports = router;