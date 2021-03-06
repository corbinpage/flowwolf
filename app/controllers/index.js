var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportConf = require(__base + 'config/passport');
var multer = require('multer');
var path = require('path');

var Instance = require(__base + 'app/models/instance');
var models = require(__base + 'app/models/index');

var upload = multer({ dest: path.join(__base, 'uploads') });
var homeController = require(__base + 'app/controllers/home');
var userController = require(__base + 'app/controllers/user');
var apiController = require(__base + 'app/controllers/api');
var contactController = require(__base + 'app/controllers/contact');

/* Home */
// router.get('/', function(req, res) {
//   res.redirect('/decision');
// });

/* INDEX Decisions */
router.get('/decision', function(req, res, next) {
  models.Decision.findAll({
   order: ['id']
 })
  .then(function(decisions) {
   res.render('decision', {
    decisions: decisions
  });

 })
});

/* SHOW Decision */
router.get('/decision/:slug', function(req, res, next) {
  models.Decision.findOne({
    where: {slug: req.params.slug},
    include: [models.Input, models.Output, 
    {
      model: models.Rule,
      include: [models.Condition, models.Action]
    }],
    order: ['Rules.order']
  })
  .then(function(decision) {
    res.render('decision/show', {
      decision: decision,
      layout: 'layout/default'
    });

  })
});

/* GET decision run */
router.get('/decision/:slug/run',
  // passport.authenticate('basic', {session: false }),
  function(req, res, next) {
    models.Decision.findOne({
      where: {slug: req.params.slug},
      include: [models.Input, models.Output, 
      {
        model: models.Rule,
        include: [models.Condition, models.Action]
      }]
    })
    .then(function(decision) {
      if(!decision) {
        var err = new Error('Decision not found.');
        err.status = 404;
        next(err);
      } else {
        var instance = new Instance(decision, req.query);
        instance.run()
        .then(function(run_id){
          res.redirect('/decision/' + decision.slug + '/run/' + run_id);
        })
        .catch(function(err){
          var err = new Error('Unable to run Decision.');
          err.status = 404;
          next(err);
        })
      }
    },
    function(err){
      throwError(err);
    });

  });

/* GET run */
router.get('/decision/:slug/run/:id', function(req, res, next) {
  models.Run.findOne({
    where: {id: req.params.id},
    include: [models.Decision, models.InputRun, 
    {
      model: models.ConditionRun,
      include: [models.Rule]
    }],
    order: ['ConditionRuns.id']
  })
  .then(function(run) {
    res.render('run/show', {
      decision: run.Decision,
      run: run,
      layout: 'layout/default'
    });
  })
  .catch(function(err){
    var err = new Error('Unable find decision run.');
    err.status = 404;
    throwError(err);
  })

});

/* SHOW Rule */
router.get('/decision/:slug/rules', function(req, res, next) {
  models.Decision.findOne({
    where: {slug: req.params.slug},
    include: [models.Input, models.Output, 
    {
      model: models.Rule,
      include: [models.Condition, models.Action]
    }],
    order: ['Rules.order']
  })
  .then(function(decision) {
    res.render('rule', {
      decision: decision,
      layout: 'layout/default'
    });

  })
});

function throwError(err) {
  err.status = err.status ? err.status : 404;
  err.message = err.message ? err.message : 'Unknown Error';
  next(err);
}

router.get('/', homeController.index);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/contact', contactController.getContact);
router.post('/contact', contactController.postContact);
router.get('/account', passportConf.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
router.get('/api', apiController.getApi);
router.get('/api/lastfm', apiController.getLastfm);
router.get('/api/nyt', apiController.getNewYorkTimes);
router.get('/api/aviary', apiController.getAviary);
router.get('/api/steam', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getSteam);
router.get('/api/stripe', apiController.getStripe);
router.post('/api/stripe', apiController.postStripe);
router.get('/api/scraping', apiController.getScraping);
router.get('/api/twilio', apiController.getTwilio);
router.post('/api/twilio', apiController.postTwilio);
router.get('/api/clockwork', apiController.getClockwork);
router.post('/api/clockwork', apiController.postClockwork);
router.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
router.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
router.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
router.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
router.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
router.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
router.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
router.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
router.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
router.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
router.get('/api/yahoo', apiController.getYahoo);
router.get('/api/paypal', apiController.getPayPal);
router.get('/api/paypal/success', apiController.getPayPalSuccess);
router.get('/api/paypal/cancel', apiController.getPayPalCancel);
router.get('/api/lob', apiController.getLob);
router.get('/api/bitgo', apiController.getBitGo);
router.post('/api/bitgo', apiController.postBitGo);
router.get('/api/upload', apiController.getFileUpload);
router.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);

/**
 * OAuth authentication routes. (Sign in)
 */
router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
router.get('/auth/foursquare', passport.authorize('foursquare'));
router.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
router.get('/auth/tumblr', passport.authorize('tumblr'));
router.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
router.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
router.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});
router.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
router.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

module.exports = router;